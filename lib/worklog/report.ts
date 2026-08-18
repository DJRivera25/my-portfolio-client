import {
  OPEN_STATUSES,
  WORK_ENTRY_STATUSES,
  type ReportBlocker,
  type ReportDigest,
  type ReportProjectLine,
  type WorkEntryLike,
  type WorkEntryStatus,
} from "./types";

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

function projectOf(project: unknown): { name: string; slug: string } {
  if (project && typeof project === "object") {
    const record = project as Record<string, unknown>;
    const slug = typeof record.slug === "string" ? record.slug : "unassigned";
    const name = typeof record.name === "string" ? record.name : slug;
    return { name, slug };
  }
  return { name: "Unassigned", slug: "unassigned" };
}

export function aggregateReport(
  entries: WorkEntryLike[],
  opts: { since?: Date } = {}
): ReportDigest {
  const since = opts.since ?? null;
  const scoped = since
    ? entries.filter((e) => toDate(e.createdAt).getTime() >= since.getTime())
    : entries;

  const byStatus = Object.fromEntries(
    WORK_ENTRY_STATUSES.map((s) => [s, 0])
  ) as Record<WorkEntryStatus, number>;

  const projects = new Map<string, ReportProjectLine>();
  const blockers: ReportBlocker[] = [];
  let minutesSpent = 0;

  for (const entry of scoped) {
    byStatus[entry.status] = (byStatus[entry.status] ?? 0) + 1;

    const minutes = entry.minutesSpent ?? 0;
    minutesSpent += minutes;

    const { name, slug } = projectOf(entry.project);
    const line =
      projects.get(slug) ?? { slug, name, total: 0, done: 0, open: 0, minutesSpent: 0 };
    line.total += 1;
    if (entry.status === "done") line.done += 1;
    if (OPEN_STATUSES.includes(entry.status)) line.open += 1;
    line.minutesSpent += minutes;
    projects.set(slug, line);

    if (entry.status === "blocked") {
      blockers.push({
        ref: entry.ref,
        title: entry.title,
        project: name,
        reason: entry.blockedReason ?? null,
      });
    }
  }

  return {
    total: scoped.length,
    since: since ? since.toISOString() : null,
    minutesSpent,
    byStatus,
    byProject: [...projects.values()].sort(
      (a, b) => b.total - a.total || a.slug.localeCompare(b.slug)
    ),
    blockers,
  };
}
