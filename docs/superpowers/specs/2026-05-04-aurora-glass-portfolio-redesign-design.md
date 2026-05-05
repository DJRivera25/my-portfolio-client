# Aurora Glass — Portfolio redesign design

**Date:** 2026-05-04
**Branch:** `revised/portfolio`
**Status:** Approved by user, ready for implementation plan

## Goal

Make the portfolio at `c:\Codes\my-portfolio-client` feel **futuristic and AI-era** through design quality, while keeping the existing positioning of *fullstack engineer* intact. The site must visibly signal "this person operates at the frontier" without leaning on explicit "AI" badges, slogans, or marketing-y labels.

## Positioning (anchor for every decision)

DJ is positioned as a **fullstack engineer who uses AI as a force multiplier** — not as an AI specialist, AI consultant, or LLM product builder. The site serves two audiences in roughly equal weight:

- **Hiring managers / recruiters** (full-time roles)
- **Freelance / contract clients** (project-based work)

Copy and CTAs are written so neither audience feels secondary. The thesis underlying all messaging: *"a developer who uses AI well delivers more value."* That thesis is communicated through one sentence in About, one sentence in a new "How I ship" section, and one labeled "AI Workflow" category in Tools — three quiet touchpoints, no hero theatrics.

## Visual language — Aurora Glass

A dark, premium aesthetic that evolves the existing navy + yellow brand by adding a cyan ambient accent, glass-card surfaces, faint grid overlays, and subtle aurora glows. The futuristic feel comes from atmosphere and polish, not from labels.

### Design tokens

| Role | Token | Value | Notes |
|---|---|---|---|
| Base | `brand.navy` | `#0a0f29` | Kept from existing palette |
| Elevated surface | `brand.navy-mid` | `#1a1f3a` | Kept |
| Glass surface | `surface.glass` | `rgba(255,255,255,0.04)` + 12px backdrop-blur | New — card material |
| Hairline | `border.hairline` | `rgba(255,255,255,0.08)` | New — card edges |
| Action | `accent.yellow` | `#FFD600` | Kept — every primary CTA |
| Ambient signal | `accent.cyan` | `#00E0FF` | New — used **only** for ambient glows, dot indicators, hover edges. Never bulk text. |
| Ambient secondary | `accent.violet` | `#8A6DFF` | New — optional second halo for depth |

### Typography

Swap from `Montserrat` to **Geist Sans** (with **Geist Mono** for accents). Geist is built into Next.js, used by Vercel/Linear, and is the de-facto "frontier product" sans. This swap does most of the futuristic lift for free.

**Type scale:**
- Display (hero H1): `clamp(40px, 7vw, 84px)`, weight 700, tracking `-0.03em`
- Section heading: 32–40px, weight 700, tracking `-0.02em`
- Eyebrow label: 11px, weight 500, uppercase, tracking `0.18em`, opacity 0.6
- Body: 16–18px, line-height 1.6

### Reusable primitives (all under `src/components/ui/`)

- **`<AuroraBackdrop>`** — positioned ambient glow + faint grid overlay; accepts `tint` prop (e.g. `yellow-cyan`, `cyan-violet`). One per section, configurable color blend.
- **`<GlassCard>`** — rounded-2xl glass surface with hairline border; optional `hoverLift` prop adds 200ms lift + cyan edge glow.
- **`<EyebrowLabel>`** — small uppercase tracking label with optional pulsing cyan dot.
- **`<GradientText>`** — punch-word wrapper (yellow→white or cyan→white gradient).
- **`<SectionHeader>`** — eyebrow + heading + subhead block, used by every section for consistency.

### Motion principles

- Entrance: 600–800ms fade + 20px y-translate, staggered children
- Aurora drift: 40–60s loop (very slow, ambient)
- Hover: 200ms lift + cyan edge glow on cards
- All wrapped in `useReducedMotion` (already in the codebase) — accessibility preserved

## Section blueprint

### Landing (rewrite)

- `<AuroraBackdrop tint="yellow-cyan">` with faint grid
- Eyebrow with pulsing cyan dot: *"● Available — open to roles & projects"*
- H1: **`Ship more. Ship better. Faster.`** (where `Faster.` is the yellow gradient punch word)
- Subhead: *"Fullstack engineer — APIs, data, and interfaces built end to end, designed to scale with the team maintaining them."*
- Two CTAs side-by-side:
  - Primary: `Start a project →` (yellow, scrolls to contact)
  - Secondary: `View work` (glass, scrolls to projects)
