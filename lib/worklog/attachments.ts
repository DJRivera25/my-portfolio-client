import type { WorkAttachmentKind } from "./types";

/**
 * Pure half of the attachments module — no mongoose, no `@/lib/db`, so it stays
 * unit-testable. The query shell lives in `attachmentQueries.ts`.
 */

const KIND_RULES: Array<{ kind: WorkAttachmentKind; test: (url: URL) => boolean }> = [
  // Claude artifacts. Both the claude.ai/code/artifact form and the older
  // claude.site/artifacts form, so an older link is still recognised.
  {
    kind: "artifact",
    test: (u) =>
      (u.hostname === "claude.ai" && u.pathname.includes("/artifact")) ||
      (u.hostname.endsWith("claude.site") && u.pathname.includes("/artifacts")),
  },
  {
    kind: "commit",
    test: (u) =>
      (u.hostname === "github.com" || u.hostname === "gitlab.com") &&
      /\/commits?\/[0-9a-f]{7,40}/i.test(u.pathname),
  },
  {
    kind: "pr",
    test: (u) =>
      u.hostname === "github.com" && /\/(pull|merge_requests)\/\d+/.test(u.pathname),
  },
  {
    kind: "repo",
    test: (u) => u.hostname === "github.com" || u.hostname === "gitlab.com",
  },
  {
    kind: "deploy",
    test: (u) => u.hostname.endsWith(".vercel.app") || u.hostname.endsWith(".netlify.app"),
  },
  {
    kind: "image",
    test: (u) => /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(u.pathname),
  },
  {
    kind: "video",
    test: (u) => /\.(mp4|webm|mov|m4v)$/i.test(u.pathname),
  },
  {
    kind: "doc",
    test: (u) => /\.(pdf|md|txt|docx?)$/i.test(u.pathname),
  },
];

/**
 * Infers what a link is from its URL so callers rarely have to say. Returns "link" for
 * anything unrecognised rather than throwing — a correct URL with an unknown shape is
 * still worth attaching.
 */
export function detectAttachmentKind(rawUrl: string): WorkAttachmentKind {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return "link";
  }
  for (const rule of KIND_RULES) {
    if (rule.test(url)) return rule.kind;
  }
  return "link";
}

/** A readable default label when the caller does not supply one. */
export function deriveAttachmentLabel(rawUrl: string, kind: WorkAttachmentKind): string {
  if (kind === "artifact") return "Claude artifact";
  try {
    const url = new URL(rawUrl);
    const last = url.pathname.split("/").filter(Boolean).pop();
    return last ? `${url.hostname} — ${last}` : url.hostname;
  } catch {
    return rawUrl.slice(0, 60);
  }
}

export function isProbablyUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
