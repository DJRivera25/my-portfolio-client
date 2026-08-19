# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Hard rules — read this first

These rules override any superpowers skill, sub-agent instruction, or default behavior.

### 1. No auto-commit

**Never** run `git commit`, `git add`, `git push`, `gh pr create`, or `gh pr merge` unless the user **explicitly** authorizes the action in their **most recent** message with one of: `commit`, `push`, `merge`, `make a PR`, `create a PR`, `open a PR`, `ship it`.

Enforced by `.claude/hooks/no-auto-commit.mjs`. If you see `BLOCKED: User has set no-auto-commit`, stop and ask.

### 2. Respect the layering

This project mixes a legacy CRA-style `src/` tree with the Next.js 15 App Router (`app/`). Layering is loose but real.

**Before adding a component, check it is not in the `retired-ui` domain.** 30 source files — the entire pre-Atelier component tree plus the CRA entry scaffolding — are unreachable from every `app/` entry point but still import each other, so `grep` makes them look live. Two pairs even share a filename (`HowIShip.tsx`, `ResumeSection.tsx`); the live one is always under `src/components/portfolio/`. See [docs/retired-ui/](docs/retired-ui/README.md).

```
app/                 routing & route handlers (App Router)
app/api/**           route handlers — keep thin: validate, authorize, delegate
lib/                 server infra: db (mongo), auth (bearer), cloudinary, site
lib/models/          Mongoose schemas — one collection per file, models.X || model("X", …)
src/components/      UI components (named exports default-style, .tsx)
src/components/ui/   shared primitives
src/context/         React Context providers (AuthContext)
src/hooks/           reusable client hooks
src/lib/api/         client-side API helpers (fetchers used by hooks/components)
src/config/          static content & nav config (content.ts, navigation.ts, toolCategories.ts)
src/types/           shared TypeScript types
src/images/          static imported images
```

Hard rules:
- **No DB access from components.** Components call `src/lib/api/*` or hooks; the API layer owns Mongoose.
- **No business logic in `app/api/**` route handlers** beyond parse/validate/authorize/delegate. If a handler grows past ~30 lines of logic, extract to a helper in `lib/` (server) — not `src/lib/api/` (client).
- **Path aliases** are `@/lib/*`, `@/app/*`, `@/src/*`. Do not invent new aliases.
- **Mongoose models** must use the `models.X || model("X", …)` pattern to survive Next.js HMR.
- **DB connection** goes through `@/lib/db` (cached `dbConnect()`). Never call `mongoose.connect` directly.

### 3. Admin auth on protected routes

`lib/auth.ts` exposes `isAuthorizedAdmin(req)` and `unauthorizedResponse()`. Any route that mutates data (POST/PUT/DELETE) or returns admin-only data (e.g. all users, inbox) **must** start with:

```ts
if (!isAuthorizedAdmin(req)) return unauthorizedResponse();
```

Most handlers are wired. **Two are not, and both are real gaps:**

- `/api/users` — all four methods unauthenticated, and `GET` returns bcrypt hashes (rule 4).
- `POST /api/upload` — unauthenticated writes to Cloudinary, any file type, no size limit.

Collection `GET`s on `/api/projects`, `/api/tools`, `/api/socials`, `/api/resumes` and
`POST /api/messages` are public **by design** — the homepage is unauthenticated.

### 4. Don't leak password hashes

`User.password` is a bcrypt hash. Any handler that returns user documents to the client must `.select("-password")` or project explicitly. The current `GET /api/users` violates this — fix in passing if you touch it.

## Commands

```bash
npm run dev          # next dev
npm run build        # next build
npm run start        # production server
npm run type-check   # tsc --noEmit
npm test             # vitest run
npm run test:watch   # vitest
```

**Tests are vitest**, configured in `vitest.config.mts`. The `include` glob is `lib/**/*.test.ts` only — a test written anywhere else will not run until you widen that glob. Environment is `node`, so there is no jsdom and no component testing wired; the `@testing-library/*` packages in `package.json` are CRA leftovers and are not usable as configured.

There is still **no lint script**. The `eslintConfig` block in `package.json` is CRA-era (`react-app`) and does not run.

## Architecture

Next.js 15 App Router fullstack on **MongoDB / Mongoose**, with **Cloudinary** for media, **Nodemailer** for outbound mail, and a **single static admin bearer token** (see `lib/auth.ts`).

