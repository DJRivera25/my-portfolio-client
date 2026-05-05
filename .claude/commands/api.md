---
description: Scaffold a new App Router API route under app/api/ following project conventions
---

Scaffold a new API route. The user describes what they want: $ARGUMENTS

Before writing anything, invoke the project skill `adding-api-route` (`.claude/skills/adding-api-route/SKILL.md`) and follow it.

The skill covers:
- Folder structure under `app/api/<resource>/route.ts` (and `[id]/route.ts` for single-resource ops).
- Mandatory imports (`dbConnect`, `NextResponse`, model, `isAuthorizedAdmin` for protected ops).
- Per-method shape (GET, POST, PUT, DELETE) and which require auth.
- Error handling and consistent response shapes with sibling routes.
- Adding the new file paths to the appropriate domain in `CLAUDE.md`'s Domain Manifest.

After scaffolding, report:
- Files created (paths)
- Whether the route is protected and why
- Domain manifest update made (if any)
- Suggested manual test (curl / browser flow)
