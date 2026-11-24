import type { ReportDigest, WorkEntryLike, WorkEntryPage } from "./types";

export const REPORT_BLOCKER_LINES = 15;

export function formatDuration(minutes: number): string {
  if (!minutes) return "0m";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours && rest) return `${hours}h ${rest}m`;
  if (hours) return `${hours}h`;
  return `${rest}m`;
}

function day(iso: string): string {
  return iso.slice(0, 10);
}

function projectName(project: unknown): string | null {
  if (project && typeof project === "object") {
    const record = project as Record<string, unknown>;
    if (typeof record.name === "string") return record.name;
  }
  return null;
}

export function formatReport(digest: ReportDigest): string {
  if (digest.total === 0) {
    return digest.since
      ? `Nothing logged since ${day(digest.since)}.`
      : "Nothing logged yet.";
  }

  const lines: string[] = [];
  const noun = digest.total === 1 ? "entry" : "entries";
  const window = digest.since ? ` since ${day(digest.since)}` : "";
  lines.push(`${digest.total} ${noun}${window} · ${formatDuration(digest.minutesSpent)} tracked`);
  lines.push(
    `done ${digest.byStatus.done} · in progress ${digest.byStatus.in_progress} · ` +
      `todo ${digest.byStatus.todo} · blocked ${digest.byStatus.blocked}`
  );

  lines.push("", "By project");
  for (const p of digest.byProject) {
    lines.push(
      `  ${p.name} — ${p.total} logged, ${p.open} open, ${formatDuration(p.minutesSpent)}`
    );
  }

  if (digest.blockers.length) {
    lines.push("", "Blocked");
    const shown = digest.blockers.slice(0, REPORT_BLOCKER_LINES);
    for (const b of shown) {
      const notes = [b.reason, b.waitingOn ? `waiting on ${b.waitingOn}` : null].filter(Boolean);
      lines.push(
        `  #${b.ref} ${b.title} (${b.project})${notes.length ? ` — ${notes.join(" · ")}` : ""}`
      );
    }
    const hidden = digest.byStatus.blocked - shown.length;
    if (hidden > 0) lines.push(`  …and ${hidden} more — list_work status 'blocked'`);
  }

  return lines.join("\n");
}

export function formatPageFooter(shown: number, total: number, offset: number): string {
  const end = offset + shown;
  if (end >= total) return "";
  const range = offset === 0 ? `${shown}` : `${offset + 1}–${end}`;
  return `Showing ${range} of ${total} — pass offset ${end} for more`;
}

export function formatEntries(
  entries: WorkEntryLike[],
  opts: { showProject?: boolean } = {}
): string {
  if (!entries.length) return "No entries.";
  const showProject = opts.showProject ?? true;
  return entries
    .map((e) => {
      const name = showProject ? projectName(e.project) : null;
      const head = `#${e.ref} ${e.status.padEnd(11)} ${e.title}`;
      const where = name ? ` [${name}]` : "";
      const why = e.status === "blocked" && e.blockedReason ? `\n      ↳ ${e.blockedReason}` : "";
      const waiting = e.status !== "done" && e.waitingOn ? `\n      ↳ waiting on ${e.waitingOn}` : "";
      return head + where + why + waiting;
    })
    .join("\n");
}

export function formatEntryPage(page: WorkEntryPage): string {
  const { unmatched } = page;
  if (unmatched) {
    if (unmatched.kind === "project") return `No worklog project matches "${unmatched.value}".`;
    if (unmatched.kind === "repo") {
      return "No worklog project matches this repo — set it with `set_work_project_status` (repo).";
    }
    return `No session ${unmatched.value}.`;
  }
  if (!page.entries.length) {
    return page.total > 0
      ? `No entries at offset ${page.offset} (${page.total} in total).`
      : "No entries.";
  }
  const lines: string[] = [];
  if (page.project) lines.push(`${page.project.name} · ${page.total} matching`);
  lines.push(formatEntries(page.entries, { showProject: !page.project }));
  const footer = formatPageFooter(page.entries.length, page.total, page.offset);
  if (footer) lines.push(footer);
  return lines.join("\n");
}
