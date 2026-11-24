import { describe, it, expect } from "vitest";
import { entryQueryFrom, parseEntryQuery } from "./filters";

describe("entryQueryFrom", () => {
  it("returns an empty query for no filters", () => expect(entryQueryFrom({})).toEqual({}));
  it("expands 'open' to the three open statuses", () =>
    expect(entryQueryFrom({ status: "open" })).toEqual({
      status: { $in: ["todo", "in_progress", "blocked"] },
    }));
  it("passes one status through", () =>
    expect(entryQueryFrom({ status: "blocked" })).toEqual({ status: "blocked" }));
  it("matches text in title or summary, case-insensitively and literally", () => {
    const re = { $regex: "C\\+\\+ \\(v2\\) a\\.b \\[", $options: "i" };
    expect(entryQueryFrom({ text: "C++ (v2) a.b [" })).toEqual({
      $or: [{ title: re }, { summary: re }],
    });
  });
  it("matches waiting-on as a case-insensitive substring", () =>
    expect(entryQueryFrom({ waitingOn: "derem" })).toEqual({
      waitingOn: { $regex: "derem", $options: "i" },
    }));
  it("ignores blank text and waiting-on", () =>
    expect(entryQueryFrom({ text: "  ", waitingOn: "" })).toEqual({}));
  it("bounds createdAt: since inclusive, until exclusive", () => {
    const since = new Date("2026-11-01T00:00:00Z");
    const until = new Date("2026-11-21T00:00:00Z");
    expect(entryQueryFrom({ since, until })).toEqual({ createdAt: { $gte: since, $lt: until } });
  });
  it("keys the group separator-free", () =>
    expect(entryQueryFrom({ group: "FT-11" })).toEqual({ groupKey: "ft11" }));
  it("scopes by resolved project and session ids", () =>
    expect(entryQueryFrom({ projectId: "p1", sessionId: "s1" })).toEqual({
      project: "p1",
      session: "s1",
    }));
});

describe("parseEntryQuery", () => {
  const now = new Date("2026-11-24T12:00:00Z");
  it("defaults to the first page of 300", () =>
    expect(parseEntryQuery(new URLSearchParams(), now)).toEqual({ value: { offset: 0, limit: 300 } }));
  it("reads every filter", () => {
    const q = new URLSearchParams(
      "project=tools-australia&group=FT-11&status=open&text=upsell&waitingOn=Derem" +
        "&since=2026-11-01&until=2026-11-20&offset=300&limit=300"
    );
    expect(parseEntryQuery(q, now)).toEqual({
      value: {
        project: "tools-australia", group: "FT-11", status: "open", text: "upsell", waitingOn: "Derem",
        since: new Date("2026-11-01T00:00:00Z"), until: new Date("2026-11-21T00:00:00Z"),
        offset: 300, limit: 300,
      },
    });
  });
  it("rejects an unknown status", () =>
    expect(parseEntryQuery(new URLSearchParams("status=nope"), now)).toHaveProperty("error"));
  it("rejects a limit over 500", () =>
    expect(parseEntryQuery(new URLSearchParams("limit=501"), now)).toHaveProperty("error"));
});
