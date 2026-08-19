---
description: Refresh one domain's documentation against current code, or scaffold a new domain. Usage:/doc-domain <name>
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
argument-hint: <domain-name>
---

# /doc-domain — refresh or scaffold one domain

The user invoked you with `$ARGUMENTS` — the domain name (e.g. `worklog`, `auth`).

If `$ARGUMENTS` is empty, list the domains from the manifest and ask which one. Do not guess.

## Step 1 — look it up

Read the Domain Manifest from `CLAUDE.md`. Look up `domains[$ARGUMENTS]`.

## If the domain exists → REFRESH

1. Read **every** source file matching its `paths` globs. Not a sample — all of them.
2. Read every existing file in its `docs` folder.
3. Diff docs against code reality:
   - What exists in the code that the docs do not mention?
   - What do the docs claim that no longer exists?
   - What was renamed or moved?
   - Is any documented behaviour now wrong?
4. **Surgically Edit** each stale doc. Change what is wrong; do not rewrite whole files.
5. Add a conditional doc if the domain gained routes / models / UI / tests. Delete one that no
   longer applies.
6. Bump `lastVerified` to today:
   ```bash
   node -e "import('./.claude/hooks/lib/manifest.mjs').then(m=>m.bumpLastVerified(process.cwd(),'<name>','<YYYY-MM-DD>'))"
   ```
7. Report: files changed, what was stale, what you added or removed. Then stop.

## If the domain does not exist → SCAFFOLD

1. Confirm: "`<name>` is not in the Domain Manifest. Scaffold it?"
2. Ask which source paths it should own, or propose a glob set from the orphans `/doc-sync`
   reports. Check the paths do not overlap another domain ambiguously.
3. Read all the matching source.
4. Write the four required docs plus whichever conditionals apply — see the template in
   `CLAUDE.md` under "Documentation".
5. Add the manifest entry with `docs`, `lastVerified`, `purpose`, `paths`.
6. Report and stop.

## Hard rules

- **No invented content.** If you cannot verify something from the source, write
  `_TODO: verify._` — an honest gap beats a confident wrong claim.
- **Cite code locations** as `[file.ts:42](path/file.ts#L42)` so they are clickable.
- **Surgical in refresh, full write in scaffold.** Never blindly overwrite an existing doc.
- **Do not commit.** The no-auto-commit hook will block you; ask the user instead.
- Document what is *there*, including what is broken or dead. Do not describe intentions.
