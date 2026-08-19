# shared-ui

The root layout, the global stylesheet, the one shared modal primitive, the 404, and the redirect
stubs that keep old marketing URLs working.

| Doc | What's in it |
|---|---|
| [architecture.md](./architecture.md) | The layout tree, fonts, and the redirect pattern |
| [frontend.md](./frontend.md) | `ModalFrame`, `not-found`, the stubs |
| [rules.md](./rules.md) | Which stylesheet is real, where new primitives go |
| [gotchas.md](./gotchas.md) | Two stylesheets, two palettes, the off-theme 404 |

## What this domain owns

`app/layout.tsx`, `app/not-found.tsx`, `app/{about,projects,contact}/page.tsx`, `src/index.css`,
and `src/components/ui/ModalFrame.tsx`.

## What it no longer owns

`Navbar.tsx`, `Footer.tsx`, `Landing.tsx`, `About.tsx`, and the other five `ui/*` primitives are
unreachable and live in [retired-ui](../retired-ui/README.md). The homepage supplies its own
navigation and footer from [atelier-redesign](../atelier-redesign/README.md); the signed-in pages
get [`AdminBar`](../auth/frontend.md) instead.

## Related domains

- [atelier-redesign](../atelier-redesign/README.md) — owns the homepage chrome and the Atelier tokens
- [auth](../auth/README.md) — `AuthProvider` and `AdminBar` mount here