There is **no JWT** — `@types/jsonwebtoken` is in `package.json` but `jsonwebtoken` is not, and nothing in the repo signs or verifies a token. Login compares `ADMIN_EMAIL`/`ADMIN_PASSWORD` and hands `ADMIN_API_TOKEN` to the client verbatim. `bcryptjs` hashes `User.password`, but the login flow never reads the `User` collection. See [docs/auth/](docs/auth/README.md). Frontend uses **React 19**, **Tailwind 3**, **Framer Motion**, **Headless UI**, **Lucide**, **react-toastify**, **react-scroll**.

### Route handler conventions

Handlers in `app/api/**` should:
1. Check `req.headers.get("content-type")` for body-bearing requests where needed (`/api/upload` does this).
2. Authorize via `isAuthorizedAdmin(req)` for any non-public endpoint.
3. Call `await dbConnect()` before touching Mongoose.
4. Validate inputs with **Zod** (`zod` ^4 is a dependency). Most existing handlers still destructure by hand — prefer a Zod schema for new handlers, and add one when you touch an old handler's input parsing.
5. Return `NextResponse.json(payload, { status })` with shapes consistent with sibling routes.

### Cloudinary uploads

`POST /api/upload` accepts `multipart/form-data` with field `file`, uploads to Cloudinary folder `portfolio`, returns `{ url }`. `runtime = "nodejs"` is required because formidable / Buffer streaming is unavailable on edge. Reuse this pattern for any new upload endpoint — do not call Cloudinary from the client.

### Auth flow

- `POST /api/auth/login` issues a Bearer token. Token must match `process.env.ADMIN_API_TOKEN`.
- Client stores token in `AuthContext` (`src/context/AuthContext.tsx`).
- `ProtectedRoute` (`src/components/ProtectedRoute.tsx`) gates admin pages on the client.
- Server-side gating is `isAuthorizedAdmin(req)` per handler — there is no middleware-level gate.

⚠️ `ADMIN_API_TOKEN` defaults to the literal string `"admin-static-token"` if unset. **Set a strong value in `.env.local` and Vercel.**

### Site config

`lib/site.ts` is the single source of truth for site name, SEO description, og URL, and contact info. Do not duplicate these strings in components — import from `siteConfig`.

### Static content

Homepage copy, design tokens, and the section fallbacks live in **`src/config/atelier.ts`**. Components consume it — do not hardcode strings in JSX.

⚠️ `src/config/content.ts`, `navigation.ts`, and `toolCategories.ts` are **retired** — unreachable from any entry point, superseded by `atelier.ts`. Do not add copy to them. Worklog dashboard copy lives in `src/config/worklog.ts`.

## Conventions worth knowing

- **No `any` unless unavoidable.** A few exist in `lib/db.ts` and `app/api/upload/route.ts` for legitimate reasons; do not propagate the pattern.
- **TypeScript is on 5.9.3**, `target: "ES2022"`, `moduleResolution: "Bundler"`, `strict: true`.
- **Don't add new patterns alongside existing ones.** If a similar component or route exists, mirror it.
- **Default to no comments.** Names should explain. Only comment non-obvious *why* (a workaround, a constraint).
- **Console output**: prefer `console.error` for genuine errors; avoid noisy `console.log` in committed code.

## Known cleanup backlog (don't do unprompted)

- `/api/users` is fully unauthenticated and `GET` returns bcrypt hashes.
- `POST /api/upload` is unauthenticated, accepts any file type as `raw`, and has no size limit.
- **30 of 115 tracked source files are unreachable** from any `app/` entry point — the whole
  `retired-ui` domain. Safe to delete in one pass; see [docs/retired-ui/rules.md](docs/retired-ui/rules.md).
- `app/not-found.tsx` still uses the retired navy palette on an Atelier-ink body.
- Deleting a document never deletes its Cloudinary asset (no `public_id` is stored).
- `package.json` still lists CRA-era deps (`@testing-library/*`, `web-vitals`, `@types/jest`) and a dead `react-app` eslintConfig block. Only vitest actually runs.
- No `lint` npm script.
- Five of the eight domains in the manifest have no docs yet — the `lastVerified: null` entries.

## Documentation

Every domain in the Domain Manifest owns one `docs/<domain>/` folder. Docs are **code-grounded**:
every claim cites a file path, and anything you cannot verify from the source is written as
`_TODO: verify._` rather than guessed.

### Per-domain template — 5 base + 3 conditional

