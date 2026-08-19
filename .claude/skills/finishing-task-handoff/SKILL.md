---
name: finishing-task-handoff
description: Use when implementation work is finished and you are about to tell the user it is done, before asking them to commit, or when wrapping up a feature or bugfix. Triggers on "I'm done", "ready to commit", "all set", "wrap this up", or before any "task complete" message.
---

# finishing-task-handoff

## When to use

Immediately before you tell the user a piece of work is finished. Not after.

The point is that "done" in this repo means verified, documented, and honestly reported — and DJ
commits himself, so your handoff is the last thing that happens before a human decides whether to
trust the change.

## 1. Verify — run it, do not predict it

```bash
npm run type-check   # tsc --noEmit
npm test             # vitest run, if anything under lib/ changed
npm run build        # if routes, layout, or config changed
```

Read the actual output. **Never claim a check passed without having seen it pass.**

Two known false positives before you panic:

- A type error inside `.next/types/...` is a stale generated type for a deleted route. Run
  `npm run build` or delete `.next`, then re-check.
- The repo may already have pre-existing failures unrelated to your change. Establish that with
  `git stash` or by reading the error paths — then report them as pre-existing rather than
  claiming you broke or fixed them.

## 2. Check your own diff against the project rules

```bash
git status && git diff
```

- Components must not import `lib/models/**` or `@/lib/db`.
- Every new mutating or admin-only handler starts with
  `if (!isAuthorizedAdmin(req)) return unauthorizedResponse();`
- Any handler returning `User` documents does `.select("-password")`.
- Mongoose models use `models.X || model("X", …)`.
- Path aliases are only `@/lib/*`, `@/app/*`, `@/src/*`.
- No new `any` without a stated reason.
- Site strings come from `siteConfig`; homepage copy from `src/config/atelier.ts`.
- New env var → documented in `.env.example`.

Also confirm you did not edit a `retired-ui` file by mistake. If a component change produced no
visible effect, that is the likely reason — the live `HowIShip.tsx` and `ResumeSection.tsx` are the
ones under `src/components/portfolio/`.

## 3. Update the docs in the same change

Every domain owns `docs/<domain>/`. If you changed a domain's source, its docs are part of the
change, not a follow-up:

- New route → `api.md`
- New or changed schema → `models.md`
- New component or page → `frontend.md`
- New constraint you had to respect → `rules.md`
- Something that surprised you → **`gotchas.md`**, which is the highest-value file in the set
- New test → `testing.md`

Then bump `lastVerified` for that domain. `/doc-domain <name>` or the `domain-doc-updater`
sub-agent will do this if the surface is large.

The `doc-sync` Stop hook warns about exactly this. Treat the warning as a checklist item, not
noise.

## 4. Report honestly

State plainly:

- What changed, in one or two sentences
- What you verified, with the commands you actually ran
- What you did **not** do — skipped scope, untested paths, assumptions you made
- Anything you found but did not fix, as a separate list

Then ask about committing. **Never run `git add`, `git commit`, or `git push`** — DJ commits
himself, and a hook blocks it regardless. Suggest a branch name if the work is substantial; recent
history is feature branches merged into `master`.

## Anti-patterns

| Do not | Instead |
|---|---|
| "Everything passes" without running anything | Run the commands, paste the output |
| Claiming a fix works because the code looks right | Reproduce the original symptom, show it gone |
| Leaving docs for later | They are part of this change |
| Burying a problem in a wall of success text | Lead with it |
| Reporting a pre-existing failure as your own breakage, or ignoring it | Say which it is |
| Committing because the work seems finished | Ask |
