#!/usr/bin/env node
// Stop hook. Runs `npm run type-check` when TypeScript changed, and `npm test`
// when anything under lib/ changed (vitest only collects lib/**/*.test.ts).
//
// WARN-ONLY by design: reports failures as a systemMessage and exits 0. Flip
// BLOCKING to true to turn it into a real gate.
//
// Skips entirely when the session touched no relevant files, so a docs-only or
// config-only turn costs nothing.

import fs from "node:fs";
import process from "node:process";
import { execFileSync, execSync } from "node:child_process";

const BLOCKING = false;
const TRACKER_PATH = ".claude/.touched-files";
const TIMEOUT_MS = 180_000;
const MAX_OUTPUT_LINES = 25;

function trackedFiles() {
  if (!fs.existsSync(TRACKER_PATH)) return [];
  return fs
    .readFileSync(TRACKER_PATH, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

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
      .map((p) => (p.includes(" -> ") ? p.split(" -> ")[1] : p))
      .map((p) => p.replace(/^"|"$/g, ""));
  } catch {
    return [];
  }
}

/** Run an npm script. Returns null on success, or the tail of its output on failure. */
function run(script) {
  try {
    execSync(`npm run ${script} --silent`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: TIMEOUT_MS,
    });
    return null;
  } catch (err) {
    if (err.killed || err.signal) return `${script}: timed out after ${TIMEOUT_MS / 1000}s`;
    const output = `${err.stdout ?? ""}${err.stderr ?? ""}`.trim();
    const lines = output.split("\n").filter(Boolean);
    const tail = lines.slice(0, MAX_OUTPUT_LINES);
    if (lines.length > MAX_OUTPUT_LINES) tail.push(`…${lines.length - MAX_OUTPUT_LINES} more lines`);
    return `${script} failed:\n${tail.map((l) => "  " + l).join("\n")}`;
  }
}

async function main() {
  for await (const _ of process.stdin) void _;

  const touched = [...new Set([...trackedFiles(), ...uncommittedFiles()])];
  const typescript = touched.filter((f) => /\.(ts|tsx)$/.test(f) && !f.startsWith(".claude/"));
  if (typescript.length === 0) process.exit(0);

  const failures = [];

  const typeCheck = run("type-check");
  if (typeCheck) failures.push(typeCheck);

  // vitest.config.mts only includes lib/**/*.test.ts — skip the run otherwise.
  if (typescript.some((f) => f.startsWith("lib/"))) {
    const tests = run("test");
    if (tests) failures.push(tests);
  }

  if (failures.length === 0) process.exit(0);

  const message = ["typecheck-gate:", ...failures].join("\n");
  if (BLOCKING) {
    process.stdout.write(JSON.stringify({ decision: "block", reason: message }));
  } else {
    process.stdout.write(JSON.stringify({ systemMessage: message, suppressOutput: true }));
  }
  process.exit(0);
}

main().catch(() => process.exit(0));
