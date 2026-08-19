#!/usr/bin/env node
// PostToolUse hook (matcher: Edit|Write|MultiEdit|NotebookEdit).
// Appends each edited repo-relative path to .claude/.touched-files so the Stop
// hooks know what this session actually changed. Silent unless something breaks.
//
// Files edited through Bash (sed, heredocs) are invisible here — doc-sync.mjs
// unions this list with the uncommitted git diff to cover that case.
//
// Hook input (stdin JSON):
//   { "hook_event_name": "PostToolUse", "tool_name": "Edit",
//     "tool_input": { "file_path": "/abs/path/to/file.ts", ... }, ... }

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const TRACKER_PATH = ".claude/.touched-files";

async function main() {
  let raw = "";
  for await (const chunk of process.stdin) raw += chunk;

  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  const filePath = event?.tool_input?.file_path;
  if (!filePath) process.exit(0);

  const cwd = process.cwd();
  let relPath = filePath;
  if (path.isAbsolute(filePath)) {
    const r = path.relative(cwd, filePath);
    if (r.startsWith("..")) process.exit(0);
    relPath = r;
  }
  relPath = relPath.replace(/\\/g, "/");

  // Append; the Stop hooks deduplicate on read.
  fs.mkdirSync(path.dirname(TRACKER_PATH), { recursive: true });
  fs.appendFileSync(TRACKER_PATH, relPath + "\n");

  process.exit(0);
}

main().catch(() => process.exit(0));
