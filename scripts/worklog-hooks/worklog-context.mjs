#!/usr/bin/env node
/**
 * SessionStart hook: prints this project's open worklog items into a new session.
 * Never blocks a session: every call has a 4 s cap, everything is caught, exit is always 0.
 * The project comes from the git remote (credentials stripped) or the main checkout's name,
 * so a git worktree resolves to the same project as its main checkout.
 */
import { execFileSync } from "node:child_process";
import {
  briefingFrom,
  callTool,
  parseHookInput,
  projectLookup,
  readServerConfig,
} from "./worklog-hook-lib.mjs";

function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    const timer = setTimeout(() => resolve(data), 1000);
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => {
      clearTimeout(timer);
      resolve(data);
    });
    process.stdin.on("error", () => resolve(data));
  });
}

function git(cwd, args) {
  try {
    const out = execFileSync("git", args, {
      cwd,
      timeout: 2000,
      stdio: ["ignore", "pipe", "ignore"],
    });
    return out.toString().trim() || null;
  } catch {
    return null;
  }
}

function emit(additionalContext) {
  process.stdout.write(
    JSON.stringify({ hookSpecificOutput: { hookEventName: "SessionStart", additionalContext } })
  );
}

async function main() {
  const input = parseHookInput(await readStdin());
  const cwd = input.cwd ?? process.cwd();

  const lookup = projectLookup({
    remoteUrl: git(cwd, ["remote", "get-url", "origin"]),
    commonDir: git(cwd, ["rev-parse", "--path-format=absolute", "--git-common-dir"]),
  });
  if (!lookup) return;

  const cfg = readServerConfig();
  if (!cfg) return;

  const reply = await callTool(cfg, "list_work", { ...lookup, status: "open", limit: 10 });
  const briefing = briefingFrom(reply);
  if (briefing !== null) emit(briefing);
}

main()
  .catch(() => {})
  .finally(() => process.exit(0));
