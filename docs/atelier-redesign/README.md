# atelier-redesign

"The Build Log" — the single-page home, and the Atelier design system it is built in.
`app/page.tsx` renders `PortfolioPage`, which owns the data fetching and shared state and
composes every section.

| Doc | What's in it |
|---|---|
| [architecture.md](./architecture.md) | Composition, data flow, context, the fallback strategy |
| [frontend.md](./frontend.md) | Every section component and the three motion hooks |
| [rules.md](./rules.md) | Copy in `atelier.ts`, tokens, reduced motion, fallbacks |
| [gotchas.md](./gotchas.md) | Duplicate filenames, the display-order list, hook no-ops |

## What this domain owns

`app/page.tsx`, `src/components/portfolio/**`, `src/config/atelier.ts`,
`src/hooks/{useCursorGlow,useMagnetic,useTypewriter}.ts`, and `public/atelier/**`.

## Data it consumes

It owns no models and no routes. It reads [portfolio-content](../portfolio-content/README.md)
(`/api/projects`, `/api/tools`, `/api/socials`, `/api/resumes`) and posts through
[messaging](../messaging/README.md) (`POST /api/messages`).

## Related domains

- [portfolio-content](../portfolio-content/README.md) — the data, and `ProjectModal`
- [shared-ui](../shared-ui/README.md) — the layout, `src/index.css` keyframes, `ModalFrame`
- [retired-ui](../retired-ui/README.md) — the sections this replaced
