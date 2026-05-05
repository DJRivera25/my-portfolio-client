---
description: Scaffold a new React component under src/components following project conventions
---

Scaffold a new component. The user describes what they want: $ARGUMENTS

Before writing anything, invoke the project skill `adding-component` (`.claude/skills/adding-component/SKILL.md`) and follow it.

The skill covers:
- Where the file goes (`src/components/` for page-level, `src/components/ui/` for primitives, subfolder for component families).
- TSX file pattern: default export, typed props, Tailwind for styling, Framer Motion / Headless UI / Lucide where appropriate.
- No DB access, no direct fetch — use a hook from `src/hooks/` or a helper from `src/lib/api/`.
- Pulling copy from `src/config/content.ts` rather than inlining strings.
- Integrating with existing layout/Navbar if it's a new page.

After scaffolding, report:
- File(s) created
- Where it should be imported (e.g. `app/page.tsx`, `app/<route>/page.tsx`)
- Domain manifest update needed (if any)
