import {
  OPEN_STATUSES,
  WORK_ENTRY_STATUSES,
  type ReportBlocker,
  type ReportCountRow,
  type ReportDigest,
  type ReportProjectLine,
  type WorkEntryStatus,
} from "./types";

export function reportFromCounts(
  rows: ReportCountRow[],
  blockers: ReportBlocker[],
  opts: { since?: Date } = {}
): ReportDigest {
  const byStatus = Object.fromEntries(
    WORK_ENTRY_STATUSES.map((s) => [s, 0])
  ) as Record<WorkEntryStatus, number>;
  const projects = new Map<string, ReportProjectLine>();
  let total = 0;
  let minutesSpent = 0;

  for (const r of rows) {
    total += r.count;
    minutesSpent += r.minutesSpent;
    byStatus[r.status] = (byStatus[r.status] ?? 0) + r.count;

    const { name, slug } = r.project;
    const line =
      projects.get(slug) ?? { slug, name, total: 0, done: 0, open: 0, minutesSpent: 0 };
    line.total += r.count;
    if (r.status === "done") line.done += r.count;
    if (OPEN_STATUSES.includes(r.status)) line.open += r.count;
    line.minutesSpent += r.minutesSpent;
    projects.set(slug, line);
  }

  return {
    total,
    since: opts.since ? opts.since.toISOString() : null,
    minutesSpent,
    byStatus,
    byProject: [...projects.values()].sort(
      (a, b) => b.total - a.total || a.slug.localeCompare(b.slug)
    ),
    blockers,
  };
}
