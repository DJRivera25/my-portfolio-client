import { describe, it, expect } from "vitest";
import { resolveCompletedAt } from "./status";
import { deriveProjectName, projectMatchKey, slugifyProject } from "./slug";

const now = new Date("2026-08-18T12:00:00.000Z");

/**
 * Three outcomes, not two: a Date to stamp, null to clear, and undefined meaning
 * "leave the field exactly as it is". The caller omits the field from `$set` on
 * undefined — which is what preserves an original completion time.
 */
describe("resolveCompletedAt", () => {
  it("stamps the time when entering done", () => {
    expect(resolveCompletedAt("in_progress", "done", now)).toBe(now);
  });

  it("clears the stamp when leaving done", () => {
    expect(resolveCompletedAt("done", "in_progress", now)).toBeNull();
  });

  it("leaves the field untouched between two non-done statuses", () => {
    expect(resolveCompletedAt("todo", "blocked", now)).toBeUndefined();
  });

  it("preserves the original completion time when already done", () => {
    expect(resolveCompletedAt("done", "done", now)).toBeUndefined();
  });

  it("stamps on a first-time done with no previous status", () => {
    expect(resolveCompletedAt(undefined, "done", now)).toBe(now);
  });
});

describe("slugifyProject", () => {
  it.each([
    ["Tools Australia", "tools-australia"],
    ["  MY Portfolio  ", "my-portfolio"],
    ["already-slugged", "already-slugged"],
    ["Weird!! Chars??", "weird-chars"],
  ])("turns %s into %s", (input, expected) => {
    expect(slugifyProject(input)).toBe(expected);
  });
});

describe("projectMatchKey", () => {
  it("collapses every spelling of one project to the same key", () => {
    const keys = ["Tools Australia", "tools-australia", "toolsaustralia", "tools_australia", "TOOLS AUSTRALIA"];
    expect(new Set(keys.map(projectMatchKey)).size).toBe(1);
    expect(projectMatchKey("Tools Australia")).toBe("toolsaustralia");
  });

  it("still distinguishes genuinely different projects", () => {
    expect(projectMatchKey("my-portfolio")).not.toBe(projectMatchKey("toolsaustralia"));
  });
});

describe("deriveProjectName", () => {
  it.each([
    ["toolsaustralia", "Toolsaustralia"],
    ["tools-australia", "Tools Australia"],
    ["my_portfolio", "My Portfolio"],
  ])("turns %s into %s", (slug, expected) => {
    expect(deriveProjectName(slug)).toBe(expected);
  });
});
