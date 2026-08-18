import { describe, it, expect } from "vitest";
import { aggregateReport } from "./report";
import type { WorkEntryLike } from "./types";

function entry(over: Partial<WorkEntryLike> & { ref: number }): WorkEntryLike {
  return {
    title: `Entry ${over.ref}`,
    status: "done",
    createdAt: new Date("2026-08-18T09:00:00.000Z"),
    project: { name: "Tools Australia", slug: "toolsaustralia" },
    ...over,
  } as WorkEntryLike;
}

describe("aggregateReport", () => {
  it("returns a zeroed digest for no entries rather than undefined", () => {
    const d = aggregateReport([]);
    expect(d.total).toBe(0);
    expect(d.minutesSpent).toBe(0);
    expect(d.byProject).toEqual([]);
    expect(d.blockers).toEqual([]);
    expect(d.byStatus).toEqual({ todo: 0, in_progress: 0, blocked: 0, done: 0 });
  });

  it("counts totals and sums minutes, treating missing minutes as zero", () => {
    const d = aggregateReport([
      entry({ ref: 1, minutesSpent: 30 }),
      entry({ ref: 2, minutesSpent: 45 }),
      entry({ ref: 3 }),
    ]);
    expect(d.total).toBe(3);
    expect(d.minutesSpent).toBe(75);
  });

  it("groups by status", () => {
    const d = aggregateReport([
      entry({ ref: 1, status: "done" }),
      entry({ ref: 2, status: "todo" }),
      entry({ ref: 3, status: "todo" }),
      entry({ ref: 4, status: "blocked" }),
    ]);
    expect(d.byStatus).toEqual({ todo: 2, in_progress: 0, blocked: 1, done: 1 });
  });

  it("groups by project with done and open splits", () => {
    const d = aggregateReport([
      entry({ ref: 1, status: "done", minutesSpent: 10 }),
      entry({ ref: 2, status: "todo" }),
      entry({ ref: 3, project: { name: "Portfolio", slug: "portfolio" }, status: "done" }),
    ]);
    const ta = d.byProject.find((p) => p.slug === "toolsaustralia");
    expect(ta).toMatchObject({ total: 2, done: 1, open: 1, minutesSpent: 10 });
    expect(d.byProject.find((p) => p.slug === "portfolio")).toMatchObject({ total: 1, done: 1, open: 0 });
  });

  it("sorts projects by total, busiest first", () => {
    const d = aggregateReport([
      entry({ ref: 1, project: { name: "Quiet", slug: "quiet" } }),
      entry({ ref: 2, project: { name: "Busy", slug: "busy" } }),
      entry({ ref: 3, project: { name: "Busy", slug: "busy" } }),
    ]);
    expect(d.byProject[0].slug).toBe("busy");
  });

  it("lists blocked entries with their reason", () => {
    const d = aggregateReport([
      entry({ ref: 7, status: "blocked", blockedReason: "awaiting API key" }),
      entry({ ref: 8, status: "done" }),
    ]);
    expect(d.blockers).toEqual([
      { ref: 7, title: "Entry 7", project: "Tools Australia", reason: "awaiting API key" },
    ]);
  });

  it("includes an entry created exactly on the since boundary", () => {
    const since = new Date("2026-08-18T09:00:00.000Z");
    const d = aggregateReport([entry({ ref: 1, createdAt: since })], { since });
    expect(d.total).toBe(1);
  });

  it("excludes entries created before since", () => {
    const d = aggregateReport(
      [
        entry({ ref: 1, createdAt: new Date("2026-08-17T00:00:00.000Z") }),
        entry({ ref: 2, createdAt: new Date("2026-08-19T00:00:00.000Z") }),
      ],
      { since: new Date("2026-08-18T00:00:00.000Z") }
    );
    expect(d.total).toBe(1);
    expect(d.since).toBe("2026-08-18T00:00:00.000Z");
  });

  it("falls back to the slug when a project has no name, and to unassigned when absent", () => {
    const d = aggregateReport([entry({ ref: 1, project: undefined })]);
    expect(d.byProject[0].slug).toBe("unassigned");
  });
});
