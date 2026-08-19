# frontend

## `ModalFrame` — [src/components/ui/ModalFrame.tsx](../../src/components/ui/ModalFrame.tsx)

The only surviving shared primitive. Live consumers: `ProjectModal` (which `PortfolioPage`
renders). The retired `ToolModal`, `SocialModal`, and `ResumeModal` also import it — they are
unreachable.

The other five primitives in `src/components/ui/` — `AuroraBackdrop`, `EyebrowLabel`,
`GlassCard`, `GradientText`, `SectionHeader` — belong to
[retired-ui](../retired-ui/README.md). Do not reach for them when building an Atelier surface.

## `not-found` — [app/not-found.tsx](../../app/not-found.tsx)

The 404, resolved by Next.js convention rather than by import (which is why a reachability walk
reports it as unreferenced).

It still uses the retired palette — `text-white`, `bg-yellow-500`, `hover:bg-yellow-600`, and an
`id="landing"` left over from the old single-page structure. On an Atelier-ink body that renders
as the old site's colours. This is a genuine inconsistency in live code, not dead code; see
[gotchas.md](./gotchas.md).

## Redirect stubs

| Route | Redirects to |
|---|---|
| `/about` | `/#about` |
| `/projects` | `/#work` |
| `/contact` | `/#contact` |

Server components, no client JS, no UI. If a real standalone page is ever wanted at one of these
paths, the stub is what you replace.

## `src/index.css`

363 lines: the three `@tailwind` directives, a `:root` block of CSS variables, a
`--nav-offset` that shrinks under 1024px, an `@layer base` block, and the keyframes the Atelier
sections animate with (`shimmer`, `marquee`, `blink`, `floatUp`, `travel`, `travelV`, `fadeIn`,
`drawerIn`, `pulseRing`, `spinSlow`) plus `.atelier-reveal` and `.atelier-track` helpers.

Two `@media (prefers-reduced-motion: reduce)` blocks disable the animated pieces.

Note the `:root` variables are the **navy** tokens (`--color-brand-navy`, `--color-accent`,
`--color-accent-cyan`, `--color-accent-violet`), while the Atelier palette lives in
`tailwind.config.js` under `colors.atelier`. Both are live, in the same file's orbit.
