---
description: Pre-ship checklist — verify build, types, and changes are coherent before the user commits
---

Run a pre-ship verification on the current branch. The user has NOT yet authorized a commit — this is read-only verification.

1. `git status` — list what would be included.
2. `git diff --stat` — get a summary of magnitude.
3. `npx tsc --noEmit` — must pass cleanly.
4. `npm run build` — must succeed (catches Next.js route / RSC / import-cycle issues that `tsc` won't).
5. Cross-check each changed file against `CLAUDE.md` Hard Rules (no commit, layering, admin auth, no password leakage).

Report back in this format:

```
SHIP CHECK — <branch name>

Files changed: <N>
Type-check:  PASS | FAIL  (paste failures verbatim)
Build:       PASS | FAIL  (paste failures verbatim)
CLAUDE.md compliance: PASS | issues below

Outstanding issues:
- <issue 1, file:line>
- <issue 2, file:line>

Suggested commit message:
<short one-liner under 72 chars>

To ship, the user can say: "commit and push"
```

Do NOT run `git add`, `git commit`, `git push`, or any `gh pr` command. Wait for explicit user authorization.
