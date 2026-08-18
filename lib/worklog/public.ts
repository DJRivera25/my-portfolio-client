import type { PublicEntry, WorkEntryLike } from "./types";

/**
 * The complete set of fields that may reach an unauthenticated caller.
 *
 * This is an allowlist and `toPublicEntry` builds its result by naming each field
 * explicitly — never by spreading an entry and deleting from it. A field added to
 * WorkEntry later is therefore private by default: it cannot reach the public feed
 * until someone adds it here, and `public.test.ts` fails until they do.
 */
export const PUBLIC_ENTRY_KEYS = [
  "ref",
  "title",
  "summary",
  "tags",
  "createdAt",
  "project",
] as const;

function toIso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

/** Populated project documents expose name/slug; an unpopulated ObjectId exposes neither. */
function publicProject(project: unknown): { name: string; slug: string } | null {
  if (!project || typeof project !== "object") return null;
  const record = project as Record<string, unknown>;
  const name = typeof record.name === "string" ? record.name : null;
  const slug = typeof record.slug === "string" ? record.slug : null;
  return name && slug ? { name, slug } : null;
}

export function toPublicEntry(entry: WorkEntryLike): PublicEntry {
  return {
    ref: entry.ref,
    title: entry.title,
    summary: entry.summary ?? null,
    tags: entry.tags ?? [],
    createdAt: toIso(entry.createdAt),
    project: publicProject(entry.project),
  };
}
