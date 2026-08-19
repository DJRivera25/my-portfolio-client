# frontend

This domain owns one live component.

## `ProjectModal` — [src/components/ProjectModal.tsx](../../src/components/ProjectModal.tsx)

The project detail modal, imported by
[`PortfolioPage`](../../src/components/portfolio/PortfolioPage.tsx). It is the only pre-Atelier
component that survived the redesign, which is why it sits in `src/components/` rather than
`src/components/portfolio/`.

It renders through `src/components/ui/ModalFrame.tsx`, owned by
[shared-ui](../shared-ui/README.md).

## Where the data is actually rendered

| Surface | Component | Domain |
|---|---|---|
| Project grid + case studies | `portfolio/SelectedWork.tsx`, `portfolio/CaseStudyDrawer.tsx` | atelier-redesign |
| Tools / stack | `portfolio/StackSection.tsx` | atelier-redesign |
| Resume | `portfolio/ResumeSection.tsx` | atelier-redesign |
| Socials | `portfolio/ContactSection.tsx`, `portfolio/SiteFooter.tsx` | atelier-redesign |

Fetching happens once in `PortfolioPage`, which owns the shared state and passes it down through
`PortfolioContext`.

## Retired consumers

`Projects.tsx`, `Tools.tsx`, `projects/ProjectsList.tsx`, `projects/ProjectCard.tsx`,
`projects/ResumeSection.tsx`, `ToolModal.tsx`, `SocialModal.tsx`, and `ResumeModal.tsx` all
consumed these APIs and are unreachable. Do not extend them — see
[retired-ui/rules.md](../retired-ui/rules.md).
