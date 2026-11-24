#!/usr/bin/env node
// Copies the worklog SessionStart hook into ~/.claude/hooks/. Never touches any settings file.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

// The lib goes first: the entry script imports it, so a failed second copy must not leave an entry without its lib.
const FILES = ["worklog-hook-lib.mjs", "worklog-context.mjs"];
const here = path.dirname(fileURLToPath(import.meta.url));
const target = path.join(os.homedir(), ".claude", "hooks");
const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");

function backUp(file) {
  for (let n = 1; ; n++) {
    const candidate = `${file}.bak-${stamp}${n === 1 ? "" : `-${n}`}`;
    try {
      fs.copyFileSync(file, candidate, fs.constants.COPYFILE_EXCL);
      return path.basename(candidate);
    } catch (err) {
      if (err.code !== "EEXIST") throw err;
    }
  }
}

fs.mkdirSync(target, { recursive: true });

for (const name of FILES) {
  const from = path.join(here, name);
  const to = path.join(target, name);
  const next = fs.readFileSync(from);
  if (fs.existsSync(to) && !fs.readFileSync(to).equals(next)) {
    console.log(backUp(to));
  }
  fs.writeFileSync(to, next);
  console.log(name);
}
