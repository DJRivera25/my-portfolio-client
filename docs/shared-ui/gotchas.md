# gotchas

## There are two global stylesheets and only one is used

`app/globals.css` exists (29 bytes) and is never imported. `app/layout.tsx` line 1 imports
`../src/index.css` instead.

The App Router convention points every reader at `app/globals.css`, so this is the most likely
wrong-file edit in the repo after the duplicate `HowIShip.tsx`. Editing it changes nothing and
reports nothing.

## Two palettes are live at once

| Palette | Where | Used by |
|---|---|---|
| Navy | `:root` variables in `src/index.css`, `colors.brand` / `colors.accent` in Tailwind | `app/not-found.tsx`, all of retired-ui |
| Atelier | `colors.atelier` in `tailwind.config.js` | `body` in the layout, every `portfolio/*` section |

Both resolve. Nothing warns when you use a navy token on an Atelier surface — you just get the old
site's colours in a corner of the new one.

## The 404 is off-theme

`app/not-found.tsx` renders `text-white` on `bg-yellow-500` with a stale `id="landing"`. It is
live code, reachable by convention, and visually inconsistent with everything else. Worth fixing;
it is not part of retired-ui.

## `app/not-found.tsx` fails reachability analysis but is live

Nothing imports it — Next.js resolves it by filename. Any dead-code sweep based on imports will
flag it. Do not delete it on that basis, and be aware the same applies to any other
convention-resolved file added later (`error.tsx`, `loading.tsx`, `template.tsx`).

## `AdminBar` hides itself, the layout does not hide it

The layout renders `<AdminBar />` unconditionally. The component returns `null` on `/`, on
`/login`, and when not signed in. So "why is there no nav on the homepage" is answered inside
`AdminBar`, not in the layout — and a change to its visibility rules affects every route at once.

## The retired `Navbar` and `Footer` are not rendered anywhere

Older guidance said the global `Navbar`/`Footer` "return null on `/`". That is no longer how it
works: the layout does not import them at all, and they are unreachable. The homepage's chrome is
`portfolio/SiteNav.tsx` and `portfolio/SiteFooter.tsx`.

## `--nav-offset` changes at 1024px

`5rem` by default, `4.25rem` under `max-width: 1023px`. Anchor-scroll positioning depends on it,
so a hard-coded scroll offset in a component will disagree with the stylesheet on mobile.
