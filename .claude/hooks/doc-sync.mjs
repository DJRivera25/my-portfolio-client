#!/usr/bin/env node
// Stop hook. Reports domains whose source changed without a matching docs update,
// source files no domain claims, and domain docs that have gone stale.
//
// WARN-ONLY by design: it surfaces a systemMessage and exits 0, never blocking.
// Flip BLOCKING to true once every domain in the manifest is documented — that is
// the only change needed to make it a gate.

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";
import { readManifest } from "./lib/manifest.mjs";
import { findDomain, globToRegex } from "./lib/match.mjs";

const BLOCKING = false;
const TRACKER_PATH = ".claude/.touched-files";
const STALE_DAYS = 90;
const MAX_REPORTED = 8;

/** Repo-relative paths edited via Edit/Write this session. */
function trackedFiles() {
  if (!fs.existsSync(TRACKER_PATH)) return [];
  return fs
    .readFileSync(TRACKER_PATH, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Repo-relative paths with uncommitted changes — catches edits made via Bash. */
function uncommittedFiles() {
  try {
    const out = execFileSync("git", ["status", "--porcelain=v1", "--untracked-files=all"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return out
      .split("\n")
      .map((line) => line.slice(3).trim())
      .filter(Boolean)
      // Renames report "old -> new"; keep the destination.
      .map((p) => (p.includes(" -> ") ? p.split(" -> ")[1] : p))
      .map((p) => p.replace(/^"|"$/g, ""));
  } catch {
    return [];
  }
}

function daysSince(isoDate) {
  const then = Date.parse(isoDate);
  if (Number.isNaN(then)) return null;
  return Math.floor((Date.now() - then) / 86_400_000);
}

function emit(lines) {
  if (lines.length === 0) process.exit(0);
  const message = lines.join("\n");
  if (BLOCKING) {
    process.stdout.write(JSON.stringify({ decision: "block", reason: message }));
  } else {
    process.stdout.write(JSON.stringify({ systemMessage: message, suppressOutput: true }));
  }
  process.exit(0);
}

async function main() {
  // Drain stdin so the harness never sees a broken pipe.
  for await (const _ of process.stdin) void _;

  const repoRoot = process.cwd();
  let manifest;
  try {
    manifest = readManifest(repoRoot);
  } catch {
    // No parseable manifest — nothing to check against.
    process.exit(0);
  }

  const touched = [...new Set([...trackedFiles(), ...uncommittedFiles()])];
  if (touched.length === 0) process.exit(0);

  const docsRoots = new Map(
    Object.entries(manifest.domains).map(([name, def]) => [name, (def.docs ?? "").replace(/\/$/, "")]),
  );

  /** Domains whose docs folder was touched this session. */
  const docsTouched = new Set();
  for (const file of touched) {
    for (const [name, root] of docsRoots) {
      if (root && file.startsWith(root + "/")) docsTouched.add(name);
    }
  }

  const sourceTouchedBy = new Map();
  const orphans = [];
  const ambiguous = [];

  for (const file of touched) {
    // Doc edits and repo furniture are not source changes.
    if (file.startsWith("docs/") || file.startsWith(".claude/")) continue;
    if (!/\.(ts|tsx|mjs|js|jsx|css)$/.test(file)) continue;

    const domain = findDomain(manifest, file);
    if (!domain) {
      orphans.push(file);
      continue;
    }
    if (!sourceTouchedBy.has(domain)) sourceTouchedBy.set(domain, []);
    sourceTouchedBy.get(domain).push(file);

    // Real ambiguity is a tie, not any overlap: a literal path deliberately overriding
    // another domain's glob is the manifest working as designed, so only flag files
    // where two patterns of equal specificity claim different domains.
    const hits = [];
    for (const [name, def] of Object.entries(manifest.domains)) {
      for (const p of def.paths) {
        if (globToRegex(p).test(file)) hits.push({ name, literal: !p.includes("*") });
      }
    }
    const literals = hits.filter((h) => h.literal);
    const owners = new Set(hits.map((h) => h.name));
    if (owners.size > 1 && (literals.length > 1 || literals.length === 0)) {
      ambiguous.push(`${file} → ${[...owners].join(", ")}`);
    }
  }

  const lines = [];

  const undocumented = [...sourceTouchedBy.keys()].filter((d) => !docsTouched.has(d));
  if (undocumented.length > 0) {
    lines.push("doc-sync: source changed without a docs update in the same turn.");
    for (const domain of undocumented.slice(0, MAX_REPORTED)) {
      const root = docsRoots.get(domain);
      const files = sourceTouchedBy.get(domain);
      const exists = root && fs.existsSync(path.join(repoRoot, root));
      const hint = exists ? `update ${root}/` : `not documented yet — run /doc-domain ${domain}`;
      lines.push(`  • ${domain} (${files.length} file${files.length === 1 ? "" : "s"}) — ${hint}`);
    }
    if (undocumented.length > MAX_REPORTED) {
      lines.push(`  • …and ${undocumented.length - MAX_REPORTED} more`);
    }
  }

  if (orphans.length > 0) {
    lines.push(`doc-sync: ${orphans.length} changed file(s) match no domain in the manifest:`);
    for (const f of orphans.slice(0, MAX_REPORTED)) lines.push(`  • ${f}`);
    if (orphans.length > MAX_REPORTED) lines.push(`  • …and ${orphans.length - MAX_REPORTED} more`);
    lines.push("  Add them to an existing domain's paths, or run /doc-domain <new-name>.");
  }

  if (ambiguous.length > 0) {
    lines.push("doc-sync: file claimed by more than one domain — tighten the manifest paths:");
    for (const a of ambiguous.slice(0, MAX_REPORTED)) lines.push(`  • ${a}`);
  }

  const stale = [];
  for (const domain of sourceTouchedBy.keys()) {
    const def = manifest.domains[domain];
    if (!def?.lastVerified) continue;
    const age = daysSince(def.lastVerified);
    if (age !== null && age > STALE_DAYS) stale.push(`${domain} (${age}d since lastVerified)`);
  }
  if (stale.length > 0) {
    lines.push(`doc-sync: docs older than ${STALE_DAYS} days for: ${stale.join(", ")}`);
  }

  emit(lines);
}

main().catch(() => process.exit(0));
