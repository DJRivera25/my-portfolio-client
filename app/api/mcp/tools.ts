import { z } from "zod";
import type { McpClient } from "@/lib/auth";
import type { McpServer } from "@modelcontextprotocol/server";
import {
  buildReport,
  listWorkEntries,
  logWork,
  setWorkEntryGroup,
  updateWorkEntryStatus,
} from "@/lib/worklog/entries";
import { listWorkProjects, setWorkProjectStatus } from "@/lib/worklog/projects";
import { listWorkGroups } from "@/lib/worklog/groups";
import { endSession, getSessionStatus } from "@/lib/worklog/sessions";
import { attachLink, listAttachments } from "@/lib/worklog/attachmentQueries";
import { formatEntryPage, formatReport } from "@/lib/worklog/format";
import { storableRepo } from "@/lib/worklog/repo";
import { parseSince, parseUntil } from "@/lib/worklog/since";
import {
  WORK_ENTRY_STATUSES,
  WORK_ATTACHMENT_KINDS,
  WORK_PROJECT_STATUSES,
} from "@/lib/worklog/types";

/**
 * Tool descriptions say WHEN to reach for the tool, not only what it does — a tool the
 * model never selects is dead weight. All logic lives in lib/worklog; this file is
 * protocol surface. Arguments are snake_case (MCP convention) and map to the service
 * layer's camelCase here, at the boundary.
 */

const text = (body: string) => ({ content: [{ type: "text" as const, text: body }] });

const sinceArg = z
  .string()
  .optional()
  .describe("Window start: '7d', '24h', '2w', or an ISO date like '2026-08-01'. A bare date is a UTC day; for a local day pass e.g. '2026-11-24T00:00+11:00'.");

const waitingOnArg = z
  .string()
  .optional()
  .describe(
    "Who or what this waits on, as a short name: 'Derem', 'PR #1018', 'Track 4'. " +
      "Pass an empty string to clear. Cleared automatically when done."
  );

function clientOf(ctx?: { http?: { authInfo?: { clientId?: string } } }): McpClient {
  return ctx?.http?.authInfo?.clientId === "claude-ai" ? "claude-ai" : "claude-code";
}

function entryLine(entry: Record<string, unknown> | null): string {
  if (!entry) return "No entry.";
  const project = entry.project as { name?: string } | null;
  const where = project?.name ? ` [${project.name}]` : "";
  return `#${entry.ref} ${entry.title}${where} — ${entry.status}`;
}

