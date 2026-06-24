# Handoff: Derem Joshua Rivera — Senior Full-Stack Portfolio ("The Build Log")

## Overview
A single-page personal portfolio for **Derem Joshua Rivera ("DJ")**, a full-stack developer (and licensed civil engineer). The site is designed to read at a senior level through restraint and craft, and to make browsing projects feel cinematic rather than a plain scroll. It contains: Hero, Selected Work (with four browse modes), About, Stack, How-I-Ship process, Résumé, and Contact.

The visual language is documented as a standalone design system ("Atelier") — see `Design System.dc.html`.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes that show the intended look, motion, and behavior. They are **not production code to copy directly**. They are authored in a lightweight in-house templating runtime (`.dc.html` = template + a `Component` logic class), so do not lift the markup verbatim.

The task is to **recreate these designs in the target codebase's environment**. This portfolio originated from a **React + Next.js (TypeScript)** app, so React/Next with CSS Modules, Tailwind, or styled-components is the natural target — but use whatever the destination project already uses. If starting fresh, React + Next.js + Tailwind is recommended. Re-implement using the destination's own component and styling patterns.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, layout, and interactions are all specified below and in the files. Recreate pixel-faithfully, then adapt to the codebase's conventions. Exact hex values, the type scale, and motion timings are all listed under **Design Tokens**.

---

## Screens / Views
This is a single scrolling page with a fixed top nav (desktop) and a floating bottom nav (mobile). Sections in order:

### 1. Nav (fixed, top)
- **Layout:** max-width 1320px, space-between. Left: circular **color avatar** (your photo) in a 36px gold-ringed circle + `DJR` monogram (mono). Center (desktop only): links — Work, About, Stack, Process, Résumé, Contact. Right: green "● AVAILABLE" status + a `⌘K` button.
- **Mobile (≤880px):** center links hidden; a floating pill **bottom nav** appears instead (Home · Work · Ship · Hire), Hire in solid gold.

### 2. Hero
- **Layout:** 2-col grid `1.15fr / 0.85fr`, min-height ~100vh. Stacks to 1 col ≤880px.
- **Left:** eyebrow `DEREM JOSHUA RIVERA — "DJ"` with a 44px gold rule; headline in Space Grotesk 600 `clamp(46–92px)` — "Full-stack / developer & / **system builder.**" (last line Instrument Serif italic, gold). Intro paragraph; primary "Get in touch →" (magnetic) + ghost "View selected work".
- **Right:** a faux terminal window (`~/dj/stack.ts`) that **types itself out** line by line (whoami → a `const stack = {…}` object), blinking gold caret, spinner. Below: 4 mono chips (TypeScript, REST APIs, CI/CD, Responsive).
- **Below hero:** an **infinite marquee** of tech names (Instrument Serif italic, seamless loop), then a scroll cue + live clock.
- **Effects:** a gold radial **cursor-glow** follows the pointer (lerped); film-grain overlay; faint 72px grid. Cursor glow disabled on touch.

### 3. Selected Work — "The build log" (the centerpiece)
Four browse modes over the same 3 projects:
- **Cinematic track (default):** horizontal, `scroll-snap` reel. Each scene = `clamp(440–820px)` wide image card with a big serif number, year, kind, title, tagline, stack chips, "Open case study →". Drag, wheel-to-scroll, ← →, and prev/next buttons. A **progress bar + `0X / 03` counter** track position.
- **Index grid:** toggle to a calm 3-up card grid of the same projects.
- **Case-study drawer:** clicking a project slides in a right-side drawer (`min(980px,100%)`) over a blurred backdrop — hero image, "● LIVE PROJECT" badge, italic tagline, 3 **highlight cards** (check icon), then Problem / What I built / Role / Stack. Has its own **prev/next project nav + counter** and arrow-key support.
- **Command palette (⌘K):** centered overlay to jump to any section or open any case study. `Esc` closes.

### 4. About
- 2-col `0.82fr / 1.18fr`. Left: your **color cut-out photo** floating on a warm gold-lit radial backdrop (aspect 4/5, gold offset frame, a "THE PERSON BEHIND THE WORK" caption + an "est. engineering → web" tag). Right: `01 — ABOUT` eyebrow, serif headline ("Engineering background. **Builder's** instinct."), two paragraphs, and a 3-up facts row (Focus / Stack / Based).

