import { describe, it, expect } from "vitest";
import {
  formatReport,
  formatEntries,
  formatDuration,
  formatPageFooter,
  formatEntryPage,
} from "./format";
import { reportFromCounts } from "./report";
import type { WorkEntryLike, WorkEntryPage } from "./types";

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
    const out = formatReport(reportFromCounts([], []));
    expect(out).toMatch(/nothing logged/i);
    expect(out.trim().length).toBeGreaterThan(0);
  });

  it("includes totals, project lines and blockers", () => {
    const project = { name: "Tools Australia", slug: "toolsaustralia" };
    const out = formatReport(
      reportFromCounts(
        [
          { project, status: "done", count: 1, minutesSpent: 90 },
          { project, status: "blocked", count: 1, minutesSpent: 0 },
        ],
        [{ ref: 2, title: "Entry 2", project: project.name, reason: "awaiting API key", waitingOn: null }]
      )
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

describe("formatPageFooter", () => {
  it.each([
    [25, 96, 0, "Showing 25 of 96 — pass offset 25 for more"],
    [25, 96, 25, "Showing 26–50 of 96 — pass offset 50 for more"],
    [21, 96, 75, ""],
    [5, 5, 0, ""],
  ])("shown %i of %i at offset %i", (shown, total, offset, expected) =>
    expect(formatPageFooter(shown, total, offset)).toBe(expected));
});

describe("formatEntries — waiting on", () => {
  it("shows who an open entry waits on", () =>
    expect(formatEntries([entry({ ref: 4, status: "todo", waitingOn: "Derem" })])).toContain(
      "↳ waiting on Derem"));
  it("hides waiting-on once done", () =>
    expect(formatEntries([entry({ ref: 5, status: "done", waitingOn: "Derem" })])).not.toContain(
      "waiting on"));
  it("can drop the per-line project when the page names it once", () =>
    expect(formatEntries([entry({ ref: 6 })], { showProject: false })).not.toContain(
      "[Tools Australia]"));
});

describe("formatEntryPage", () => {
  const page = (over: Partial<WorkEntryPage>): WorkEntryPage => ({
    entries: [], total: 0, offset: 0, project: null, unmatched: null, ...over,
  });
  it("names an unmatched project key", () =>
    expect(formatEntryPage(page({ unmatched: { kind: "project", value: "tools-oz" } }))).toBe(
      'No worklog project matches "tools-oz".'));
  it("tells the hook how to link an unmatched repo", () =>
    expect(formatEntryPage(page({ unmatched: { kind: "repo", value: "github.com/o/r" } }))).toBe(
      "No worklog project matches this repo — set it with `set_work_project_status` (repo)."));
  it("names an unknown session", () =>
    expect(formatEntryPage(page({ unmatched: { kind: "session", value: "abc" } }))).toBe(
      "No session abc."));
  it("says so plainly when nothing matches", () => expect(formatEntryPage(page({}))).toBe("No entries."));
  it("explains an offset past the end", () =>
    expect(formatEntryPage(page({ total: 96, offset: 200 }))).toBe(
      "No entries at offset 200 (96 in total)."));
  it("heads a project page once and ends with the footer", () => {
    const out = formatEntryPage(page({
      entries: [entry({ ref: 1, status: "todo" })], total: 96,
      project: { name: "Tools Australia", slug: "tools-australia" },
    }));
    expect(out.split("\n")[0]).toBe("Tools Australia · 96 matching");
    expect(out).not.toContain("[Tools Australia]");
    expect(out.endsWith("Showing 1 of 96 — pass offset 1 for more")).toBe(true);
  });
});

describe("formatReport — blocker cap", () => {
  it("lists 15 blockers and counts the rest", () => {
    const blockers = Array.from({ length: 20 }, (_, i) => ({
      ref: i + 1, title: `B${i + 1}`, project: "Tools Australia", reason: null, waitingOn: null,
    }));
    const out = formatReport({
      total: 20, since: null, minutesSpent: 0,
      byStatus: { todo: 0, in_progress: 0, blocked: 20, done: 0 },
      byProject: [], blockers,
    });
    expect(out).toContain("#15 B15");
    expect(out).not.toContain("#16 B16");
    expect(out).toContain("…and 5 more — list_work status 'blocked'");
  });
});