export function registerWorklogTools(server: McpServer) {
  server.registerTool(
    "log_work",
    {
      title: "Log work",
      description:
        "Record a piece of work on the worklog. Use it as soon as something is finished, " +
        "started, or blocked — do not batch a whole session into one entry at the end. " +
        "Re-logging the same title within one session_id updates that entry instead of " +
        "duplicating it, so it is safe to call repeatedly as work progresses. Pass status " +
        "'todo' to file something for later; the worklog is also the backlog.",
      inputSchema: z.object({
        project: z
          .string()
          .describe("Project key, e.g. 'toolsaustralia'. Created automatically if new."),
        title: z.string().describe("Short imperative summary, e.g. 'Wire the checkout upsell'."),
        summary: z.string().optional().describe("What actually changed, and why."),
        status: z.enum(WORK_ENTRY_STATUSES).optional().describe("Defaults to 'done'."),
        tags: z.array(z.string()).optional(),
        group: z
          .string()
          .optional()
          .describe(
            "Gathers related entries under one label within the project — a ticket, " +
              "feature or workstream, e.g. 'HCLUB-46' or 'merchandise'. Reuse the same " +
              "label across every entry for that piece of work; spelling variations are " +
              "matched, so 'HCLUB-46' and 'hclub 46' are one group. Attachments inherit it."
          ),
        minutes_spent: z.number().int().positive().optional(),
        branch: z.string().optional(),
        commit_sha: z
          .string()
          .optional()
          .describe("The commit this shipped in. Lets a later session run `git show <sha>`."),
        commit_message: z
          .string()
          .optional()
          .describe("The commit subject line, so the log is readable without the repo."),
        pr_url: z.string().optional(),
        blocked_reason: z.string().optional().describe("Give this whenever status is 'blocked'."),
        waiting_on: waitingOnArg,
        session_id: z
          .string()
          .optional()
          .describe("The current Claude Code session id. Creates and tracks the session."),
      }),
    },
    async (input, ctx) => {
      const entry = await logWork({
        source: clientOf(ctx) === "claude-ai" ? "claude-ai" : undefined,
        project: input.project,
        title: input.title,
        summary: input.summary,
        status: input.status,
        tags: input.tags,
        group: input.group,
        minutesSpent: input.minutes_spent,
        branch: input.branch,
        commitSha: input.commit_sha,
        commitMessage: input.commit_message,
        prUrl: input.pr_url,
        blockedReason: input.blocked_reason,
        waitingOn: input.waiting_on,
        sessionId: input.session_id,
      });
      return text(`Logged ${entryLine(entry as Record<string, unknown> | null)}`);
    }
  );

  server.registerTool(
    "list_work",
    {
      title: "List work",
      description:
        "List worklog entries, newest first, one page at a time. Use it to answer what is " +
        "outstanding (status 'open'), blocked, or waiting on someone, or what was done in a " +
        "window — and check it before starting work so nothing is redone. Always pass " +
        "`project` for your own project; omit it only to look across every project on " +
        "purpose. When there is more than one page, the reply ends with the offset to pass " +
        "for the next.",
      inputSchema: z.object({
        project: z.string().optional().describe("Restrict to one project key."),
        repo: z
          .string()
          .optional()
          .describe("The git remote URL; finds the project by its repo. Ignored if project is given."),
        group: z.string().optional().describe("Restrict to one group label."),
        status: z
          .enum([...WORK_ENTRY_STATUSES, "open"])
          .optional()
          .describe("'open' means todo, in_progress and blocked."),
        text: z.string().optional().describe("Match in the title or summary."),
        waiting_on: z.string().optional().describe("Match who or what the entry waits on."),
        since: sinceArg,
        until: z
          .string()
          .optional()
          .describe("Window end: an ISO date like '2026-08-31' includes that whole day. A bare date is a UTC day; for a local day pass e.g. '2026-11-24T00:00+11:00'."),
        session_id: z.string().optional().describe("Restrict to one Claude Code session id."),
        offset: z.number().int().min(0).optional().describe("Entries to skip. Defaults to 0."),
        limit: z.number().int().min(1).max(100).optional().describe("Defaults to 25."),
      }),
    },
    async (input) => {
      const page = await listWorkEntries({
        project: input.project,
        repo: input.repo,
        group: input.group,
        status: input.status,
        text: input.text,
        waitingOn: input.waiting_on,
        since: parseSince(input.since),
        until: parseUntil(input.until),
        sessionId: input.session_id,
        offset: input.offset,
        limit: input.limit,
      });
      return text(formatEntryPage(page));
    }
  );

  server.registerTool(
    "update_work_status",
    {
      title: "Update work status",
      description:
        "Move an existing entry to a new status by its short ref number (the '#42' shown " +
        "by log_work and list_work). Use it when finishing something previously logged as " +
        "todo or in_progress, or when work becomes blocked. The completion time is " +
        "recorded automatically.",
      inputSchema: z.object({
        ref: z.number().int().describe("The entry's short id, e.g. 42 for '#42'."),
        status: z.enum(WORK_ENTRY_STATUSES),
        blocked_reason: z.string().optional().describe("Why it is blocked. Put the person or thing in waiting_on."),
        waiting_on: waitingOnArg,
      }),
    },
    async (input) => {
      const entry = await updateWorkEntryStatus(
        input.ref,
        input.status,
        input.blocked_reason,
        input.waiting_on
      );
      if (!entry) return text(`No entry #${input.ref}.`);
      return text(`Updated ${entryLine(entry as Record<string, unknown>)}`);
    }
  );

  server.registerTool(
    "list_work_projects",
    {
      title: "List work projects",
      description:
        "List every project on the worklog with its open and blocked counts. Use it for " +
        "an overview before planning, or when unsure which project key to log against. " +
        "These are worklog projects — not the portfolio case studies shown on the site.",
      inputSchema: z.object({}),
    },
    async () => {
      const projects = await listWorkProjects();
      if (!projects.length) return text("No projects yet. log_work creates one automatically.");
      return text(
        projects
          .map(
            (p) =>
              `${p.slug.padEnd(18)} ${p.status.padEnd(9)} ${p.total} logged · ${p.open} open` +
              (p.blocked ? ` · ${p.blocked} blocked` : "")
          )
          .join("\n")
      );
    }
  );

  server.registerTool(
    "set_work_project_status",
    {
      title: "Set work project status",
      description:
        "Update a project's status or metadata — mark it shipped, pause it, archive it, " +
        "or record its repo and description. Use it when a project's lifecycle changes, " +
        "not for individual pieces of work.",
      inputSchema: z.object({
        slug: z.string().describe("Project key, e.g. 'toolsaustralia'."),
        status: z.enum(WORK_PROJECT_STATUSES).optional(),
        name: z.string().optional().describe("Display name, e.g. 'Tools Australia'."),
        description: z.string().optional(),
        repo: z
          .string()
          .optional()
          .describe("The git remote URL; stored normalised and used to match sessions to this project."),
      }),
    },
    async (input) => {
      const project = await setWorkProjectStatus(input.slug, {
        status: input.status,
        name: input.name,
        description: input.description,
        repo: input.repo,
      });
      const refused = input.repo !== undefined && storableRepo(input.repo) === null;
      return text(
        `${project.slug} — ${project.name} (${project.status})` +
          (refused
            ? " — repo not saved: it looks like it carries login details; pass the plain https or git@ URL"
            : "")
      );
    }
  );

  server.registerTool(
    "work_report",
    {
      title: "Work report",
      description:
        "Summarise a period or a project: totals, time tracked, a per-project breakdown, " +
        "and everything currently blocked. Use it for standups, weekly reviews, client " +
        "updates, or whenever asked what has been happening lately.",
      inputSchema: z.object({
        project: z.string().optional().describe("Restrict to one project key."),
        since: sinceArg,
      }),
    },
    async (input) => {
      const digest = await buildReport({
        project: input.project,
        since: parseSince(input.since),
      });
      return text(formatReport(digest));
    }
  );

  server.registerTool(
    "session_status",
    {
      title: "Session status",
      description:
        "Show recent Claude Code sessions and what each covered — or one session by id. " +
        "Use it to pick up where a previous session left off, or to check what is still " +
        "open from earlier work.",
      inputSchema: z.object({
        session_id: z.string().optional().describe("Omit to list the ten most recent."),
      }),
    },
    async (input) => {
      const sessions = await getSessionStatus(input.session_id);
      if (!sessions.length) return text("No sessions recorded.");
      return text(
        sessions
          .map((s) => {
            const where = s.project?.name ? ` [${s.project.name}]` : "";
            const span = s.endedAt ? "ended" : "active";
            const note = s.summary ? `\n      ${s.summary}` : "";
            return `${s.sessionId}${where} — ${span}, ${s.entryCount} entries${note}`;
          })
          .join("\n")
      );
    }
  );

  server.registerTool(
    "end_session",
    {
      title: "End session",
      description:
        "Close out the current session with a short summary of what it achieved. Use it " +
        "when wrapping up a working session, so the next one can read back what happened.",
      inputSchema: z.object({
        session_id: z.string(),
        summary: z.string().optional().describe("A sentence or two on what was accomplished."),
      }),
    },
    async (input) => {
      const session = await endSession(input.session_id, input.summary);
      if (!session) return text(`No session ${input.session_id}.`);
      return text(`Session ${session.sessionId} ended — ${session.entryCount} entries logged.`);
    }
  );

  server.registerTool(
    "attach_link",
    {
      title: "Attach link",
      description:
        "Attach a URL to a project or to a specific entry — a published Claude artifact, " +
        "a PR, a deploy preview, a spec, a repo. Call this immediately after publishing " +
        "an artifact, so the work and the thing it produced stay connected; an artifact " +
        "URL is otherwise lost when the session ends. The kind is inferred from the URL, " +
        "so you rarely need to pass it.",
      inputSchema: z.object({
        project: z.string().describe("Project key, e.g. 'toolsaustralia'."),
        url: z.string().describe("The full https URL."),
        label: z.string().optional().describe("What it is. Inferred from the URL if omitted."),
        kind: z.enum(WORK_ATTACHMENT_KINDS).optional().describe("Inferred if omitted."),
        entry_ref: z
          .number()
          .int()
          .optional()
          .describe("Attach to this entry, e.g. 42 for '#42'. Omit to attach to the project."),
        group: z
          .string()
          .optional()
          .describe("Defaults to the entry's group, so files land with the work."),
      }),
    },
    async (input) => {
      try {
        const a = await attachLink({
          project: input.project,
          url: input.url,
          label: input.label,
          kind: input.kind,
          entryRef: input.entry_ref,
          group: input.group,
        });
        const where = a.entryRef ? ` to #${a.entryRef}` : "";
        return text(`Attached ${a.kind} #${a.ref}${where} — ${a.label}\n${a.url}`);
      } catch (err) {
        return text(`Could not attach: ${(err as Error).message}`);
      }
    }
  );

  server.registerTool(
    "list_attachments",
    {
      title: "List attachments",
      description:
        "List the links attached to a project or a specific entry — artifacts, PRs, " +
        "deploy previews, commits. Use it when asked what evidence or output exists for " +
        "a piece of work, or to find an artifact published in an earlier session so it " +
        "can be reopened.",
      inputSchema: z.object({
        project: z.string().optional(),
        group: z.string().optional(),
        entry_ref: z.number().int().optional(),
        limit: z.number().int().min(1).max(200).optional(),
      }),
    },
    async (input) => {
      const rows = await listAttachments({
        project: input.project,
        group: input.group,
        entryRef: input.entry_ref,
        limit: input.limit,
      });
      if (!rows.length) return text("No attachments.");
      const lines = rows.map((r) => {
        const head = `#${r.ref} ${r.kind.padEnd(9)} ${r.label}`;
        const where = r.entryRef ? ` (entry #${r.entryRef})` : "";
        return `${head}${where}\n     ${r.url}`;
      });
      return text(lines.join("\n"));
    }
  );

  server.registerTool(
    "list_groups",
    {
      title: "List groups",
      description:
        "List the groups work is gathered under — tickets, features, workstreams — with " +
        "open and blocked counts for each. Use it to see what pieces of work are in " +
        "flight before picking something up, or to find the right label to log against " +
        "so a new entry joins existing related work rather than floating alone.",
      inputSchema: z.object({
        project: z.string().optional().describe("Restrict to one project key."),
      }),
    },
    async (input) => {
      const groups = await listWorkGroups(input.project);
      if (!groups.length) {
        return text("No groups yet. Pass `group` to log_work to start one.");
      }
      const lines = groups.map((g) => {
        const where = g.project?.name ? ` [${g.project.name}]` : "";
        const blocked = g.blocked ? ` · ${g.blocked} blocked` : "";
        return `${g.name}${where} — ${g.total} logged · ${g.open} open${blocked}`;
      });
      return text(lines.join("\n"));
    }
  );
  server.registerTool(
    "set_work_group",
    {
      title: "Set work group",
      description:
        "Put existing entries into a group by their ref numbers, or clear the group by " +
        "omitting it. Use this to gather work that was logged before it was clear the " +
        "pieces belonged together — log_work cannot do it, because re-logging an old " +
        "title from a new session creates a second entry rather than updating the first.",
      inputSchema: z.object({
        refs: z
          .array(z.number().int())
          .min(1)
          .describe("Entry refs to group, e.g. [11, 12]."),
        group: z
          .string()
          .optional()
          .describe("The group label. Omit to remove these entries from their group."),
      }),
    },
    async (input) => {
      const updated = await setWorkEntryGroup(input.refs, input.group ?? null);
      if (!updated.length) return text("No matching entries.");
      const label = input.group ? `grouped under "${input.group}"` : "ungrouped";
      const refs = updated.map((e) => `#${(e as unknown as { ref: number }).ref}`).join(", ");
      return text(`${updated.length} entries ${label}: ${refs}`);
    }
  );
}
