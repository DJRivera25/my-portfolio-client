// Parses the Domain Manifest JSON block out of CLAUDE.md.
// Single source of truth for the file -> domain map, shared by the doc-sync hook
// and the /doc-* commands.

import fs from "node:fs";
import path from "node:path";

const MANIFEST_START = "<!-- DOMAIN-MANIFEST-START -->";
const MANIFEST_END = "<!-- DOMAIN-MANIFEST-END -->";

/**
 * Read CLAUDE.md and extract the manifest as a parsed object.
 * @param {string} repoRoot Absolute path to repo root.
 * @returns {{version: number, domains: Record<string, {purpose: string, docs: string, paths: string[], lastVerified: string|null}>}}
 */
export function readManifest(repoRoot) {
  const claudeMdPath = path.join(repoRoot, "CLAUDE.md");
  const content = fs.readFileSync(claudeMdPath, "utf8");

  const startIdx = content.indexOf(MANIFEST_START);
  const endIdx = content.indexOf(MANIFEST_END);
  if (startIdx === -1 || endIdx === -1) {
    throw new Error(
      `Domain Manifest markers not found in CLAUDE.md. Expected ${MANIFEST_START} and ${MANIFEST_END}.`,
    );
  }

  const block = content.slice(startIdx, endIdx);
  // CRLF-tolerant: Windows checkouts may have \r\n line endings.
  const match = block.match(/```json\r?\n([\s\S]+?)\r?\n```/);
  if (!match) {
    throw new Error("Domain Manifest block found but no fenced ```json``` content inside.");
  }

  return JSON.parse(match[1]);
}

/**
 * Update one domain's lastVerified date and write CLAUDE.md back.
 * Rewrites only the fenced block between the markers; prose around it is untouched.
 * @param {string} repoRoot
 * @param {string} domainName
 * @param {string} isoDate e.g. "2026-08-19"
 */
export function bumpLastVerified(repoRoot, domainName, isoDate) {
  const claudeMdPath = path.join(repoRoot, "CLAUDE.md");
  const content = fs.readFileSync(claudeMdPath, "utf8");
  const manifest = readManifest(repoRoot);
  if (!manifest.domains[domainName]) {
    throw new Error(`Cannot bump lastVerified: domain "${domainName}" not in manifest.`);
  }
  manifest.domains[domainName].lastVerified = isoDate;

  const startIdx = content.indexOf(MANIFEST_START);
  const endIdx = content.indexOf(MANIFEST_END);
  const before = content.slice(0, startIdx);
  const after = content.slice(endIdx);
  const newBlock = `${MANIFEST_START}\n\`\`\`json\n${JSON.stringify(manifest, null, 2)}\n\`\`\`\n`;
  fs.writeFileSync(claudeMdPath, before + newBlock + after);
}