- Stack chip line at bottom: *TypeScript · Next.js · Node · Postgres · MongoDB*

**Removed:** the existing `landing-image.png`, the 2-column teaser-card layout, the "About me" / "View work" duplicate cards in the hero. The backdrop + cleaner hero replaces them.

### About (rewrite)

- `<AuroraBackdrop tint="cyan-violet">` (cyan-leaning)
- `<SectionHeader>`: eyebrow `About`, H2 *"Built for the long maintenance window."*
- Two-column: left = 2 paragraphs, right = 3 `<GlassCard>` principles
  - **¶1:** *"I'm Derem Joshua Rivera — a fullstack engineer who likes owning features end to end. I think in systems: constraints, trade-offs, and what 'done' looks like for the people who'll maintain the code six months from now."*
  - **¶2 (carries AI mention #1):** *"I lean on a modern toolchain — including AI in the loop — to ship faster without giving up the boring qualities that make code last: clear boundaries, predictable APIs, accessible UI, and documentation the next person can actually use."*
  - **Principle 1:** *Architecture first* — *"Models, contracts, and trade-offs decided up front. Less rework later."*
  - **Principle 2:** *Ship and iterate* — *"Small, reversible deploys beat heroic launches every time."*
  - **Principle 3:** *Documented to hand off* — *"If the next dev can't move fast, I haven't shipped yet."*

### How I ship (NEW section, between About and Projects)

- `<AuroraBackdrop tint="yellow-cyan">`
- `<SectionHeader>`: eyebrow `Process`, H2 *"How I ship"*, subhead *"A workflow tuned for speed and durability."*
- Three numbered `<GlassCard>` in a row (stacks on mobile):
  - **1 · Architect** — *"Break the problem down, model the data, define the contracts. Decisions get written down in plain language so the next dev moves fast."*
  - **2 · Build (carries AI mention #2)** — *"Type-safe, tested code with a modern toolchain. I pair with AI to ship more in less time, without cutting quality."*
  - **3 · Ship & iterate** — *"Deploy, monitor, refine. Boring is a feature."*

This is the natural home for the AI-as-multiplier story — one sentence in step 2 carries the entire "AI-amplified" message, in context, where it belongs.

### Projects (visual refresh; data layer unchanged)

- `<SectionHeader>`: eyebrow `Selected work`, H2 *"Projects"*, subhead *"Context, stack, and what shipped."*
- Project grid: each card wrapped in `<GlassCard hoverLift>` showing image, title, 1-line description, tech chips, "View project →" link
- **No filter pills in v1** (current project list isn't varied enough to warrant them); revisit if categories diversify later
- Hover: cyan edge glow + slight lift

### Tools (restructured)

- `<SectionHeader>`: eyebrow `Stack`, H2 *"Tools & technologies"*, subhead *"What I reach for across backend, frontend, data, and shipping."*
- Tools grouped into **5 categories**:
  1. **Languages** — TypeScript, JavaScript, etc.
  2. **Frameworks** — Next.js, React, Tailwind, Laravel, Vue, etc.
  3. **Data** — Postgres, MongoDB, Redis, etc.
  4. **DevOps** — Vercel, Docker, GitHub Actions, etc.
  5. **AI Workflow** — Claude Code, Cursor, Copilot, ChatGPT *(third quiet AI touchpoint, in context as one category among others)*
- Each tool: small chip with logo + name; hover reveals quick label

### Contact (visual refresh)

- `<AuroraBackdrop tint="cyan-violet">`
- `<SectionHeader>`: eyebrow `Contact`, H2 *"Let's build something."*, subhead *"Hiring, collaboration, or a product idea — send a note. I usually reply within 2 business days."*
- Two-column: left = short pitch + socials + email link, right = form in `<GlassCard>`

### Footer (polish only)

- Glass-edge top border, ambient cyan halo
- Tagline: *"Fullstack engineer · shipping the boring qualities that make products last."*

### Navbar (polish only)

- Glass treatment (subtle backdrop-blur, hairline bottom border on scroll)
- Add `Process` nav item linking to the new `how-i-ship` anchor
- Existing scroll behavior preserved

## Modals — full redesign

All five modals get the full Aurora Glass treatment, not just a token swap. Each gets:
- Backdrop: `rgba(0, 0, 0, 0.6)` + 8px blur on the page behind
- Modal surface: `<GlassCard>` shell (rounded-2xl, glass bg, hairline border)
- Subtle ambient glow inside the modal (`tint="cyan-violet"`)
- Geist typography
- Yellow primary actions, glass secondary actions
- Close button: glass icon button with cyan hover edge

**Modals in scope:**
- `ProjectModal.tsx` — public-facing project detail
- `ResumeModal.tsx` — resume preview
- `SocialModal.tsx` — admin (CRUD)
- `ToolModal.tsx` — admin (CRUD)
- `GetInTouchModal.tsx` — public contact entry point
- `ContactMessageForm.tsx` — form component used inside contact contexts

Modal *behavior* (open/close, form submission, validation) is **not changed** — only the visual shell. Admin modals get the same shell so the design system stays consistent across the codebase.

## File structure & touch surface

### New files (~6)
- `src/components/ui/AuroraBackdrop.tsx`
- `src/components/ui/GlassCard.tsx`
- `src/components/ui/EyebrowLabel.tsx`
- `src/components/ui/GradientText.tsx`
- `src/components/ui/SectionHeader.tsx`
- `src/components/HowIShip.tsx`

### Rewrites (~10)
- `src/components/Landing.tsx`
- `src/components/About.tsx`
- `src/components/Projects.tsx` (card layer)
- `src/components/Tools.tsx` (category grouping)
- `src/components/Contact.tsx`
- `src/components/ProjectModal.tsx`
- `src/components/ResumeModal.tsx`
- `src/components/SocialModal.tsx`
- `src/components/ToolModal.tsx`
- `src/components/GetInTouchModal.tsx`

### Polish-only edits (~6)
- `src/components/Navbar.tsx` — glass treatment + new nav item
- `src/components/Footer.tsx` — glass-edge polish
- `src/components/ContactMessageForm.tsx` — input/button restyle
- `src/config/content.ts` — full copy rewrite per blueprint
- `src/config/toolCategories.ts` — restructure into 5 categories
- `src/config/navigation.ts` — add `process` / `how-i-ship` anchor

### Theme & infra
- `tailwind.config.js` — add cyan/violet/glass/hairline tokens + type scale
- `src/index.css` — aurora drift keyframes, helper utilities
- `app/layout.tsx` — swap `Montserrat` → `Geist Sans` (+ `Geist Mono`)
- `app/page.tsx` — include `<HowIShip />` between `<About />` and `<Projects />`
- `package.json` — add `geist` dependency (official Vercel font package, small, Next.js-native)

## Out of scope (deliberately)

- API routes (`app/api/**`) — no functional changes
- Mongoose models (`lib/models/**`) — no schema changes
- Server libraries (`lib/auth.ts`, `lib/db.ts`, `lib/cloudinary.ts`, `lib/site.ts`) — untouched
- Auth flow / `AuthContext` — untouched
- Admin pages (`app/inbox/**`, `app/login/**`) — page-level layouts not redesigned (only the modals they use)
- Resume upload pipeline — untouched
- Modal *behavior* (open/close, validation, submission) — untouched

## Success criteria

- A first-time visitor lands on the page and reads it as **futuristic, polished, premium** without seeing any "AI" badge or label in the hero
- Both a hiring manager and a freelance client can see themselves as the intended audience after reading the hero + About
- The AI-as-multiplier story is communicated by **3 quiet touchpoints** (About ¶2, How I ship step 2, Tools "AI Workflow" category) — no more, no less
- Every section uses the same design system primitives (`AuroraBackdrop`, `GlassCard`, `EyebrowLabel`, `SectionHeader`) — no one-off styling
- All existing functionality (project CRUD, contact form submission, resume modal, admin flows) continues to work without behavioral change
- Reduced-motion users get a calm, accessible experience (no aurora drift, no hover lifts)
- Type-check passes (`npx tsc --noEmit`) and the production build succeeds (`npm run build`)

## Risks & mitigations

- **Risk:** Geist font swap changes line lengths and section heights everywhere → **Mitigation:** the design system primitives standardize spacing and type, so layout reflows are predictable; visual QA pass per section after the swap.
- **Risk:** Removing the landing-image leaves the hero feeling visually thin → **Mitigation:** the `<AuroraBackdrop>` plus large display typography plus stack chips give the hero enough visual weight; if it still feels thin in QA, add a subtle generative-feeling SVG or animated mesh as a hero decoration.
- **Risk:** Glass effects (`backdrop-blur`) have inconsistent support on older browsers → **Mitigation:** the design degrades gracefully — without blur, cards still read as semi-transparent surfaces with a hairline border.
- **Risk:** Modal redesigns touch admin-only modals that may not need this polish → **Mitigation:** keeping the design system consistent across admin and public surfaces is worth the small extra cost; behavior is unchanged so risk of regression is low.
