import { describe, it, expect } from "vitest";
import { parseSince, parseUntil } from "./since";

const now = new Date("2026-08-18T12:00:00.000Z");

describe("parseSince", () => {
  it("returns undefined for absent or empty input", () => {
    expect(parseSince(undefined, now)).toBeUndefined();
    expect(parseSince(null, now)).toBeUndefined();
    expect(parseSince("   ", now)).toBeUndefined();
  });

  it.each([
    ["24h", "2026-08-17T12:00:00.000Z"],
    ["7d", "2026-08-11T12:00:00.000Z"],
    ["2w", "2026-08-04T12:00:00.000Z"],
    ["1 d", "2026-08-17T12:00:00.000Z"],
  ])("resolves the relative window %s", (input, expected) => {
    expect(parseSince(input, now)?.toISOString()).toBe(expected);
  });

  it("accepts an ISO date", () => {
    expect(parseSince("2026-08-01", now)?.toISOString()).toBe("2026-08-01T00:00:00.000Z");
  });

  it("returns undefined for unparseable input rather than throwing", () => {
    expect(parseSince("last tuesday-ish", now)).toBeUndefined();
  });
});

describe("parseUntil", () => {
  const now = new Date("2026-11-24T12:00:00Z");
  it("makes a bare date inclusive by returning the next midnight", () =>
    expect(parseUntil("2026-11-20", now)).toEqual(new Date("2026-11-21T00:00:00.000Z")));
  it("keeps a full timestamp as given", () =>
    expect(parseUntil("2026-11-20T15:00:00Z", now)).toEqual(new Date("2026-11-20T15:00:00Z")));
  it("reads relative windows like parseSince", () =>
    expect(parseUntil("7d", now)).toEqual(new Date("2026-11-17T12:00:00Z")));
  it("returns undefined for blank input", () => expect(parseUntil("", now)).toBeUndefined());
});
