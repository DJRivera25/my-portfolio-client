import { describe, it, expect } from "vitest";
import { reportFromCounts } from "./report";
import type { ReportBlocker, ReportCountRow, WorkEntryStatus } from "./types";

function row(
  slug: string,
  status: WorkEntryStatus,
  count: number,
  minutesSpent = 0,
  name = slug === "toolsaustralia" ? "Tools Australia" : slug
): ReportCountRow {
  return { project: { name, slug }, status, count, minutesSpent };
}

describe("reportFromCounts", () => {
  it("returns a zeroed digest for no rows rather than undefined", () => {
    const d = reportFromCounts([], []);
    expect(d.total).toBe(0);
    expect(d.minutesSpent).toBe(0);
    expect(d.byProject).toEqual([]);
    expect(d.blockers).toEqual([]);
    expect(d.byStatus).toEqual({ todo: 0, in_progress: 0, blocked: 0, done: 0 });
  });

  it("counts totals and sums minutes", () => {
    const d = reportFromCounts([row("toolsaustralia", "done", 3, 75)], []);
    expect(d.total).toBe(3);
    expect(d.minutesSpent).toBe(75);
  });

  it("groups by status", () => {
    const d = reportFromCounts(
      [
        row("toolsaustralia", "done", 1),
        row("toolsaustralia", "todo", 2),
        row("toolsaustralia", "blocked", 1),
      ],
      []
    );
    expect(d.byStatus).toEqual({ todo: 2, in_progress: 0, blocked: 1, done: 1 });
  });

  it("groups by project with done and open splits", () => {
    const d = reportFromCounts(
      [
        row("toolsaustralia", "done", 1, 10),
        row("toolsaustralia", "todo", 1),
        row("portfolio", "done", 1, 0, "Portfolio"),
      ],
      []
    );
    const ta = d.byProject.find((p) => p.slug === "toolsaustralia");
    expect(ta).toMatchObject({ total: 2, done: 1, open: 1, minutesSpent: 10 });
    expect(d.byProject.find((p) => p.slug === "portfolio")).toMatchObject({
      total: 1,
      done: 1,
      open: 0,
    });
  });

  it("sorts projects by total, busiest first, then by slug", () => {
    const d = reportFromCounts(
      [
        row("quiet", "done", 1),
        row("busy", "done", 2),
        row("alpha", "done", 1),
      ],
      []
    );
    expect(d.byProject.map((p) => p.slug)).toEqual(["busy", "alpha", "quiet"]);
  });

  it("blockers are passed through unchanged and since is echoed as ISO", () => {
    const blockers: ReportBlocker[] = [
      { ref: 7, title: "Entry 7", project: "Tools Australia", reason: "awaiting API key", waitingOn: "Sam" },
    ];
    const since = new Date("2026-08-18T00:00:00.000Z");
    const d = reportFromCounts([row("toolsaustralia", "blocked", 1)], blockers, { since });
    expect(d.blockers).toEqual(blockers);
    expect(d.since).toBe("2026-08-18T00:00:00.000Z");
  });

  it("has a null since when none is given", () => {
    expect(reportFromCounts([], []).since).toBeNull();
  });
});
