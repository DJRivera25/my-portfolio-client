import { describe, it, expect } from "vitest";
import { toPublicEntry, PUBLIC_ENTRY_KEYS } from "./public";
import type { WorkEntryLike } from "./types";

/**
 * Every field a WorkEntry can carry, populated. The point of this fixture is that it is
 * exhaustive: if someone adds a field to the model and not to the projection, the first
 * test below fails and the field never reaches the public feed.
 */
const everyField = {
  _id: "652f1c9e8a1b2c3d4e5f6071",
  ref: 42,
  title: "Ship the checkout upsell",
  summary: "Wired the upsell into the cart flow.",
  status: "done",
  blockedReason: "waiting on ACME Corp credentials",
  tags: ["next", "mongo"],
  minutesSpent: 90,
  branch: "feat/acme-private-integration",
  prUrl: "https://github.com/acme/private-repo/pull/9",
  session: { sessionId: "sess-abc-123" },
  source: "claude",
  visibility: "public",
  completedAt: new Date("2026-08-18T10:00:00.000Z"),
  createdAt: new Date("2026-08-18T09:00:00.000Z"),
  updatedAt: new Date("2026-08-18T10:00:00.000Z"),
  project: { name: "Tools Australia", slug: "toolsaustralia" },
} as unknown as WorkEntryLike;

describe("toPublicEntry", () => {
  it("emits exactly the allowed keys and nothing else", () => {
    const out = toPublicEntry(everyField);
    expect(Object.keys(out).sort()).toEqual([...PUBLIC_ENTRY_KEYS].sort());
  });

  it.each(["blockedReason", "branch", "prUrl", "minutesSpent", "source", "session", "status", "_id"])(
    "never leaks %s",
    (field) => {
      expect(toPublicEntry(everyField)).not.toHaveProperty(field);
    }
  );

  it("serialises createdAt to an ISO string", () => {
    expect(toPublicEntry(everyField).createdAt).toBe("2026-08-18T09:00:00.000Z");
  });

  it("reduces the project to name and slug only", () => {
    const out = toPublicEntry({
      ...everyField,
      project: { name: "Tools Australia", slug: "toolsaustralia", repo: "git@secret", _id: "x" },
    } as unknown as WorkEntryLike);
    expect(out.project).toEqual({ name: "Tools Australia", slug: "toolsaustralia" });
  });

  it("tolerates an unpopulated project reference", () => {
    const out = toPublicEntry({ ...everyField, project: "652f1c9e8a1b2c3d4e5f6071" } as unknown as WorkEntryLike);
    expect(out.project).toBeNull();
  });

  it("normalises a missing summary to null and missing tags to an empty array", () => {
    const out = toPublicEntry({ ...everyField, summary: undefined, tags: undefined });
    expect(out.summary).toBeNull();
    expect(out.tags).toEqual([]);
  });
});
