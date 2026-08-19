# gotchas

## Two files named `HowIShip.tsx`, two named `ResumeSection.tsx`

| Retired | Live |
|---|---|
| `src/components/HowIShip.tsx` | `src/components/portfolio/HowIShip.tsx` |
| `src/components/projects/ResumeSection.tsx` | `src/components/portfolio/ResumeSection.tsx` |

Open the wrong one and you will edit code that never renders. The live pair is always the one
under `portfolio/`. This is the single most likely way to waste an hour in this repository.

## `grep` makes this code look used

Every retired file is imported by some other retired file, so a name search always returns hits.
`Navbar.tsx` → `GetInTouchModal.tsx` → `ContactMessageForm.tsx` → `useContactFormSubmission`
(live). The chain ends in live code, which makes it read as a live feature.

Reachability must be computed from `app/**/{page,layout,route}.tsx` outward. "Something imports
it" proves nothing here.

## `src/index.css` is live; `app/globals.css` is not

The App Router convention is `app/globals.css`, so that is the file a reader reaches for. But
`app/layout.tsx` line 1 is `import "../src/index.css"`. `app/globals.css` is a 29-byte file
nothing imports.

Editing `app/globals.css` produces no visible change, with no error to explain why.

## `src/setupTests.ts` implies a component test suite that does not exist

It imports `@testing-library/jest-dom`. Combined with `@testing-library/react`,
`@testing-library/user-event`, and `@types/jest` in `package.json`, this reads as a configured
component-testing setup.

There is none. `vitest.config.mts` sets `environment: "node"` and
`include: ["lib/**/*.test.ts"]`. No jsdom, no component tests, and `setupTests.ts` is wired to
nothing.

## `app/not-found.tsx` is live despite failing reachability

Reachability reports it unreachable because nothing imports it — but Next.js resolves it by
convention. It is **not** part of this domain; it belongs to
[shared-ui](../shared-ui/README.md).

Note that it still uses the retired palette (`text-white`, `bg-yellow-500`) rather than Atelier
tokens, so a 404 looks like the old site. That is a real inconsistency in live code.

## The retired components are not broken

They compiled and worked. They were replaced, not fixed. So reading them for reference is
reasonable — the copy in `config/content.ts` in particular is real, shipped copy. Just do not
wire any of it back up.
