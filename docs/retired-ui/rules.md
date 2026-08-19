# rules

## Do not import from this domain

Nothing live may import a file listed in `retired-ui`. Importing one resurrects a component
written against the retired navy palette and the retired copy modules, and it will not match the
Atelier design system.

If you need what a retired component did, read it for reference and implement in
`src/components/portfolio/`.

## Do not fix bugs here

A defect in unreachable code is not a defect. Do not spend a review or a type-error fix on this
domain unless the fix is part of deleting it.

The exception is the whole-repo gates: if `npm run type-check` fails inside these files, the fix
is deletion, not repair.

## Do not add to this domain

New UI goes in `src/components/portfolio/` (Atelier sections) or
`src/components/ui/` (shared primitives, and only if genuinely shared). Nothing new should ever
be added to a `retired-ui` path.

## Copy belongs in `src/config/atelier.ts`

`config/content.ts`, `config/navigation.ts`, and `config/toolCategories.ts` are retired. Any
guidance — including older revisions of `CLAUDE.md` — that tells you to put marketing copy in
`content.ts` is out of date. The live copy module is `src/config/atelier.ts`.

## Deleting this domain

It is a safe delete in one pass, with two carve-outs:

1. **Keep `src/components/ui/ModalFrame.tsx`** — live via `ProjectModal`.
2. **Keep `src/index.css`** — `app/layout.tsx` imports it. It is `app/globals.css` that is dead.

After deleting, remove the `retired-ui` entry from the Domain Manifest and delete
`docs/retired-ui/`. Then `npm run type-check` and `npm run build` should both pass with a smaller
graph.

Deleting also lets `package.json` shed `@testing-library/*`, `@types/jest`, `web-vitals`, and the
`react-app` `eslintConfig` block, since `src/setupTests.ts` is their only consumer.
