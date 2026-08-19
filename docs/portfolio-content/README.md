# portfolio-content

The public portfolio data — projects, tools, socials, resume — as models and an HTTP surface.
The Atelier homepage reads it; this domain does not render it.

| Doc | What's in it |
|---|---|
| [architecture.md](./architecture.md) | The read/write split and the shared route shape |
| [api.md](./api.md) | All five route families, and the `resume` vs `resumes` overlap |
| [models.md](./models.md) | `Project`, `Tool`, `Social`, `Resume` |
| [frontend.md](./frontend.md) | `ProjectModal` — the one surviving consumer |
| [rules.md](./rules.md) | Public GET, admin mutate, upload through Cloudinary only |
| [gotchas.md](./gotchas.md) | Duplicate resume routes, unvalidated bodies, tag parsing |

## What this domain owns

`lib/models/{Project,Tool,Social,Resume}.ts`, `app/api/{projects,tools,socials,resume,resumes}/**`,
`src/components/ProjectModal.tsx`, and `src/types/portfolio.ts`.

## What it does not own

The rendering. `SelectedWork`, `StackSection`, `ResumeSection`, and `ContactSection` are
[atelier-redesign](../atelier-redesign/README.md). The old `Projects.tsx` / `Tools.tsx` grids and
the `ToolModal` / `SocialModal` / `ResumeModal` set are in
[retired-ui](../retired-ui/README.md) — unreachable.

## Related domains

- [media-upload](../media-upload/README.md) — `uploadImageToPortfolio` backs project images
- [atelier-redesign](../atelier-redesign/README.md) — the only live consumer of these APIs
- [worklog](../worklog/README.md) — `WorkProject.portfolioProject` may reference a `Project`
