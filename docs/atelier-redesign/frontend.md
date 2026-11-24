# frontend

## Sections — `src/components/portfolio/`

| Component | Renders |
|---|---|
| `PortfolioPage.tsx` | Owns fetching + shared state, composes everything, provides `PortfolioContext` |
| `PortfolioContext.tsx` | `PortfolioProvider` — shared state without per-section fetching |
| `SiteNav.tsx` | Desktop nav from `atelierNavLinks` |
| `MobileBottomNav.tsx` | Mobile navigation bar |
| `Hero.tsx` | Headline plus the typed terminal driven by `useTypewriter` + `terminalScript` |
| `MarqueeBand.tsx` | Scrolling band from `marqueeItems` (`marquee` keyframe in `src/index.css`) |
| `SelectedWork.tsx` | Project grid, ordered by `sortProjectsForDisplay` |
| `CaseStudyDrawer.tsx` | Slide-over case study built by `toCaseStudy` (`drawerIn` keyframe), plus a live preview of the project's site (below) |
| `AboutSection.tsx` | `aboutContent` |
| `StackSection.tsx` | `stackGroups` — static, not the `Tool` collection |
| `HowIShip.tsx` | `processStages` / `processContent` |
| `ResumeSection.tsx` | `resumeContent`, plus a client-built PDF download (html2canvas → jsPDF) |
| `ContactSection.tsx` | The live contact form via `useContactFormSubmission` |
| `SiteFooter.tsx` | `footerContent` plus merged socials |
| `CommandPalette.tsx` | Keyboard navigation overlay |

`ProjectModal` comes from `src/components/` and belongs to
[portfolio-content](../portfolio-content/README.md).

## Live preview in the case-study drawer

When a case opens, `PortfolioPage` asks `GET /api/projects/[id]/embeddable` once per project (DB
projects with an http(s) link only — the fallback cases never ask) and passes `embeddable` to the
drawer. Only `true` renders `LivePreview` between the details grid and the "Visit the live
project" row; anything else leaves the drawer as it was, with the screenshot hero.

`LivePreview` renders the site in a sandboxed, `loading="lazy"` iframe inside a browser-style
frame. The iframe is laid out at 1440×900 (the screenshot's viewport) and CSS-scaled to the box
width; below 600px it switches to a 390×720 phone viewport. It stays invisible until `onLoad`,
and ignores the pointer until the visitor clicks "Explore the live site", so scrolling past it
scrolls the drawer. Copy lives in `caseStudyContent` in `atelier.ts`.

## Motion hooks — `src/hooks/`

| Hook | Behaviour |
|---|---|
| `useCursorGlow` | Gold radial glow lerping toward the pointer at 0.12/frame via `requestAnimationFrame`. Returns a ref for the glow element. |
| `useMagnetic` | Translates an element toward the cursor (×0.3 / ×0.4) and scales to 1.04 on hover. Returns a ref. |
| `useTypewriter` | Types `TermSegment[][]` from `atelier.ts`, tracking `{ line, seg, ch, done }`. |

**All three no-op on touch devices and under `prefers-reduced-motion: reduce`.** They are
progressive enhancement — every section is fully readable without them.

`useCursorGlow` is called in `PortfolioPage`; the other two are used by the sections that need
them.

## Assets — `public/atelier/`

`Derem-Joshua-Rivera-Resume.pdf`, `about-image.png`, `portrait-duotone.png`, `my-photo.png`,
`mockup.png`, project shots (`ecommerce.png`, `tiket-lakwatsero.png`), and a `logos/` folder.

The resume PDF here is not served by the homepage. `resumeContent.fallbackPdf` points at it, but
nothing reads that field — `ResumeSection` takes no props and never calls `/api/resumes`.

## Styling

Atelier tokens from `tailwind.config.js` (`colors.atelier`: `ink`, `ink-2`, `surface`,
`surface-2`, `raised`, `paper`, `paper-2`, `muted`, `muted-2`, `faint`, and the accents).
Keyframes and the `.atelier-reveal` / `.atelier-track` helpers come from `src/index.css` — owned
by [shared-ui](../shared-ui/README.md).
