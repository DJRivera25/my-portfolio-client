# Projects section redesign — Device Duo

**Date:** 2026-05-04
**Status:** Approved, implementing
**Branch:** `revised/portfolio`

## Problem

The current `Projects` section is a generic 2-column image-on-top card grid. Every card has the same visual weight, projects (which are *websites*) aren't framed as websites, and there is no metadata beyond title + description. On desktop the layout feels thick and undifferentiated; on mobile it works but says nothing memorable.

## Decision

Rebuild the section around three approved choices:

1. **Direction E — Device Duo.** Each project is rendered as a desktop browser frame (traffic lights + URL bar + screenshot) with a small phone frame overlapping the corner. Familiar from Stripe/Linear/Vercel; communicates "production, responsive" without saying it.
2. **Tier 2 metadata.** Add three optional fields to the Project model — `tags: string[]`, `year: number`, `role: string` — plus an optional `mobileImage` for the phone overlay. These give recruiter-scannable substance (year · role · tech chips) without forcing per-project case-study prose.
3. **Mobile reflow Option 1.** Below the `md` breakpoint the phone overlay hides; each project becomes a full-width browser-framed card with the meta line, chips, title, and description stacked below.

## Architecture

### New components — `src/components/projects/`

- **`BrowserFrame.tsx`** — Reusable browser chrome. Props: `{ url: string; image: string; alt: string; autoScrollOnHover?: boolean }`. Traffic lights, URL pill with lock icon, screenshot fills the body. When `autoScrollOnHover`, the screenshot pans `object-position: top → bottom` over ~3s on hover.
- **`PhoneFrame.tsx`** — Small phone-shaped frame (~90px wide on desktop). Props: `{ image: string; alt: string; side?: "left" | "right" }`. Renders only when an image is provided.
- **`ProjectCard.tsx`** — One Device Duo row. Composes `BrowserFrame` + optional `PhoneFrame` + meta strip + title + description + tag chips. Variant prop for `featured`. Handles admin controls (star/edit/delete) when `isAdmin`.
- **`ProjectsList.tsx`** — Wraps the framer-motion stagger container, maps the project array → `ProjectCard`. Handles featured-first ordering and the alternating left/right (`flip`) row pattern on desktop.

### Existing — `src/components/Projects.tsx`

Keeps the section chrome (heading, eyebrow, admin "Add project" / "Upload resume" buttons, `ResumeSection` at the bottom, modal wiring). Delegates the rendering loop to `ProjectsList`. Net result: file shrinks materially.

## Data model

### `lib/models/Project.ts`

```ts
{
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },     // desktop screenshot
  link: { type: String, required: true },
  featured: { type: Boolean, default: false },
  // new — all optional
  tags: { type: [String], default: [] },
  year: { type: Number },
  role: { type: String },
  mobileImage: { type: String },                 // optional phone screenshot
}
```

All new fields are optional so existing project documents continue to render.

### `src/types/portfolio.ts`

```ts
export interface Project {
  _id: string;
  title: string;
  description: string;
  link: string;
  image: string;
  featured?: boolean;
  tags?: string[];
  year?: number;
  role?: string;
  mobileImage?: string;
}
```

## API surface

`app/api/projects/route.ts` — `POST` (multipart): accept additional form fields `tags` (JSON-encoded array, optional), `year` (string→number, optional), `role` (optional), and a second optional file field `mobileImage`. Upload `mobileImage` to Cloudinary the same way as `image`. Persist all fields.

`app/api/projects/[id]/route.ts` — `PUT` (multipart): same additional fields; only set on the document if present in the form. `mobileImage` upload is conditional on a new file being attached.

Both already have `isAuthorizedAdmin` checks — keep them.

## Admin form — `src/components/ProjectModal.tsx`

Three new optional inputs:

- **Tags** — chip-style editor. Type a tag, press Enter or comma to add; click an existing chip to remove. Stored locally as `string[]`, sent as JSON-encoded form field.
- **Year** — `<input type="number">`.
- **Role** — `<input type="text">`.
- **Mobile image** — second file input, optional. Preview thumbnail next to it. When omitted on edit, the existing `mobileImage` is preserved.

Existing inputs (title, description, link, image) untouched.

## Visual & motion

- Reuse existing tokens: `bg-brand-navy`, `accent` (yellow), `accent-cyan`, `surface-glass`, `hairline`, `shadow-glass-lift`. No new colors.
- Reuse `AuroraBackdrop` and `GlassCard` (only as wrappers where appropriate).
- Card lift on hover (existing pattern). Browser screenshot auto-scrolls inside its frame on hover via `object-position` transition.
- Stagger entry preserved from current implementation.
- Featured row: `Featured` pill, larger desktop browser, uncapped description, slightly more vertical padding. Otherwise identical to a normal row.
- Alternating `flip` so consecutive non-featured rows mirror each other. Featured is always row 1.

## Mobile (≤ md)

- `PhoneFrame` hidden via `hidden md:block`.
- `BrowserFrame` is full width; description is *not* line-clamped.
- Tag chips wrap below.
- Admin buttons remain pinned to the card top-right.

## Out of scope (deferred)

- Filtering / categorization by tag.
- A deep case-study modal.
- The `outcome` metric field (Tier 3).
- Live iframe previews (Direction F).
- Migrating raw `<img>` to Next `<Image>` — preserve current pattern for now to keep blast radius small.

## Test plan

- Type-check (`npx tsc --noEmit`) clean.
- `npm run build` clean.
- Manual UI verification deferred to DJ (no automated UI tests in this repo).

## Files touched

```
lib/models/Project.ts                            modify
src/types/portfolio.ts                           modify
app/api/projects/route.ts                        modify (POST)
app/api/projects/[id]/route.ts                   modify (PUT)
src/components/ProjectModal.tsx                  modify
src/components/Projects.tsx                      modify (slim down)
src/components/projects/BrowserFrame.tsx         new
src/components/projects/PhoneFrame.tsx           new
src/components/projects/ProjectCard.tsx          new
src/components/projects/ProjectsList.tsx         new
CLAUDE.md                                         modify (Domain Manifest)
```
