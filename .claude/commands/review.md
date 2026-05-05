---
description: Review the current uncommitted changes against CLAUDE.md rules
---

Review the current uncommitted diff against this project's standards.

Steps:

1. Run `git status` and `git diff` to see what changed.
2. Read `CLAUDE.md` if not already in context.
3. For each changed file, walk the checklist below and report findings as a bulleted list under each heading. Use file:line references.

**Layering**
- Components must not import from `@/lib` Mongoose models or `@/lib/db`.
- Route handlers should be thin (parse → authorize → delegate). Flag any handler with non-trivial business logic.
- DB access only via `await dbConnect()` from `@/lib/db`.

**Auth & data exposure**
- Any new POST/PUT/DELETE handler — does it call `isAuthorizedAdmin(req)`?
- Any handler returning `User` — does it strip `password`?
- Any new env var read — is it documented in `.env.example`?

**Conventions**
- Mongoose models use `models.X || model("X", …)` pattern.
- Path aliases used correctly (`@/lib`, `@/app`, `@/src`).
- No new `any` without justification.
- No hardcoded site name / contact info — use `siteConfig` from `@/lib/site`.
- No hardcoded marketing copy — use `src/config/content.ts`.

**Domain manifest sync**
- If a new file lives outside the existing `domains.*.paths` globs, suggest which domain it belongs to (or whether a new domain is warranted).

**Build / type-check**
- If types or signatures changed, suggest the user run `npx tsc --noEmit`.

End with a one-paragraph summary verdict: ✅ ready to commit, ⚠️ minor issues, or ❌ needs fixes — and list the top 3 things to address (if any).

Do not modify files. Do not run `git add` or `git commit` (the no-auto-commit hook will block you anyway).