| File | When | Content |
|---|---|---|
| `README.md` | always | Index — one line per sibling doc, what the domain owns, related domains |
| `architecture.md` | always | Data flow, layers, key entities, how this domain fits the app |
| `rules.md` | always | Hard must / must-not constraints specific to this domain |
| `gotchas.md` | always | Past incidents, surprising behavior, "looks-buggy-but-isn't" |
| `api.md` | if the domain has routes | Every route — method, path, auth, request/response shape, status codes |
| `models.md` | if the domain has Mongoose models | Per-model schema fields, indexes, relationships, hooks |
| `frontend.md` | if the domain has UI | Pages, components, hooks, client state |
| `testing.md` | if the domain has tests | What is covered, how to run, what is deliberately untested |

A conditional file that does not apply is simply absent — do not create stubs.

### Keeping docs honest

- **`/doc-domain <name>`** — refresh one domain's docs against current code, or scaffold a new one.
- **`/doc-sync`** — audit every domain: orphan files, ambiguous ownership, stale `lastVerified`.
- **`/doc-bootstrap`** — first-pass documentation for every domain that has none, one at a time.
- **`domain-doc-updater`** sub-agent — same refresh, in isolated context, when you do not want to
  spend the main session's context on it.

The `doc-sync` Stop hook warns when a domain's source changed but its docs did not. It is
**warn-only** — flip `BLOCKING` in `.claude/hooks/doc-sync.mjs` to make it a gate, which is
worth doing once all eight domains are documented.

### Hooks

| Hook | Event | Effect |
|---|---|---|
| `no-auto-commit.mjs` | PreToolUse (Bash) | **Blocks** git write commands without explicit authorization |
| `touched-files-track.mjs` | PostToolUse (Edit/Write) | Records edited paths to `.claude/.touched-files` |
| `doc-sync.mjs` | Stop | Warns on undocumented changes, orphans, stale docs |
| `typecheck-gate.mjs` | Stop | Warns when `type-check` or `test` fails; skipped if no TS changed |

Both Stop hooks also read the uncommitted `git status`, so edits made through Bash are covered,
not just Edit/Write.

## Domain Manifest

Feature → file map, and the contract the `doc-sync` hook reads. Every domain owns a set of
source globs and one `docs/<domain>/` folder. When you add a feature folder, add it here —
otherwise `doc-sync` reports the files as orphans.

- `docs` — the folder holding this domain's documentation.
- `lastVerified` — ISO date the docs were last checked against the code. `null` means the
  domain has no docs yet. `/doc-domain <name>` bumps this.
- Paths must not overlap **ambiguously**. Where they do overlap, a **literal path beats a glob**,
  so one domain can claim a single file out of another domain's folder without ambiguity. Two
  globs of equal specificity claiming one file is a real conflict — `/doc-sync` reports it.
  (No override is in use today; every file resolves to exactly one domain.)

