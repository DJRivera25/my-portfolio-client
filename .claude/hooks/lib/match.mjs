// Minimal glob matcher for the path patterns used in the Domain Manifest.
// Supports: ** (any depth), * (single segment), {a,b} (alternatives), literal paths.
// No npm dependency — these patterns are simple enough to match in-house.

/**
 * Convert a glob pattern to a RegExp.
 * @param {string} pattern e.g. "app/api/projects/**" or "lib/models/{User,Project}.ts"
 * @returns {RegExp}
 */
export function globToRegex(pattern) {
  const regex = pattern
    .replace(/[.+^$()|[\]\\]/g, "\\$&")
    .replace(/\{([^}]+)\}/g, (_, alts) => `(${alts.split(",").join("|")})`)
    .replace(/\*\*/g, "<<DOUBLESTAR>>")
    .replace(/\*/g, "[^/]*")
    .replace(/<<DOUBLESTAR>>/g, ".*");
  return new RegExp(`^${regex}$`);
}

/**
 * Test whether a file path matches any of a domain's patterns.
 * Path comparison is normalized to forward slashes.
 * @param {string} filePath
 * @param {string[]} patterns
 * @returns {boolean}
 */
export function matchesAny(filePath, patterns) {
  const normalized = filePath.replace(/\\/g, "/");
  return patterns.some((p) => globToRegex(p).test(normalized));
}

/**
 * Specificity of a pattern. A literal path (no wildcard) is always more specific
 * than any glob; among globs, the longer pattern wins.
 *
 * This lets one domain claim a single file out of another domain's folder: a literal entry
 * such as `src/components/portfolio/Foo.tsx` wins over `src/components/portfolio/**`.
 * Without the rule, that file would be attributed to whichever domain was iterated first.
 * @param {string} pattern
 * @returns {number}
 */
function specificity(pattern) {
  return pattern.includes("*") ? pattern.length : 10_000 + pattern.length;
}

/**
 * Find the domain that owns a file path, preferring the most specific pattern.
 * @param {object} manifest Output of readManifest()
 * @param {string} filePath
 * @returns {string|null} Domain name, or null if no domain claims the file.
 */
export function findDomain(manifest, filePath) {
  const normalized = filePath.replace(/\\/g, "/");
  let best = null;
  let bestScore = -1;

  for (const [name, def] of Object.entries(manifest.domains)) {
    for (const pattern of def.paths) {
      if (!globToRegex(pattern).test(normalized)) continue;
      const score = specificity(pattern);
      if (score > bestScore) {
        bestScore = score;
        best = name;
      }
    }
  }
  return best;
}

/**
 * Every domain whose patterns match the file. Used to report ambiguous ownership
 * where two patterns of equal specificity both claim a path.
 * @param {object} manifest
 * @param {string} filePath
 * @returns {string[]}
 */
export function findAllDomains(manifest, filePath) {
  return Object.entries(manifest.domains)
    .filter(([, def]) => matchesAny(filePath, def.paths))
    .map(([name]) => name);
}
