# architecture

## Composition

`app/page.tsx` is four lines: it renders
[`PortfolioPage`](../../src/components/portfolio/PortfolioPage.tsx). That component is the whole
homepage — a client component that fetches, holds state, and composes in this order:

```
SiteNav
Hero
MarqueeBand
SelectedWork
AboutSection
StackSection
HowIShip
ResumeSection
ContactSection
SiteFooter
MobileBottomNav
CaseStudyDrawer
CommandPalette
ProjectModal          ← from src/components/, not portfolio/
```

State is shared downward through
[`PortfolioContext`](../../src/components/portfolio/PortfolioContext.tsx) (`PortfolioProvider`),
so sections do not each fetch.

## Data flow

`PortfolioPage` fetches through the shared axios instance (`src/lib/api/client.ts`) and reads
`useAuth()` for the signed-in state. It pulls projects, socials, tools, and resumes from the
public `GET` routes described in [portfolio-content/api.md](../portfolio-content/api.md).

Two transforms from `src/config/atelier.ts` shape what arrives:

- `sortProjectsForDisplay(projects)` orders by the curated `PROJECT_DISPLAY_ORDER` list.
- `toCaseStudy(project, index)` maps a `Project` into the case-study shape the drawer renders,
  using `tagline`, `kind`, `problem`, `solution`, and `highlights`.

`mergeSocials(data)` walks `defaultSocials` and overlays any matching DB row, matching on
lowercased `platform`. The result is that the footer and contact section always render the full
set of platforms whether or not the database has rows for them.

## Graceful fallbacks

The page renders fully with an empty database:

| Data | Fallback | Source |
|---|---|---|
| Projects / case studies | `fallbackCaseStudies` | `src/config/atelier.ts` |
| Socials | `defaultSocials` | `src/config/atelier.ts` |
| Stack | `stackGroups` | `src/config/atelier.ts` — static, not DB-backed |
| Copy | `heroContent`, `aboutContent`, `workContent`, `processContent`, `resumeContent`, `contactContent`, `footerContent` | `src/config/atelier.ts` |

That is deliberate: the homepage is the portfolio, so it must never render half-empty because a
fetch failed.

## Static copy module

[`src/config/atelier.ts`](../../src/config/atelier.ts) is the single copy and token source for
this domain — the `ATELIER` colour object, `DOT_CYCLE`, `atelierNavLinks`, the per-section content
objects, `terminalScript` (typed out by `useTypewriter`), `marqueeItems`, `stackGroups`,
`processStages`, `paletteSections`, and the fallbacks above.

It replaces the retired `content.ts` / `navigation.ts` / `toolCategories.ts` trio.

## Grain overlay

`PortfolioPage` builds an inline `GRAIN_URL` data-URI SVG (`feTurbulence`, `fractalNoise`,
`baseFrequency 0.8`) rather than shipping a texture file — one less request, and it scales.
