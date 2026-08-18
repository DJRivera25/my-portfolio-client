import type { ReportDigest, WorkEntryLike } from "./types";

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
    for (const b of digest.blockers) {
      lines.push(`  #${b.ref} ${b.title} (${b.project})${b.reason ? ` — ${b.reason}` : ""}`);
    }
  }

  return lines.join("\n");
}

export function formatEntries(entries: WorkEntryLike[]): string {
  if (!entries.length) return "No entries.";
  return entries
    .map((e) => {
      const name = projectName(e.project);
      const head = `#${e.ref} ${e.status.padEnd(11)} ${e.title}`;
      const where = name ? ` [${name}]` : "";
      const why = e.status === "blocked" && e.blockedReason ? `\n      ↳ ${e.blockedReason}` : "";
      return head + where + why;
    })
    .join("\n");
}
