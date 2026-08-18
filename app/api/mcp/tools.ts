import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import {
  buildReport,
  listWorkEntries,
  logWork,
  updateWorkEntryStatus,
} from "@/lib/worklog/entries";
import { listWorkProjects, setWorkProjectStatus } from "@/lib/worklog/projects";
import { endSession, getSessionStatus } from "@/lib/worklog/sessions";
import { formatEntries, formatReport } from "@/lib/worklog/format";
import { parseSince } from "@/lib/worklog/since";
import {
  WORK_ENTRY_STATUSES,
  WORK_ENTRY_VISIBILITIES,
  WORK_PROJECT_STATUSES,
  type WorkEntryLike,
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
  .describe("Window start: '7d', '24h', '2w', or an ISO date like '2026-08-01'.");

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
        minutes_spent: z.number().int().positive().optional(),
        branch: z.string().optional(),
        pr_url: z.string().optional(),
        blocked_reason: z.string().optional().describe("Give this whenever status is 'blocked'."),
        session_id: z
          .string()
          .optional()
          .describe("The current Claude Code session id. Creates and tracks the session."),
        visibility: z
          .enum(WORK_ENTRY_VISIBILITIES)
          .optional()
          .describe("Defaults to 'private'. 'public' publishes it to the site's Build Log."),
      }),
    },
    async (input) => {
      const entry = await logWork({
        project: input.project,
        title: input.title,
        summary: input.summary,
        status: input.status,
        tags: input.tags,
        minutesSpent: input.minutes_spent,
        branch: input.branch,
        prUrl: input.pr_url,
        blockedReason: input.blocked_reason,
        sessionId: input.session_id,
        visibility: input.visibility,
      });
      return text(`Logged ${entryLine(entry as Record<string, unknown> | null)}`);
    }
  );

  server.registerTool(
    "list_work",
    {
      title: "List work",
      description:
        "List worklog entries, newest first. Use it to answer what is outstanding, what " +
        "was done recently, or what is blocked — filter by status 'todo' or 'in_progress' " +
        "for the open backlog. Worth checking before starting on a project so you do not " +
        "redo something already logged.",
      inputSchema: z.object({
        project: z.string().optional().describe("Restrict to one project key."),
        status: z.enum(WORK_ENTRY_STATUSES).optional(),
        since: sinceArg,
        limit: z.number().int().min(1).max(100).optional().describe("Defaults to 25."),
      }),
    },
    async (input) => {
      const entries = await listWorkEntries({
        project: input.project,
        status: input.status,
        since: parseSince(input.since),
        limit: input.limit,
      });
      return text(formatEntries(entries as unknown as WorkEntryLike[]));
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
        blocked_reason: z.string().optional().describe("What the work is waiting on."),
      }),
    },
    async (input) => {
      const entry = await updateWorkEntryStatus(input.ref, input.status, input.blocked_reason);
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
        repo: z.string().optional(),
      }),
    },
    async (input) => {
      const project = await setWorkProjectStatus(input.slug, {
        status: input.status,
        name: input.name,
        description: input.description,
        repo: input.repo,
      });
      return text(`${project.slug} — ${project.name} (${project.status})`);
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
}
