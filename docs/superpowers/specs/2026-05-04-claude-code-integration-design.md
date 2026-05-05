# Claude Code Integration & Layered Restructure — Design Spec

**Date:** 2026-05-04
**Project:** `my-portfolio-client`
**Reference project:** `c:/Codes/ToolsAustralia` (sophisticated Claude Code setup, used as the model)
**Scope:** This spec covers C2 (consolidate file layout to a single `src/` root) + D2 personalized (CLAUDE.md, Domain Manifest, hooks, subagents, slash commands, code-generated resume, brand-voice reviewer). C3 (full layered rewrite — extract services from route handlers, etc.) is intentionally **out of scope** and will get its own spec next.

---

## 1. Goals

1. Make `my-portfolio-client` first-class for Claude Code: a `CLAUDE.md` that documents the architecture, hard rules enforced by hooks, and a machine-readable Domain Manifest that drives doc-sync.
2. Consolidate the current dual `/app` + `/lib` + `/src` layout into a single `src/` root with clear layers (matches ToolsAustralia's pattern).
3. Personalize Claude Code tooling to a portfolio context: subagents and slash commands tailored to adding/editing portfolio content (projects, tools, profile, contact triage), not Stripe/billing/draws.
4. Replace the existing PDF-blob resume (Mongo `Resume` model + `/api/resume(s)` endpoints + `ResumeModal`) with a **code-generated** resume sourced from `src/data/profile/`, exported via browser print (R1 — print stylesheet, zero deps).
5. Introduce a `voice-personality-reviewer` subagent that holds new copy to a baseline established in `src/data/profile/voice.ts` so portfolio content stays on-brand.

## 2. Non-goals

- Extracting business logic from API route handlers into `src/services/<domain>/` (deferred to C3 spec).
- Adding repositories, advanced validation (Zod), or a test runner (flagged as gaps in CLAUDE.md, not addressed here).
- Rewriting authentication, switching DB, or restructuring data models beyond what the file moves require.
- CSP nonce middleware, A/B testing infrastructure, cron jobs, multi-tenancy — none apply to a portfolio.
- Cursor `.cursor/` setup. Claude Code only for this spec.

---

## 3. Architecture (post-C2)

Single source root at `src/`. No `repositories/` (overkill for simple CRUD); `services/` is opt-in and used only when a route handler isn't enough (e.g., multi-step flows like "send transactional email + log to DB").

```
src/
  app/                  Next.js App Router (routes + layouts + API handlers)
                        — moved here from /app
    api/                Route handlers — thin: parse, validate, authorize, delegate
  components/           UI only, organized by domain subfolder
    projects/           ProjectModal, ProjectCard, ProjectsGrid, …
    tools/              ToolModal, ToolCard, ToolsGrid, …
    contact/            ContactMessageForm, GetInTouchModal, ContactSection
    layout/             Navbar, Footer
    landing/            Landing, About
    resume/             ResumeView, ResumeHeader, ExperienceSection, SkillsGrid, …
    ui/                 Shared primitives (Button, Modal, Input)
  hooks/                Reusable stateful logic (useContactFormSubmission, …)
  context/              React contexts (AuthContext)
  lib/                  Cross-cutting infra — moved here from /lib
    db.ts               Mongoose connection
    auth.ts             Auth helpers
    cloudinary.ts       Cloudinary client (server-only)
    email.ts            Nodemailer wrapper
    api/                Client-side API call helpers
  models/               Mongoose schemas, one per file — moved here from /lib/models
  services/             Business logic — only when route handler isn't enough
                        (currently empty — created on demand by C3 work)
  utils/                Pure utilities organized by domain
  data/
    profile/            Single source of truth for "who you are" — Phase 4
      bio.ts            short / medium / long bios
      experience.ts     work history (structured)
      skills.ts         skill matrix (incl. AI tools)
      achievements.ts   notable wins (quantified)
      contact.ts        contact details (separable for redacted PDF)
      voice.ts          tone guide for voice-personality-reviewer
      index.ts          re-exports a typed `profile` object
  types/                Shared TS types
  config/               Site-wide config + constants
  middleware.ts         Auth gating
  index.css             Global styles (already here)
```

### 3.1 Layering rules (will appear as hard rules in CLAUDE.md)

- API handlers in `src/app/api/**` are thin: `parse → validate → authorize → call service or model → respond`.
- No DB access from `components/`.
- No business logic in `components/` JSX.
- Model files = Mongoose schema only, no business logic.
- `services/` is opt-in — trivial CRUD endpoints can call models directly.
- Dependency direction: `app → services → lib/models`. Never the reverse.
- Return consistent JSON response shapes. Match siblings in the same `/api/<domain>/` folder before inventing a new shape.
- `cloudinary.ts` and `email.ts` are **server-only** — never import them from `components/`, `hooks/`, or `context/`.

---

## 4. Domain Manifest

Eleven domains. Same machine-readable JSON format as ToolsAustralia, sitting in a `<!-- DOMAIN-MANIFEST-START -->` block at the bottom of `CLAUDE.md`. Both Claude and the `doc-sync.mjs` hook read it.

| Domain | What it owns | Key paths (representative) |
|---|---|---|
| **projects** | Projects showcase CRUD | `src/app/api/projects/**`, `src/models/Project.ts`, `src/components/projects/**`, `src/app/projects/**` |
| **tools** | Tools showcase CRUD | `src/app/api/tools/**`, `src/models/Tool.ts`, `src/components/tools/**` |
| **resume** | Code-generated resume + PDF export | `src/app/resume/**`, `src/components/resume/**` |
| **profile** | Single source of truth for personal brand data | `src/data/profile/**`, `docs/profile/**` |
| **socials** | Social links | `src/app/api/socials/**`, `src/models/Social.ts`, `src/components/SocialModal.tsx` |
| **messages** | Contact form + admin inbox | `src/app/api/messages/**`, `src/models/Message.ts`, `src/components/contact/**`, `src/app/contact/**`, `src/app/inbox/**`, `src/hooks/useContactFormSubmission.ts` |
| **auth-users** | Login, auth context, user CRUD | `src/app/api/auth/**`, `src/app/api/users/**`, `src/lib/auth.ts`, `src/models/User.ts`, `src/context/AuthContext.tsx`, `src/components/ProtectedRoute.tsx`, `src/app/login/**` |
| **upload-media** | Cloudinary uploads | `src/app/api/upload/**`, `src/lib/cloudinary.ts`, `src/utils/images/**` |
| **landing-about** | Public marketing surfaces | `src/components/landing/**`, `src/components/layout/**`, `src/app/page.tsx`, `src/app/about/**`, `src/app/not-found.tsx` |
| **shared-ui** | Generic UI primitives | `src/components/ui/**`, `src/utils/dom/**` |
| **infrastructure** | Config, db, env, middleware, build | `src/lib/db.ts`, `src/config/**`, `src/middleware.ts`, `next.config.ts`, `package.json`, `tsconfig.json`, `.env.example` |

> The **resume** and **profile** domains intentionally co-own `src/data/profile/**` indirectly: resume *consumes* profile data but profile *owns* it. The manifest path globs reflect that — only `profile` lists `src/data/profile/**`.

### 4.1 `docs/` folder structure

```
docs/
  projects/README.md
  tools/README.md
  resume/README.md
  profile/README.md
  socials/README.md
  messages/README.md
  auth-users/README.md
  upload-media/README.md
  landing-about/README.md
  shared-ui/README.md
  infrastructure/README.md
  superpowers/
    specs/
      2026-05-04-claude-code-integration-design.md   ← this spec
```

Each domain README starts as a stub with three sections: **What this domain owns**, **File map**, **Non-obvious rules**. They grow as features land.

---

## 5. `CLAUDE.md` outline

Personalized for the portfolio (~250 lines target, vs. ToolsAustralia's ~600). Sections:

1. **Hard rules — read first** (~40 lines)
   - Rule 1: **No auto-commit.** Never run `git commit/add/push`, `gh pr create/merge` unless the user's most recent message contains one of: `commit`, `push`, `merge`, `make a PR`, `create a PR`, `open a PR`, `ship it`. Enforced by `.claude/hooks/no-auto-commit.mjs`.
   - Rule 2: **Update domain docs when code changes.** If you edit files matching a domain's `paths` glob in the manifest, you must also update the matching `docs/<domain>/` doc in the same task. Enforced by `.claude/hooks/doc-sync.mjs`.
   - Rule 3: **The Domain Manifest is the source of truth.** Both Claude and the doc-sync hook read the same JSON block. To add a new domain or path, edit the manifest — don't maintain a separate list elsewhere.

2. **Commands** (~15 lines)
   - `npm run dev`, `npm run build`, `npm start`.
   - **Gap flagged:** no test runner is wired. Jest/CRA leftovers in `package.json` don't run. Decide on Vitest or proper Jest setup before adding tests.
   - **Gap flagged:** no `lint` or `type-check` script. Add `"lint": "next lint"` and `"type-check": "tsc --noEmit"` during Phase 1.

3. **Architecture** (~50 lines)
   - One paragraph: Next.js 15 App Router on MongoDB/Mongoose, custom auth (bcryptjs + `jsonwebtoken`), Cloudinary for media, Nodemailer for transactional email, Tailwind, Framer Motion. React 19. Context for client state (no Zustand/Redux).
   - The strict layering tree from §3 above.
   - Hard rules from §3.1.

4. **Route handler conventions** (~20 lines)
   - Validate input at the boundary. Zod is **not** currently a dependency — flag as a follow-up if validation grows.
   - Authorize via `src/lib/auth.ts` for protected/admin routes.
   - Delegate to `src/services/<domain>/` only when logic is non-trivial; trivial CRUD calls the Mongoose model directly.
   - Match the JSON shape of sibling routes in the same folder.

5. **Conventions worth knowing** (~30 lines, portfolio-specific)
   - Mongoose connection: always go through `src/lib/db.ts`. No ad-hoc connections in scripts.
   - Cloudinary: server-side uploads only via `src/lib/cloudinary.ts`. Never expose API secret client-side.
   - Auth: protected pages wrap with `<ProtectedRoute>`; protected APIs check session in the handler.
   - Email: import only from `src/lib/email.ts`, never `nodemailer` directly in handlers.
   - Profile data: `src/data/profile/` is the source of truth for bio/experience/skills/achievements/contact/voice. Resume page, About page, and project descriptions all read from it.
   - Resume PDF: served via `window.print()` on `/resume` page (R1 print stylesheet). No `@react-pdf/renderer` dependency.
   - No `any` unless unavoidable. Strict TypeScript.

6. **Subsystems with their own docs** (~15 lines)
   - One pointer line per `docs/<domain>/README.md`.

7. **Domain Manifest** (~80 lines)
   - The full `<!-- DOMAIN-MANIFEST-START --> ... <!-- DOMAIN-MANIFEST-END -->` JSON block from §4.

### 5.1 Explicitly omitted from CLAUDE.md

Stripe / billing / payment / refund sections; A/B testing; cron jobs; multi-tenancy / admin orchestrator; CSP nonce middleware; Cursor agents section.

---

## 6. `.claude/` contents

```
.claude/
  settings.json
  hooks/
    no-auto-commit.mjs
    doc-sync.mjs
    lib/
      manifest.mjs       shared loader for the Domain Manifest
  agents/
    codebase-investigator.md       (generic — port from ToolsAustralia)
    debug-investigator.md          (generic — port)
    diff-reviewer.md               (generic — port)
    content-entry-reviewer.md      (portfolio-specific — new)
    seo-a11y-auditor.md            (portfolio-specific — new)
    voice-personality-reviewer.md  (portfolio-specific — new)
  commands/
    plan.md                        (generic — port)
    review.md                      (generic — port)
    test.md                        (generic — port, stub-shaped until test runner exists)
    ship.md                        (generic — port)
    add-project.md                 (portfolio-specific — new)
    add-tool.md                    (portfolio-specific — new)
    triage-messages.md             (portfolio-specific — new)
    update-profile.md              (portfolio-specific — new)
```

### 6.1 Hooks (2)

- **`no-auto-commit.mjs`** — `PreToolUse` Bash hook. Blocks `git commit/add/push`, `gh pr create/merge` unless the user's most recent message contains a commit-authorization keyword. On block, prints `BLOCKED: User has set no-auto-commit` and asks Claude to ask for authorization.
- **`doc-sync.mjs`** — `Stop` hook. After Claude finishes, diffs `git status`-touched files against the Domain Manifest. If any file matches a domain's `paths` glob and the corresponding `docs/<domain>/` had no edits in the same task, blocks the stop with `BLOCKED: Stale docs` and lists the docs to update. Bumps `lastVerified` on the domain when docs are updated.
- **`lib/manifest.mjs`** — shared module that parses the manifest JSON block out of `CLAUDE.md`, exposes `domains`, `pathToDomain(path)`, and `domainDocsPath(name)`. Both hooks import this so manifest parsing logic isn't duplicated.

### 6.2 Subagents (6)

**Generic (3 — direct ports from ToolsAustralia, paths/examples adapted):**
- `codebase-investigator` — read-only deep-dive search across the codebase.
- `debug-investigator` — bug repro + root cause hunting.
- `diff-reviewer` — reviews the working-tree diff before commit.

**Portfolio-specific (3 — new):**
- **`content-entry-reviewer`** — Triggered when a new project/tool entry is added. Checks: required fields present, image dimensions sensible (thumbnails ~600×400, hero ~1200×630), tag/category aligns with existing taxonomy in the DB, copy length within sensible bounds, slug uniqueness, OG-friendly description.
- **`seo-a11y-auditor`** — Triggered when a new page or layout component is added/changed. Checks: page metadata (title, description, OG, twitter, canonical), semantic HTML (one `h1`, proper landmarks), `alt` text on `<img>`/`<Image>`, color contrast against the Tailwind palette, keyboard-nav reachability, sitemap entry exists.
- **`voice-personality-reviewer`** — Reads `src/data/profile/voice.ts` + `bio.ts` + `experience.ts` + `achievements.ts` as the brand baseline. Triggered narrowly to avoid friction: only on >1-sentence additions or rewrites to project descriptions, page copy, contact replies, README, or `src/data/profile/{bio,achievements}.ts`. Inline 1-word fixes do not trigger it. Checks: tone matches the voice guide (formality, energy, jargon level), claims are backed by achievements/experience (no hallucinated credentials), avoids off-brand words/themes, technical depth matches the user's actual seniority.

### 6.3 Slash commands (8)

**Generic (4 — direct ports, lightly adapted):**
- `/plan` — produce an implementation plan for a feature.
- `/review` — review the current branch / working diff against a spec.
- `/test` — run + interpret tests. Initially a stub since no test runner is wired; grows when one is.
- `/ship` — run typecheck + lint + build, give the all-clear before pushing.

**Portfolio-specific (4 — new):**
- **`/add-project`** — guided flow for adding a new project: prompts for name/slug/description/tech stack/links/images, calls `content-entry-reviewer`, drafts the DB insertion or admin-UI submission.
- **`/add-tool`** — same pattern for a tool entry.
- **`/triage-messages`** — reads recent contact-form messages from the DB (read-only), summarizes them, drafts response options, flags spam.
- **`/update-profile`** — workflow: edit `src/data/profile/{bio,experience,skills,achievements}.ts` → call `voice-personality-reviewer` on any new copy → open `/resume` in dev server for visual check → trigger PDF export to verify.

### 6.4 `settings.json`

Minimal:
- Registers both hooks (`PreToolUse` for `no-auto-commit`, `Stop` for `doc-sync`).
- `permissions.allow` for read-only Bash so prompts are skipped: `git status`, `git diff`, `git log`, `npm run lint`, `npm run type-check`, `npm run build`, `npm run dev` (background), `next lint`, `tsc --noEmit`.

### 6.5 Explicitly omitted (vs. full ToolsAustralia D3)

- `touched-files-track.mjs` hook (audit overhead — `doc-sync` is enough enforcement).
- `domain-doc-updater` agent (Claude can update docs without a dedicated agent).
- `test-author` agent (no test runner yet).
- `/api`, `/script`, `/hook`, `/doc-bootstrap`, `/doc-domain`, `/doc-sync`, `/debug` commands (Stripe-/script-shaped).

---

## 7. Code-generated resume (R1 — print stylesheet)

### 7.1 Architecture

The HTML `/resume` page **is** the canonical resume. A "Download PDF" button calls `window.print()`; a `@media print` stylesheet plus `@page` rules produce a recruiter-grade A4 PDF via the browser's "Save as PDF" path.

### 7.2 Files

```
src/app/resume/
  page.tsx                Server-side rendered resume (SEO-crawlable)
  print.css               @media print styles + @page rules (A4, margins, page breaks)
src/components/resume/
  ResumeView.tsx          Composes header + sections
  ResumeHeader.tsx        Name, title, contact (uses contact.ts)
  ExperienceSection.tsx   Maps experience.ts → DOM
  SkillsGrid.tsx          Maps skills.ts → grouped grid
  AchievementsList.tsx    Maps achievements.ts → bullets
  DownloadPdfButton.tsx   Calls window.print() directly (no service layer needed)
```

### 7.3 Print stylesheet rules (key constraints)

- `@page { size: A4; margin: 18mm 16mm; }`
- Web-only chrome (Navbar, Footer, ToastContainer, dark mode toggle, "Download PDF" button) gets `@media print { display: none; }`.
- Body font-size shrinks to 10–11pt for print, line-height tightens.
- Force page-break-avoid on `ExperienceSection` headers + first child to prevent orphaned section titles.
- Use `print-color-adjust: exact;` for any colored badges that must survive the print path.
- Disable Framer Motion animations under `@media print`.
- Embed system fonts so PDF rendering doesn't depend on web-font load timing.

### 7.4 Retired (Phase 5)

The following are deleted, **not** kept around as backwards-compat:
- `src/models/Resume.ts` (was `lib/models/Resume.ts`)
- `src/app/api/resume/**` (PDF blob upload/download endpoints)
- `src/app/api/resumes/**` (history endpoints)
- `src/components/ResumeModal.tsx`
- Any nav links / menu entries pointing to the modal — replaced with a link to `/resume`.

---

## 8. `src/data/profile/` — seed content

Seeded from the user's actual resume content, with Claude, Cursor, and OpenClaw added to the AI tools section.

### 8.1 `contact.ts`

```ts
export const contact = {
  fullName: "Derem Joshua Rivera",
  title: "Full Stack Developer / Licensed Civil Engineer",
  address: "Blk 68 Lt 16 Franc St. North Fairview Subd. Quezon City",
  phone: "+63 933 851 8806",
  email: "djrrivera25@gmail.com",
} as const;
```

> Address + phone live here so a future "redacted PDF" toggle can omit them without touching `bio.ts` / `experience.ts`.

### 8.2 `bio.ts`

```ts
export const bio = {
  short: "Full Stack Developer with 1 year of experience.",
  medium:
    "Full Stack Developer combining the precision of a Licensed Civil Engineer " +
    "with modern web development across Vue, React, Next.js, Node.js, Express, and Laravel.",
  long:
    "Full Stack Developer with 1 year of experience delivering scalable, " +
    "user-focused web applications. Combines the precision of a Licensed Civil " +
    "Engineer with modern development skills in Vue, React, Next.js, Node.js, " +
    "Express and Laravel. Adept at taking projects from concept to deployment, " +
    "managing workflows efficiently, and writing clean, maintainable code.",
} as const;
```

### 8.3 `skills.ts`

```ts
export const skills = {
  frontend: [
    "HTML5", "CSS3", "Bootstrap", "Tailwind CSS",
    "React.js", "Vue.js", "Next.js",
    "Responsive Web Design", "Wireframing & Mockups (Figma)",
  ],
  backend: [
    "JavaScript (ES6+)", "TypeScript",
    "Node.js", "Express.js",
    "PHP", "Laravel",
    "REST API Development",
    "MongoDB", "MySQL",
  ],
  testingApi: ["Postman", "Unit Testing", "Integration Testing"],
  cloudDeployment: ["AWS", "GCP", "Vercel", "Render"],
  versionControl: ["Git", "GitHub", "GitLab", "Trello"],
  methodologies: ["Agile", "Scrum", "Waterfall", "SDLC"],
  thirdPartyApis: [
    "Stripe", "Meta CAPI", "Meta Marketing API",
    "Klaviyo", "SendGrid", "Hotjar",
  ],
  ai: ["Claude", "Cursor", "OpenClaw"],
} as const;
```

### 8.4 `experience.ts`

```ts
export const experience = [
  {
    role: "Web Developer",
    company: "VA4U — Tools Australia",
    startDate: "2025-09",
    endDate: null,                 // current
    location: "Remote",
    bullets: [
      "Designed and developed a full-stack eCommerce rewards and giveaway platform within 2 months, including a complete admin dashboard for analytics, user, and product management.",
      "Integrated third-party services: Stripe (payments), Meta CAPI & Marketing API (tracking), SendGrid & Klaviyo (email automation), and Hotjar (user behavior insights).",
      "Scaled platform to 20,000+ users, generating 50 daily conversions and AUD 3,000–5,000 in daily revenue.",
      "Improved SEO performance, increasing organic traffic and user acquisition.",
    ],
  },
] as const;
```

### 8.5 `achievements.ts`

Initial extraction from the experience bullets (quantified wins). Editable.

```ts
export const achievements = [
  "Shipped a full-stack eCommerce rewards & giveaway platform end-to-end in 2 months.",
  "Scaled platform to 20,000+ users with 50 daily conversions.",
  "Drove AUD 3,000–5,000 in daily revenue.",
  "Integrated 6 third-party services (Stripe, Meta CAPI, Meta Marketing, SendGrid, Klaviyo, Hotjar) into a single coherent admin dashboard.",
] as const;
```

### 8.6 `voice.ts`

Tone analysis from the resume content: professional, factual, quantified, action-led, engineering-precision.

```ts
export const voice = {
  tone: {
    formality: "professional, not stiff",
    energy: "confident, not boastful",
    perspective: "first-person implied (resume style); 'I' OK in long-form bios",
  },
  use: [
    "quantified outcomes (users, revenue, conversion counts)",
    "action verbs: designed, developed, integrated, scaled, improved, shipped",
    "concrete tech names (no 'modern stack' fluff)",
    "engineering framing — precision, scalability, maintainability",
  ],
  avoid: [
    "buzzwords without numbers ('synergy', 'rockstar', 'ninja')",
    "vague claims ('passionate about', 'love coding')",
    "generic stack lists with no context",
    "hedging ('I think', 'maybe', 'sort of')",
  ],
  themes: [
    "engineering rigor applied to web development",
    "end-to-end delivery (concept → deployment)",
    "third-party integration as a core competency",
    "growth & scale as proof points",
  ],
} as const;
```

### 8.7 `index.ts`

Re-exports a typed `profile` object so consumers do `import { profile } from "@/data/profile"`.

```ts
import { contact } from "./contact";
import { bio } from "./bio";
import { skills } from "./skills";
import { experience } from "./experience";
import { achievements } from "./achievements";
import { voice } from "./voice";

export const profile = { contact, bio, skills, experience, achievements, voice } as const;
export type Profile = typeof profile;
```

---

## 9. Migration sequence (5 phases)

Each phase ends with a working app and is safely committable.

### Phase 1 — Restructure file layout (C2)

- Create `src/app/`, `src/lib/`, `src/models/` (move targets).
- Move `/app/**` → `/src/app/**`.
- Move `/lib/**` → `/src/lib/**` and `/lib/models/**` → `/src/models/**`.
- Reconcile `/src/lib/api/**` (already exists) with the moved `/src/lib/`.
- Reorganize `/src/components/*.tsx` flat files into domain subfolders: `components/projects/`, `components/tools/`, `components/contact/`, `components/layout/`, `components/landing/`. Keep `ui/` and `projects/` if already domain-shaped.
- Update `tsconfig.json` paths: replace `@/lib/*`, `@/app/*`, `@/src/*` with a single `@/*` → `src/*`.
- Update every import statement (~50–100 imports). Run `tsc --noEmit` to confirm zero unresolved imports.
- Add `lint` and `type-check` scripts to `package.json`.
- Verify `npm run build` succeeds.

**Deliverable:** working app with single source root, no behavior changes.

### Phase 2 — `CLAUDE.md` + Domain Manifest + `docs/` stubs

- Write the personalized `CLAUDE.md` per §5.
- Add the 10-domain manifest at the bottom (§4).
- Create `docs/<domain>/README.md` stubs for each of the 10 domains (~30 lines each: What this domain owns / File map / Non-obvious rules).
- Ensure `docs/superpowers/specs/` exists and contains this spec.

**Deliverable:** Claude Code understands the architecture; doc structure exists for hooks to enforce against.

### Phase 3 — `.claude/` (hooks + settings + agents + commands)

- Port `no-auto-commit.mjs` from ToolsAustralia.
- Port `doc-sync.mjs`, with `lib/manifest.mjs` rewritten if needed to read this project's manifest path and globs.
- Port the 3 generic subagents: `codebase-investigator`, `debug-investigator`, `diff-reviewer`.
- Write the 3 portfolio subagents: `content-entry-reviewer`, `seo-a11y-auditor`, `voice-personality-reviewer`.
- Port the 4 generic slash commands: `/plan`, `/review`, `/test` (stub), `/ship`.
- Write the 4 portfolio commands: `/add-project`, `/add-tool`, `/triage-messages`, `/update-profile`.
- Write `.claude/settings.json` with hook registration + read-only Bash allowlist (§6.4).
- Manually trigger both hooks once to verify they fire and read the manifest correctly.

**Deliverable:** hooks enforce hard rules; subagents and slash commands available to use.

### Phase 4 — `src/data/profile/` seeded

- Create the directory and the 7 files per §8.
- Wire `index.ts` to re-export a typed `profile` object.
- Update the existing **About** page (`/about`) to consume `profile.bio.long`, `profile.skills`, etc., proving the data is hooked up.

**Deliverable:** single source of truth for personal brand exists and is consumed by at least one live page.

### Phase 5 — Code-generated resume + retire old

- Build `src/app/resume/page.tsx` (HTML view, consumes `src/data/profile/`).
- Build `src/components/resume/*` per §7.2.
- Write `src/app/resume/print.css` per §7.3.
- Add the "Download PDF" button that calls `window.print()`.
- Manually verify: web view renders correctly; "Save as PDF" produces an A4 PDF with no broken page breaks, no unwanted chrome, embedded fonts.
- Delete: `src/models/Resume.ts`, `src/app/api/resume/**`, `src/app/api/resumes/**`, `src/components/ResumeModal.tsx`, any nav references to the modal.
- Update Navbar / Footer to link to `/resume` instead of opening the modal.
- Run `tsc --noEmit` to catch any leftover references to deleted files.
- Verify `npm run build` succeeds.

**Deliverable:** resume served as code-generated HTML with PDF export; all PDF-blob infrastructure gone.

---

## 10. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Phase 1 breaks ~50–100 imports; some get missed and `npm run build` fails. | Use `tsc --noEmit` as the source of truth (catches more than `next build`). Update imports in batches by domain; commit per domain. |
| `doc-sync.mjs` produces false positives (blocks Claude on unrelated changes). | Hook should match path globs exactly; provide an `--ignore` escape hatch for genuine no-doc-needed changes (e.g., type-only refactors). |
| Print stylesheet looks fine in Chrome but breaks in Firefox/Safari "Save as PDF". | Test in all three before retiring the old PDF endpoint. Document the recommended browser in `docs/resume/README.md` if differences are unfixable. |
| Retiring `/api/resume(s)` breaks any external links to the old PDF URL. | Add a 308 redirect from `/api/resume` → `/resume` in `next.config.ts` for one release cycle. |
| `voice-personality-reviewer` produces friction on every small copy change. | Scope its trigger narrowly: only on >1-sentence additions to project descriptions, page copy, or `data/profile/`. Inline 1-word fixes don't trigger it. |
| Profile data committed to public git includes phone + address. | Already in scope: `contact.ts` is separate from other profile data so a redacted-PDF toggle is a clean follow-up. Default for now: ship as-is since the resume is publicly viewable anyway. |

---

## 11. Out of scope (deferred to future specs)

- **C3 — Full layered rewrite.** Extract business logic from API route handlers into `src/services/<domain>/`. Introduce repositories where DB access is non-trivial. Add Zod validation at boundaries. — Next spec after this one ships.
- **Test runner setup** (Vitest or properly-wired Jest). Flagged as a gap in CLAUDE.md.
- **Cursor `.cursor/` setup** mirroring Claude Code agents. Possible future spec.
- **Server-side PDF rendering** (Puppeteer / `@react-pdf/renderer` swap-in). Easy follow-up if R1 print stylesheet proves insufficient.
- **Redacted PDF toggle** that omits phone + address.
- **Admin UI for editing `src/data/profile/`** without redeploying. Decided against — git is fine for personal-brand data.

---

## 12. Open questions

None blocking. All design decisions are locked.