### 5. Stack — "Tools of the trade"
- `03 — THE STACK`. Three group cards (Frontend / Backend / Data & Cloud), each a 2-col grid of **logo tiles**: 56px white rounded chip with the tech logo, name, and a short descriptor. Tiles lift + gold-border on hover. Group grid is 3-up desktop → 2-up ≤1024px → 1-up ≤880px.

### 6. How I Ship — process pipeline
- `04 — HOW I SHIP`. A **step/progress header** (`STEP 0X / 05 · {stage}` + fill bar). Then 5 connected stage cards (Discover & scope → Design the system → Build in increments → Ship to production → Support & iterate). Each card: serif number, status pill (QUEUED / PROCESSING / DONE), a timeframe chip, title, description, and a `↳ deliverable` footer. **Gold pulse flows through the connectors**; the active card lifts. Auto-advances every ~2.1s.
- Below: a live **build console** (`~/dj/ship.log`) rendering all 5 log lines at constant height — pending lines dim, then brighten (→ flips to ✓) as the pipeline advances. **No layout shift.**
- **Mobile (≤880px):** becomes a vertical timeline with a downward-flowing connector.

### 7. Résumé — "The full record"
- `05 — RÉSUMÉ` + a gold **Download PDF** button (links to `assets/Derem-Joshua-Rivera-Resume.pdf`, `download` attribute).
- A **letter-proportioned paper sheet** (max-width 816px, min-height 1056px) inset into the dark page — palette **inverted to warm paper** (#FCFBF7 on #161510 ink). Two faint **stacked sheets** behind it suggest a physical document (hidden on mobile). 6px gold top bar.
- Inside: name + title + contact (right-aligned), summary, then a `1.55fr / 1fr` grid — left = Experience (vertical **timeline** with gold dots) + Education; right = Core Competencies (grouped chips) + Certificates & Eligibility. Stacks to 1 col ≤880px.

### 8. Contact — "Let's build something good."
- `06 — CONTACT`. 2-col `1fr / 1.05fr`. Left: green **availability pill**, headline, paragraph, **icon contact cards** (Email, Phone — gold icon tile, slide-right on hover), and a **social row** (Facebook / Instagram / LinkedIn brand glyphs + a JobStreet pill). Right: a **form card** ("DROP A LINE", name+email in a 2-col row that stacks on mobile, subject, message, gold "Send message →", "● Replies within 24h"). Submitting swaps to a "Message noted." success state (design preview — nothing is actually sent).

### 9. Footer
- Small gold dot + "Derem Joshua Rivera — Full-Stack Developer", "© 2026 · BUILT FROM SCRATCH", and a "BACK TO TOP ↑" button.

---

## Interactions & Behavior
- **Cursor glow:** radial gold gradient, position lerped toward pointer at 0.12/frame via rAF. Hidden on `(hover:none)`.
- **Magnetic CTA:** "Get in touch" translates toward the cursor (×0.3/0.4) + scales 1.04 on hover.
- **Typed terminal (hero) & build log (process):** char-by-char reveal with a blinking caret.
- **Marquee:** CSS `@keyframes marquee` translateX 0 → −50% over ~38s, list duplicated for a seamless loop.
- **Work track:** wheel maps deltaY→scrollLeft; pointer drag to pan (suppresses click if moved); snap-align center; progress bar + counter update on scroll; ← → and prev/next buttons.
- **Case drawer:** opens on card click; `drawerIn` slide + `fadeIn` backdrop; prev/next cycles projects (also ← →); `Esc` / backdrop / Close button dismiss.
- **Command palette:** `⌘K` / `Ctrl+K` toggles; items scroll to a section or open a case; `Esc` closes.
- **Process pipeline:** `setInterval` ~2100ms advances `procStage` (mod 5); connectors/cards/log derive from it.
- **Contact form:** `onSubmit` preventDefault → `sent` state → success panel; "Send another" resets.
- **Responsive:** breakpoints at **1024 / 880 / 560 / 380px** + `(hover:none)`. Padding tightens 48→22→16→13px; sections densify; social row & case header `flex-wrap`; mobile bottom nav width-capped. No horizontal overflow down to 320px.

## State Management
- `clock` — live HH:MM string (hero footer).
- `mode` — `'track' | 'reel'` (Work browse mode).
- `caseIdx` — `null` or project index (case drawer open + which).
- `paletteOpen` — boolean (⌘K palette).
- `counter` — `'0X'` derived from track scroll position.
- `procStage` — 0–4 (process pipeline / build log).
- `sent` — boolean (contact form success).
- Project data, stack groups, process stages, résumé data, and palette items are static arrays in the component logic.

## Design Tokens

**Colors (dark site)**
- Ink / base: `#0A0A0B` (page), `#0C0C0E`, surfaces `#121214`, `#141416`, raised `#1C1C20`
- Text: paper `#F2EFE8` / `#ECEAE3`, muted `#A39F96` / `#A7A39B`, faint `#6E6A62`
- Accent (gold): `#E0A53D` (primary), `#C9952E` (deep)
- Success/green: `#7FB996` / `#79B791`
- Hairlines: `rgba(255,255,255,0.07–0.12)`

**Colors (résumé paper — inverted)**
- Paper `#FCFBF7`, ink `#161510`, body `#3F3B33` / `#4A463E`, muted `#6B665B` / `#807A6E`, gold-on-paper `#9A6A14`, stacked sheets `#ECE6D8` / `#DAD3C2`

**Typography**
- Display/serif: **Instrument Serif** (400, italic for emphasis) — headlines, numerals, pull quotes
- Interface/body: **Space Grotesk** (300–700) — UI, paragraphs, buttons
- Signal/code: **JetBrains Mono** (400–600) — labels, metadata, code, the terminals
- Type scale (1.25): display 60 · h1 38 · h2 28 · body-lg 18 · body 15 · mono 13. Slide/large headlines use `clamp()`.

**Spacing (8pt):** 8 · 16 · 24 · 40 · 64 · 96. Section vertical padding ~96px desktop, tightening on mobile.

**Radii:** 2px (sm) · 4px (md) · 7–14px (cards/buttons) · 999px (pills/avatars). Tight by intent.

**Shadows:** soft, dark — e.g. card `0 40px 100px -40px rgba(0,0,0,0.8)`; résumé sheet `0 50px 110px -40px rgba(0,0,0,0.8)`.

**Motion:** micro 180ms ease-out · reveal 450ms `cubic-bezier(.2,.7,.3,1)` · scene 800ms `cubic-bezier(.65,0,.35,1)`. Keyframes: `marquee`, `travel`/`travelV` (connector flow), `pulseRing`, `blink`, `floatUp`, `fadeIn`, `drawerIn`, `shimmer`, `spinSlow`.

## Assets
All under `assets/` in this bundle:
- `my-photo.png` — color portrait (used in nav avatar)
- `about-image.png` — color cut-out portrait (About section)
- `portrait-duotone.png` — duotone treatment (no longer used; reference only)
- Project images: `tiket-lakwatsero.png`, `ecommerce.png`, `mockup.png`
- Tech logos: `logos/` (react, vue, nextjs, laravel, php, nodejs, mongodb, mysql, aws, tailwind, javascript, git)
- `Derem-Joshua-Rivera-Resume.pdf` — downloadable résumé
- Social icons (Facebook, Instagram, LinkedIn, JobStreet) are **inline SVG** in the markup, not files.
- Fonts load from Google Fonts (Instrument Serif, Space Grotesk, JetBrains Mono).

## Files
- `Portfolio.dc.html` — the full portfolio (all sections + logic). Primary reference.
- `Design System.dc.html` — the "Atelier" design-system documentation (tokens, type, components, motion, voice, patterns).
- `assets/` — all images, logos, and the résumé PDF.

> Note: `.dc.html` files are template + a `class Component` logic block in a custom runtime. Read them for structure, copy, exact values, and behavior — then re-implement in your framework. Open them in a browser to see the live prototype.
