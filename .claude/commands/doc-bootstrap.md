---
description: First-pass documentation for every domain that has none (lastVerified null), one domain at a time with a review pause between each.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# /doc-bootstrap — document the undocumented domains

## What you are doing

Generating the first set of docs for every domain in the Domain Manifest whose `lastVerified` is
`null`. Domains that already have docs are **skipped** — use `/doc-domain <name>` to refresh
those.

Read this whole prompt before starting.

## Step 0 — plan

1. Read `CLAUDE.md`, including the Documentation section (the doc template) and the manifest.
2. List the domains with `lastVerified: null`, with owned-file counts.
3. Tell the user the plan: "N domains undocumented, ~M doc files. Starting with `<x>`. Say
   `skip` at any pause to move on." Then begin — do not wait for a go-ahead on the list itself.

## Per-domain loop

For each undocumented domain, cheapest first by owned-file count, so the user sees results early:

1. **Glob its `paths`** and read every matching file. All of them, not a sample.
2. **Look for existing prose to migrate** — a stray `docs/*.md`, a long comment block, a README.
   Migrate the content; preserve specifics (env var names, dates, code paths). Do not summarise
   away detail.
3. **Decide which files to write.** Four always: `README.md`, `architecture.md`, `rules.md`,
   `gotchas.md`. Then `api.md` (routes), `models.md` (Mongoose models), `frontend.md` (UI),
   `testing.md` (tests). Skip a conditional that does not apply — do not write a stub.
4. **Write them.** Code-grounded, every claim traceable to a file. Cite as
   `[file.ts:42](path/file.ts#L42)`.
5. **Bump `lastVerified`** via `bumpLastVerified` in `.claude/hooks/lib/manifest.mjs`.
6. **Pause** with a short report: docs written, what was migrated, and one to three key findings.
   Then continue to the next domain — do not wait for approval; the user interrupts if they want
   to stop.

## After all domains

1. Update `docs/README.md` — the domain table, file counts, and the "read these first" list.
2. Run `/doc-sync` and report: coverage should be 0 orphans, 0 dead paths, 0 true ambiguity.
3. Summarise the findings that matter across domains — dead code, security gaps, stale claims in
   `CLAUDE.md`. Correct `CLAUDE.md` where the documentation pass proved it wrong.

## Hard rules

- **No invented content.** Write `_TODO: verify._` for anything you cannot confirm from source.
- **Document reality, including the ugly parts.** Dead code, missing auth checks, broken types,
  and duplicate filenames are the most valuable things you can write down. Do not soften them, and
  do not describe what the code was *meant* to do.
- **One domain at a time.** Do not parallelise — the user needs to be able to follow along.
- **Do not commit.** The no-auto-commit hook blocks it; ask instead.
- **Do not fix code.** If you find a bug, document it and report it. Fixing is a separate,
  authorised task.
