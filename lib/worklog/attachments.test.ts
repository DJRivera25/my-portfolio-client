import { describe, it, expect } from "vitest";
import {
  detectAttachmentKind,
  deriveAttachmentLabel,
  isProbablyUrl,
} from "./attachments";

describe("detectAttachmentKind", () => {
  it.each([
    ["https://claude.ai/code/artifact/2a74a73b-e0fa-42cb-b7ad-3ce85aa77f41", "artifact"],
    ["https://claude.site/artifacts/abc123", "artifact"],
    ["https://github.com/DJRivera25/my-portfolio-client/pull/12", "pr"],
    ["https://github.com/DJRivera25/my-portfolio-client", "repo"],
    ["https://gitlab.com/acme/thing", "repo"],
    ["https://my-portfolio-client-one.vercel.app", "deploy"],
    ["https://preview.netlify.app", "deploy"],
    ["https://res.cloudinary.com/x/image/upload/v1/portfolio/shot.png", "image"],
    ["https://cdn.example.com/clip.mp4", "video"],
    ["https://example.com/spec.pdf", "doc"],
    ["https://example.com/anything-else", "link"],
  ])("classifies %s as %s", (url, expected) => {
    expect(detectAttachmentKind(url)).toBe(expected);
  });

  it("classifies a PR before falling through to repo", () => {
    // Both rules match a github.com PR URL; order decides, and pr is the useful one.
    expect(detectAttachmentKind("https://github.com/a/b/pull/9")).toBe("pr");
  });

  it.each([
    ["https://github.com/DJRivera25/my-portfolio-client/commit/39407f6", "commit"],
    ["https://github.com/a/b/commit/39407f6a1b2c3d4e5f60718293a4b5c6d7e8f901", "commit"],
    ["https://gitlab.com/a/b/-/commit/abc1234", "commit"],
  ])("classifies %s as %s, not repo", (url, expected) => {
    expect(detectAttachmentKind(url)).toBe(expected);
  });

  it("does not mistake a branch named like a sha for a commit", () => {
    expect(detectAttachmentKind("https://github.com/a/b/tree/abc1234")).toBe("repo");
  });

  it("returns link for unparseable input rather than throwing", () => {
    expect(detectAttachmentKind("not a url at all")).toBe("link");
    expect(detectAttachmentKind("")).toBe("link");
  });
});

describe("deriveAttachmentLabel", () => {
  it("names a Claude artifact plainly", () => {
    expect(deriveAttachmentLabel("https://claude.ai/code/artifact/abc", "artifact")).toBe(
      "Claude artifact"
    );
  });

  it("falls back to host and last path segment", () => {
    expect(deriveAttachmentLabel("https://github.com/a/b/pull/9", "pr")).toBe("github.com — 9");
  });

  it("uses the bare host when there is no path", () => {
    expect(deriveAttachmentLabel("https://example.com", "link")).toBe("example.com");
  });
});

describe("isProbablyUrl", () => {
  it.each([
    ["https://example.com", true],
    ["http://example.com", true],
    ["ftp://example.com", false],
    ["javascript:alert(1)", false],
    ["example.com", false],
    ["", false],
  ])("%s -> %s", (value, expected) => {
    expect(isProbablyUrl(value)).toBe(expected);
  });
});
