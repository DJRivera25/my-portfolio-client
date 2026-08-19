# retired-ui

The pre-Atelier component tree and the Create React App entry scaffolding. **Nothing in this
domain is reachable from any `app/` entry point.** It is kept in one domain so it stops looking
load-bearing.

| Doc | What's in it |
|---|---|
| [architecture.md](./architecture.md) | How this code came to be orphaned, and what replaced each piece |
| [rules.md](./rules.md) | Do not import from here, do not fix bugs here |
| [gotchas.md](./gotchas.md) | The traps this code sets for a reader — and for `grep` |

There is no `api.md`, `models.md`, `frontend.md`, or `testing.md`: this domain has no routes, no
models, no live UI, and no tests.

## How this was established

An import-reachability walk from every `app/**/{page,layout,route}.tsx` entry point, following
relative and `@/` specifiers transitively. 30 of 115 tracked source files came back unreachable.

To re-run it after changes, walk imports from the `app/` entry points and diff against
`git ls-files`. `/doc-sync` reports the manifest side of the same question (orphans and dead
paths); it does not do reachability.

## The 30 files

**Pre-Atelier sections and modals** — replaced by `src/components/portfolio/*`:

`About.tsx` · `Contact.tsx` · `ContactMessageForm.tsx` · `Footer.tsx` · `GetInTouchModal.tsx` ·
`HowIShip.tsx` · `Landing.tsx` · `Navbar.tsx` · `Projects.tsx` · `ResumeModal.tsx` ·
`SocialModal.tsx` · `ToolModal.tsx` · `Tools.tsx`

**Project presentation** — `src/components/projects/`:

`BrowserFrame.tsx` · `PhoneFrame.tsx` · `ProjectCard.tsx` · `ProjectsList.tsx` ·
`ResumeSection.tsx`

**UI primitives** — the navy-theme set:

`ui/AuroraBackdrop.tsx` · `ui/EyebrowLabel.tsx` · `ui/GlassCard.tsx` · `ui/GradientText.tsx` ·
`ui/SectionHeader.tsx`

`ui/ModalFrame.tsx` is **not** here — it is still live via `ProjectModal`, and belongs to
[shared-ui](../shared-ui/README.md).

**Static copy** — superseded by `src/config/atelier.ts`:

`config/content.ts` · `config/navigation.ts` · `config/toolCategories.ts`

**CRA scaffolding**:

`src/index.tsx` · `src/react-app-env.d.ts` · `src/setupTests.ts` · `app/globals.css`

## Related domains

- [atelier-redesign](../atelier-redesign/README.md) — what replaced all of this
- [shared-ui](../shared-ui/README.md) — the primitives and layout that survived
