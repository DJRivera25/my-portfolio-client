import { describe, it, expect } from "vitest";
import { formatReport, formatEntries, formatDuration } from "./format";
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

describe("formatDuration", () => {
  it.each([
    [0, "0m"],
    [45, "45m"],
    [60, "1h"],
    [90, "1h 30m"],
    [605, "10h 5m"],
  ])("renders %i minutes as %s", (mins, expected) => {
    expect(formatDuration(mins)).toBe(expected);
  });
});

describe("formatReport", () => {
  it("says nothing was logged rather than rendering a header over a void", () => {
    const out = formatReport(aggregateReport([]));
    expect(out).toMatch(/nothing logged/i);
    expect(out.trim().length).toBeGreaterThan(0);
  });

  it("includes totals, project lines and blockers", () => {
    const out = formatReport(
      aggregateReport([
        entry({ ref: 1, status: "done", minutesSpent: 90 }),
        entry({ ref: 2, status: "blocked", blockedReason: "awaiting API key" }),
      ])
    );
    expect(out).toContain("Tools Australia");
    expect(out).toContain("1h 30m");
    expect(out).toContain("awaiting API key");
    expect(out).toContain("#2");
  });
});

describe("formatEntries", () => {
  it("reports an empty list plainly", () => {
    expect(formatEntries([])).toMatch(/no entries/i);
  });

  it("renders one line per entry with its ref and status", () => {
    const out = formatEntries([entry({ ref: 12, status: "in_progress", title: "Wire the upsell" })]);
    expect(out).toContain("#12");
    expect(out).toContain("in_progress");
    expect(out).toContain("Wire the upsell");
  });

  it("shows the blocked reason when present", () => {
    const out = formatEntries([entry({ ref: 3, status: "blocked", blockedReason: "awaiting API key" })]);
    expect(out).toContain("awaiting API key");
  });
});
