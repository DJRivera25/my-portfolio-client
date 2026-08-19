# architecture

## Two retirements, one folder

This domain is the sediment of two separate migrations that were never followed by a delete.

### 1. Create React App → Next.js App Router

The repository began as a CRA app. `src/index.tsx` is the CRA client entry: it calls
`ReactDOM.createRoot(document.getElementById("root"))` and renders an `AuthProvider` plus a
`ToastContainer` around — nothing. The comment in it reads
`{/* Add your main component here if needed */}`.

Under the App Router, `app/layout.tsx` is the entry. `src/index.tsx` is never imported, never
bundled, and never executed.

Its companions:

| File | Was for | Now |
|---|---|---|
| `src/index.tsx` | CRA client mount | Dead. `app/layout.tsx` does this job. |
| `src/react-app-env.d.ts` | `/// <reference types="react-scripts" />` | Dead. `react-scripts` is not a dependency. |
| `src/setupTests.ts` | jest-dom matchers for CRA's jest | Dead. Tests are vitest with `environment: "node"`. |
| `app/globals.css` | App Router convention | Dead. `app/layout.tsx` imports `../src/index.css` instead. |

### 2. Navy theme → Atelier ("The Build Log")

The homepage was a multi-section navy-and-yellow marketing page assembled from
`src/components/*`. The Atelier redesign replaced it with a single page composed in
`src/components/portfolio/PortfolioPage.tsx`.

Every old section has a successor:

| Retired | Replaced by |
|---|---|
| `Landing.tsx` | `portfolio/Hero.tsx` |
| `About.tsx` | `portfolio/AboutSection.tsx` |
| `Projects.tsx`, `projects/ProjectsList.tsx`, `projects/ProjectCard.tsx` | `portfolio/SelectedWork.tsx` |
| `Tools.tsx` | `portfolio/StackSection.tsx` |
| `HowIShip.tsx` | `portfolio/HowIShip.tsx` — **same filename, different folder** |
| `Contact.tsx`, `ContactMessageForm.tsx`, `GetInTouchModal.tsx` | `portfolio/ContactSection.tsx` |
| `Navbar.tsx` | `portfolio/SiteNav.tsx`, `portfolio/MobileBottomNav.tsx` |
| `Footer.tsx` | `portfolio/SiteFooter.tsx` |
| `projects/ResumeSection.tsx` | `portfolio/ResumeSection.tsx` — **same filename, different folder** |
| `ToolModal.tsx`, `SocialModal.tsx`, `ResumeModal.tsx` | No successor; the Atelier sections render inline |
| `config/content.ts`, `config/navigation.ts`, `config/toolCategories.ts` | `config/atelier.ts` |

`ProjectModal.tsx` is the one modal that survived — `PortfolioPage` still imports it, so it
lives in [portfolio-content](../portfolio-content/README.md) rather than here.

## Why the dependency graph looks alive

These files import each other, so every one of them has inbound references. `Navbar.tsx` imports
`GetInTouchModal.tsx`, which imports `ContactMessageForm.tsx`, which imports
`useContactFormSubmission` — a live hook. Nothing in the chain is reachable from `app/`, but a
`grep` for any single filename returns hits and looks reassuring.

That is why reachability has to start from the entry points, not from "is anyone importing
this".
