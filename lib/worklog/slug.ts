/** Project keys are typed by hand into MCP calls, so normalise rather than reject. */
export function slugifyProject(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * The key a project is actually looked up by: the slug with separators removed, so
 * "Tools Australia", "tools-australia", "toolsaustralia" and "tools_australia" all reach
 * the same project.
 *
 * Without this, a caller typing the key from memory silently forks a project's history
 * in two — which is worse than an error, because nothing looks wrong until a report is
 * quietly missing half its entries. The readable `slug` is still what gets displayed;
 * this is only the identity used for matching.
 */
export function projectMatchKey(input: string): string {
  return slugifyProject(input).replace(/-/g, "");
}

/** A display name for a project auto-created by its first `log_work` call. */
export function deriveProjectName(slug: string): string {
  return slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
