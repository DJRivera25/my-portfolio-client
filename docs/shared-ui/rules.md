# rules

## `src/index.css` is the global stylesheet

`app/layout.tsx` imports it. **Do not edit `app/globals.css`** — nothing imports it, so changes
there have no effect and produce no error. If the App Router convention is ever restored, move the
contents and update the layout import in the same change.

## New shared primitives go in `src/components/ui/`

But only if genuinely shared by two or more live surfaces. A component used by one Atelier section
belongs in `src/components/portfolio/` next to its consumer.

Do not extend `AuroraBackdrop`, `EyebrowLabel`, `GlassCard`, `GradientText`, or `SectionHeader` —
they are retired and written against the navy palette.

## Use Atelier tokens for anything new

`bg-atelier-*`, `text-atelier-*` from `tailwind.config.js`. The navy tokens (`brand.navy`,
`accent.*`) and the `:root` CSS variables belong to the retired theme. Mixing them produces the
inconsistency `app/not-found.tsx` currently shows.

## Site strings come from `siteConfig`

Title, description, `ogUrl`, contact email and phone all live in [`lib/site.ts`](../../lib/site.ts).
Never duplicate them into a component or a metadata block — import them.

## The layout stays thin

`app/layout.tsx` mounts providers, global chrome, and fonts. It is not a place for data fetching
or business logic. `AdminBar` decides its own visibility from `usePathname` and `useAuth` rather
than the layout branching on route.

## Keep the redirect stubs

They exist so old bookmarks and any external links to `/about`, `/projects`, and `/contact` keep
working. Deleting them turns those URLs into 404s. If a stub becomes a real page, keep the anchor
target reachable on the homepage too.

## Respect reduced motion

`src/index.css` has two `@media (prefers-reduced-motion: reduce)` blocks, and the Atelier hooks
(`useCursorGlow`, `useMagnetic`) no-op under the same preference. Any new animation follows suit.
