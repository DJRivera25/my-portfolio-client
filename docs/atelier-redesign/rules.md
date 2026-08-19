# rules

## Copy lives in `src/config/atelier.ts`

No user-visible string is hard-coded in a section component. Add it to the relevant content object
in `atelier.ts` and read it from there.

**Not** `src/config/content.ts` — that module is retired. Any guidance pointing at it is stale.

## Use Atelier tokens only

`bg-atelier-*`, `text-atelier-*`, and the `ATELIER` object. The navy palette (`brand.navy`,
`accent.*`) and the `:root` CSS variables belong to the retired theme and must not appear in a
`portfolio/*` component.

## Every section renders without data

The homepage is the portfolio — it cannot look broken because a fetch failed or the database is
empty. A new DB-backed section needs a fallback in `atelier.ts` (following
`fallbackCaseStudies` / `defaultSocials`) before it ships.

## Fetch in `PortfolioPage`, not in sections

`PortfolioPage` owns data fetching and passes state down through `PortfolioContext`. A section
that fetches for itself creates a second request for data the page already has, and breaks the
single-loading-state model.

## No DB access from components

These are client components. They read `src/lib/api/client.ts` or context — never Mongoose, never
`@/lib/db`. This is the project-wide layering rule and it is absolute here.

## Motion is optional, always

Any new animation must no-op under `prefers-reduced-motion: reduce` and on touch devices, matching
`useCursorGlow`, `useMagnetic`, and the `@media` blocks in `src/index.css`. Content must never
depend on an animation completing to become readable.

## Keep `PROJECT_DISPLAY_ORDER` in step with the data

`sortProjectsForDisplay` orders by this curated list in `atelier.ts`. A new project that is not in
the list still renders, but its position is not curated — update the list when adding one you care
about the placement of.

## Put new keyframes in `src/index.css`

Section components use utility classes; the keyframes themselves live in the global stylesheet
alongside the existing set. Do not inline `<style>` blocks in components.
