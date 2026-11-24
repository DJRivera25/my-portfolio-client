import { describe, it, expect } from "vitest";
import { normaliseRepoUrl, repoNameKey, storableRepo } from "./repo";

describe("storableRepo", () => {
  it("stores the normalised form of a repo address", () => {
    expect(storableRepo("git@github.com:Owner/Repo.git")).toBe("github.com/owner/repo");
  });
  it("treats blank as clear", () => {
    expect(storableRepo("  ")).toBe("");
  });
  it("keeps plain non-address text", () => {
    expect(storableRepo("local only")).toBe("local only");
  });
  it("refuses text that may carry login details", () => {
    expect(storableRepo("https://token@github.com")).toBeNull();
    expect(storableRepo("https://github.com/a/b@c")).toBeNull();
  });
});

describe("normaliseRepoUrl", () => {
  it.each([
    ["https://github.com/Owner/ToolsAustralia.git", "github.com/owner/toolsaustralia"],
    ["https://github.com/owner/toolsaustralia/", "github.com/owner/toolsaustralia"],
    ["git@github.com:Owner/ToolsAustralia.git", "github.com/owner/toolsaustralia"],
    ["ssh://git@github.com:22/owner/ToolsAustralia.git", "github.com/owner/toolsaustralia"],
    ["github.com/owner/toolsaustralia", "github.com/owner/toolsaustralia"],
  ])("%s → %s", (input, expected) => {
    expect(normaliseRepoUrl(input)).toBe(expected);
  });

  it("drops credentials embedded in the URL", () => {
    const out = normaliseRepoUrl("https://someone:not-a-real-secret@github.com/owner/repo.git");
    expect(out).toBe("github.com/owner/repo");
    expect(out).not.toContain("not-a-real-secret");
  });

  it("never leaks a password that contains a slash", () => {
    const out = normaliseRepoUrl("https://user:pa.ss/word@github.com/owner/repo");
    expect(out === null || out === "github.com/owner/repo").toBe(true);
    expect(out ?? "").not.toContain("pa.ss");
    expect(out ?? "").not.toContain("word");
  });

  it("never leaks userinfo that has no colon but contains a slash", () => {
    const out = normaliseRepoUrl("https://abc.de/fg@github.com/o/r");
    expect(out ?? "").not.toContain("fg");
    expect(out).toBeNull();
  });

  it("keeps nested group paths", () => {
    expect(normaliseRepoUrl("https://gitlab.com/g/sub/Repo.git")).toBe("gitlab.com/g/sub/repo");
  });

  it.each([[""], [null], [undefined], ["C:/Codes/ToolsAustralia"], ["just-a-name"],
    ["https://github.com/"], ["file:///srv/repo.git"],
    ["../relative/path"], ["a..b/owner/repo"]])("returns null for %s", (input) => {
    expect(normaliseRepoUrl(input)).toBeNull();
  });

  it("is idempotent", () => {
    const once = normaliseRepoUrl("git@github.com:Owner/Repo.git")!;
    expect(normaliseRepoUrl(once)).toBe(once);
  });
});

describe("repoNameKey", () => {
  it("keys the repo by its last segment, separator-free", () => {
    expect(repoNameKey("github.com/owner/tools-australia")).toBe("toolsaustralia");
  });
});
