---
description: Draft a step-by-step implementation plan for a non-trivial change before writing code
---

You are about to plan an implementation for: $ARGUMENTS

Before writing the plan:

1. Re-read `CLAUDE.md` (especially the Hard Rules and Domain Manifest) so the plan respects layering, auth, and the no-auto-commit rule.
2. Identify which **domain(s)** in the manifest are affected. List them.
3. Use `Glob`/`Grep` (or the `Explore` agent if it spans more than 3 lookups) to find the existing patterns to mirror — do not invent new patterns where one already exists in the same area.

Then produce a plan with these sections:

**Goal** — one paragraph, what success looks like.

**Domains affected** — from the manifest.

**Files to create / edit** — bullet list with absolute repo-relative paths and a one-liner per file describing the change.

**Layering check** — one sentence each:
- Does any component touch the DB? (must be no)
- Does any route handler contain business logic > ~30 lines? (must be no)
- Are protected mutations gated by `isAuthorizedAdmin`? (must be yes)
- Does any handler return `User` documents without stripping `password`? (must be no)

**Risks / unknowns** — what could go wrong; what assumptions to verify before coding.

**Verification** — how the user will check this works (manual flow, `npx tsc --noEmit`, `npm run build`, etc.).

**Out of scope** — explicitly what you will NOT touch (e.g. "won't fix existing auth gaps in unrelated routes").

Do not start writing code. End the plan with: "Approve this plan to proceed, or tell me what to change."