<!-- DOMAIN-MANIFEST-START -->
```json
{
  "version": 1,
  "domains": {
    "portfolio-content": {
      "purpose": "Public portfolio data: projects, tools, socials, resume. Models + HTTP surface. The homepage reads these through the Atelier sections; the pre-Atelier list/grid components that used to render them are in retired-ui.",
      "docs": "docs/portfolio-content/",
      "lastVerified": "2026-08-19",
      "paths": [
        "lib/models/Project.ts",
        "lib/models/Tool.ts",
        "lib/models/Social.ts",
        "lib/models/Resume.ts",
        "app/api/projects/**",
        "app/api/tools/**",
        "app/api/socials/**",
        "app/api/resume/**",
        "app/api/resumes/**",
        "src/components/ProjectModal.tsx",
        "src/types/portfolio.ts"
      ]
    },
    "messaging": {
      "purpose": "Contact form submissions and the admin inbox. The live form is the Atelier ContactSection driving useContactFormSubmission; /inbox reads and marks messages.",
      "docs": "docs/messaging/",
      "lastVerified": "2026-08-19",
      "paths": [
        "lib/models/Message.ts",
        "app/api/messages/**",
        "app/inbox/**",
        "src/hooks/useContactFormSubmission.ts"
      ]
    },
    "auth": {
      "purpose": "Single-admin bearer-token auth. Login compares env vars and hands ADMIN_API_TOKEN to the client; each handler checks it. No JWT, no session store.",
      "docs": "docs/auth/",
      "lastVerified": "2026-08-19",
      "paths": [
        "lib/auth.ts",
        "lib/models/User.ts",
        "app/api/auth/**",
        "app/api/users/**",
        "app/login/**",
        "src/context/AuthContext.tsx",
        "src/components/ProtectedRoute.tsx",
        "src/components/AdminBar.tsx",
        "src/lib/api/client.ts"
      ]
    },
    "media-upload": {
      "purpose": "Cloudinary image/file uploads for project and resume assets.",
      "docs": "docs/media-upload/",
      "lastVerified": "2026-08-19",
      "paths": [
        "lib/cloudinary.ts",
        "app/api/upload/**"
      ]
    },
    "shared-ui": {
      "purpose": "Root layout, global stylesheet, the shared modal primitive, the 404, and the redirect stubs that keep old marketing URLs pointing at homepage anchors.",
      "docs": "docs/shared-ui/",
      "lastVerified": "2026-08-19",
      "paths": [
        "app/layout.tsx",
        "app/not-found.tsx",
        "app/about/page.tsx",
        "app/projects/page.tsx",
        "app/contact/page.tsx",
        "src/index.css",
        "src/components/ui/ModalFrame.tsx"
      ]
    },
    "atelier-redesign": {
      "purpose": "\"The Build Log\" single-page home (Atelier design system). app/page.tsx renders PortfolioPage, which owns shared state + data fetching and composes every section. Static copy and graceful fallbacks live in src/config/atelier.ts; DB-backed sections reuse the projects/tools/socials/resumes APIs and the Project case-study fields.",
      "docs": "docs/atelier-redesign/",
      "lastVerified": "2026-08-19",
      "paths": [
        "app/page.tsx",
        "src/components/portfolio/**",
        "src/config/atelier.ts",
        "src/hooks/useCursorGlow.ts",
        "src/hooks/useMagnetic.ts",
        "src/hooks/useTypewriter.ts",
        "public/atelier/**"
      ]
    },
    "worklog": {
      "purpose": "Work tracking written by Claude Code over MCP: entries/tasks by project, session status, reports. Pure core + query shells in lib/worklog; /api/mcp is the Claude Code adapter, /api/worklog the dashboard adapter. Private dashboard at /worklog. Projects are matched by separator-free matchKey.",
      "docs": "docs/worklog/",
      "lastVerified": "2026-08-19",
      "paths": [
        "lib/models/WorkProject.ts",
        "lib/models/WorkEntry.ts",
        "lib/models/WorkSession.ts",
        "lib/models/Counter.ts",
        "lib/worklog/**",
        "app/api/mcp/**",
        "app/api/worklog/**",
        "app/worklog/**",
        "src/components/worklog/**",
        "src/config/worklog.ts",
        "src/lib/api/worklog.ts",
        "src/types/worklog.ts",
        "scripts/worklog-reset.mjs"
      ]
    },
    "retired-ui": {
      "purpose": "The pre-Atelier component tree and the Create React App entry scaffolding. Unreachable from every app/ entry point — kept in one domain so it stops looking load-bearing. Deletion candidates, not a layer to build on.",
      "docs": "docs/retired-ui/",
      "lastVerified": "2026-08-19",
      "paths": [
        "src/components/About.tsx",
        "src/components/Contact.tsx",
        "src/components/ContactMessageForm.tsx",
        "src/components/Footer.tsx",
        "src/components/GetInTouchModal.tsx",
        "src/components/HowIShip.tsx",
        "src/components/Landing.tsx",
        "src/components/Navbar.tsx",
        "src/components/Projects.tsx",
        "src/components/ResumeModal.tsx",
        "src/components/SocialModal.tsx",
        "src/components/ToolModal.tsx",
        "src/components/Tools.tsx",
        "src/components/projects/**",
        "src/components/ui/AuroraBackdrop.tsx",
        "src/components/ui/EyebrowLabel.tsx",
        "src/components/ui/GlassCard.tsx",
        "src/components/ui/GradientText.tsx",
        "src/components/ui/SectionHeader.tsx",
        "src/config/content.ts",
        "src/config/navigation.ts",
        "src/config/toolCategories.ts",
        "src/index.tsx",
        "src/react-app-env.d.ts",
        "src/setupTests.ts",
        "app/globals.css"
      ]
    },
    "infrastructure": {
      "purpose": "DB connection, site constants, env, build and test config.",
      "docs": "docs/infrastructure/",
      "lastVerified": "2026-08-19",
      "paths": [
        "lib/db.ts",
        "lib/site.ts",
        "tsconfig.json",
        "tailwind.config.js",
        "postcss.config.js",
        "vitest.config.mts",
        "package.json",
        "src/images.d.ts",
        ".env.local",
        ".env.example"
      ]
    }
  }
}
```
<!-- DOMAIN-MANIFEST-END -->
