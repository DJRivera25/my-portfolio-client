---
name: adding-component
description: Use when creating a new React component under src/components/. Enforces the no-DB-from-UI rule, hook/API helper boundary, content-config sourcing, and the project's chosen UI primitives.
---

# Adding a component

## When to use

You are creating a new `.tsx` file under `src/components/` or `src/components/ui/` (or a feature subfolder like `src/components/projects/`).

## Where does it go?

| Component shape | Location |
|---|---|
| Page section (Landing, About, Tools, Contact) | `src/components/<Name>.tsx` |
| Modal | `src/components/<Name>Modal.tsx` |
| Reusable primitive (Button, Input, Spinner) | `src/components/ui/<Name>.tsx` |
| Feature-grouped component | `src/components/<feature>/<Name>.tsx` (e.g. `src/components/projects/ProjectCard.tsx`) |

If creating a new admin or auth-gated page, also wrap it with `<ProtectedRoute>` from `src/components/ProtectedRoute.tsx`.

## Template

```tsx
"use client";

import { motion } from "framer-motion";
// import { ChevronDown } from "lucide-react";  // icons
// import { useFoo } from "@/src/hooks/useFoo"; // stateful logic

type Props = {
  title: string;
  onClose?: () => void;
};

export default function MyComponent({ title, onClose }: Props) {
  return (
    <section className="py-12 px-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {/* … */}
    </section>
  );
}
```

Notes:
- `"use client"` is required for any component using state, effects, framer-motion, or event handlers. Server-only components (rare here) omit it.
- Default export. The repo uses default exports throughout `src/components/`.
- Typed `Props` — no `any`.

## Hard rules (from CLAUDE.md)

- **No DB imports.** A component must NEVER import from `@/lib/models/*` or `@/lib/db`.
- **No direct `fetch` to internal API in JSX.** If the component needs data, call a hook in `src/hooks/` or a helper in `src/lib/api/`. If neither exists, create one.
- **No hardcoded site/contact strings.** Import from `@/lib/site` (`siteConfig`).
- **No hardcoded marketing copy.** Use `src/config/content.ts` (or extend it).
- **No hardcoded nav.** Use `src/config/navigation.ts`.

## Stack primitives to prefer

| Need | Use |
|---|---|
| Animation | `framer-motion` (already in use in `Landing`, `About`) |
| Modal / Dialog | `@headlessui/react` `Dialog` (see `ProjectModal.tsx`) |
| Icons | `lucide-react` |
| Toasts | `react-toastify` (configure once in layout if not already) |
| Smooth scroll nav | `react-scroll` `Link` |
| Forms | Plain controlled inputs + a hook in `src/hooks/` (see `useContactFormSubmission`) |

## Checklist

- [ ] File location matches the table above.
- [ ] `"use client"` directive present if the component uses state/effects/handlers.
- [ ] Default export, typed `Props`.
- [ ] No `@/lib/models/*` or `@/lib/db` imports.
- [ ] No direct internal-API `fetch` in JSX — uses hook or `src/lib/api/` helper.
- [ ] Tailwind classes for styling; no separate `.css` file unless extending `globals.css`.
- [ ] Site/contact strings via `siteConfig`.
- [ ] Marketing copy via `src/config/content.ts`.
- [ ] If admin-only, wrapped or imported inside a `<ProtectedRoute>` boundary.
- [ ] Imported in the right place: page (`app/<route>/page.tsx`), parent component, or layout.
- [ ] Domain manifest in `CLAUDE.md` updated if the file is in a new path glob.

## Anti-patterns

- ❌ `import User from "@/lib/models/User"` inside a component.
- ❌ `await fetch("/api/projects")` in a `useEffect` — extract to a hook.
- ❌ `<h1>Derem Joshua Rivera</h1>` — use `siteConfig.name`.
- ❌ Inline `<style jsx>` blocks. Use Tailwind.
- ❌ New animation library when `framer-motion` is already imported elsewhere.
- ❌ Default export named `Component` — name it after the file.

## Verification

After creating:
```bash
npx tsc --noEmit
npm run dev
```
Then load the page that imports it and visually verify.
