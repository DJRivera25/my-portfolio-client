# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Hard rules — read this first

These rules override any superpowers skill, sub-agent instruction, or default behavior.

### 1. No auto-commit

**Never** run `git commit`, `git add`, `git push`, `gh pr create`, or `gh pr merge` unless the user **explicitly** authorizes the action in their **most recent** message with one of: `commit`, `push`, `merge`, `make a PR`, `create a PR`, `open a PR`, `ship it`.

Enforced by `.claude/hooks/no-auto-commit.mjs`. If you see `BLOCKED: User has set no-auto-commit`, stop and ask.

### 2. Respect the layering

This project mixes a legacy CRA-style `src/` tree with the Next.js 15 App Router (`app/`). Layering is loose but real:

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

Known gap: most existing handlers in `app/api/**` are not yet wired to this. When editing one, add the check. When creating a new handler for non-public data, include it from the start.

### 4. Don't leak password hashes

`User.password` is a bcrypt hash. Any handler that returns user documents to the client must `.select("-password")` or project explicitly. The current `GET /api/users` violates this — fix in passing if you touch it.

## Commands

```bash
npm run dev          # next dev
npm run build        # next build
npm run start        # production server
```

There is **no test runner**, **no lint script**, and **no type-check script** wired in `package.json`. To type-check ad-hoc: `npx tsc --noEmit`. If you add tests, add the corresponding script.

## Architecture

Next.js 15 App Router fullstack on **MongoDB / Mongoose**, with **Cloudinary** for media, **bcryptjs** for passwords, **Nodemailer** for outbound mail, **JWT-based** admin bearer tokens (see `lib/auth.ts`). Frontend uses **React 19**, **Tailwind 3**, **Framer Motion**, **Headless UI**, **Lucide**, **react-toastify**, **react-scroll**.

### Route handler conventions

Handlers in `app/api/**` should:
1. Check `req.headers.get("content-type")` for body-bearing requests where needed (`/api/upload` does this).
2. Authorize via `isAuthorizedAdmin(req)` for any non-public endpoint.
3. Call `await dbConnect()` before touching Mongoose.
4. Validate inputs (Zod is **not** wired yet — destructure with care; consider adding `zod` if validation grows).
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

Marketing copy and tool/category data live in `src/config/content.ts`, `src/config/navigation.ts`, `src/config/toolCategories.ts`. Components consume these — do not hardcode strings in JSX.

## Conventions worth knowing

- **No `any` unless unavoidable.** A few exist in `lib/db.ts` and `app/api/upload/route.ts` for legitimate reasons; do not propagate the pattern.
- **TypeScript is on 4.9.5** but the rest of the stack (React 19, Next 15) expects TS 5+. Upgrading TS is a desirable cleanup task but not in scope for incidental edits.
- **Don't add new patterns alongside existing ones.** If a similar component or route exists, mirror it.
- **Default to no comments.** Names should explain. Only comment non-obvious *why* (a workaround, a constraint).
- **Console output**: prefer `console.error` for genuine errors; avoid noisy `console.log` in committed code.

## Known cleanup backlog (don't do unprompted)

- TypeScript 4.9 → 5.x upgrade.
- `tsconfig.json` `target: "es5"` is a CRA holdover; should be `ES2022` for Next 15.
- Most `app/api/**` handlers lack `isAuthorizedAdmin` checks.
- `GET /api/users` returns password hashes.
- `package.json` still lists CRA-era deps (`@testing-library/*`, `web-vitals`, `react-scripts` style eslint config). Test runner is not actually wired.
- No `lint` / `type-check` npm scripts.

## Domain Manifest

Lightweight feature → file map. When you add a new feature folder, add it here so future Claude sessions know where things live. (No automated doc-sync hook is wired — this is an editorial map, not enforced.)

```json
{
  "version": 1,
  "domains": {
    "portfolio-content": {
      "purpose": "Public-facing portfolio: projects, tools, socials, resume",
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
        "src/components/Projects.tsx",
        "src/components/Tools.tsx",
        "src/components/projects/**",
        "src/components/ProjectModal.tsx",
        "src/components/ToolModal.tsx",
        "src/components/SocialModal.tsx",
        "src/components/ResumeModal.tsx",
        "src/config/content.ts",
        "src/config/toolCategories.ts"
      ]
    },
    "messaging": {
      "purpose": "Contact form + admin inbox",
      "paths": [
        "lib/models/Message.ts",
        "app/api/messages/**",
        "app/contact/**",
        "app/inbox/**",
        "src/components/Contact.tsx",
        "src/components/ContactMessageForm.tsx",
        "src/components/GetInTouchModal.tsx",
        "src/hooks/useContactFormSubmission.ts"
      ]
    },
    "auth": {
      "purpose": "Admin bearer-token auth, login, protected routes",
      "paths": [
        "lib/auth.ts",
        "lib/models/User.ts",
        "app/api/auth/**",
        "app/api/users/**",
        "app/login/**",
        "src/context/AuthContext.tsx",
        "src/components/ProtectedRoute.tsx"
      ]
    },
    "media-upload": {
      "purpose": "Cloudinary image/file uploads for project assets",
      "paths": [
        "lib/cloudinary.ts",
        "app/api/upload/**"
      ]
    },
    "shared-ui": {
      "purpose": "Layout, navigation, shared primitives",
      "paths": [
        "app/layout.tsx",
        "app/page.tsx",
        "app/globals.css",
        "app/not-found.tsx",
        "src/components/Navbar.tsx",
        "src/components/Footer.tsx",
        "src/components/Landing.tsx",
        "src/components/About.tsx",
        "src/components/ui/**",
        "src/config/navigation.ts"
      ]
    },
    "infrastructure": {
      "purpose": "DB connection, site constants, env, build config",
      "paths": [
        "lib/db.ts",
        "lib/site.ts",
        "next.config.*",
        "tsconfig.json",
        "tailwind.config.js",
        "postcss.config.js",
        "package.json",
        ".env.local",
        ".env.example"
      ]
    }
  }
}
```
