# Worklog MCP — design

**Date:** 2026-08-18
**Status:** approved, pending implementation plan

Turn the portfolio site into a working tool: a worklog that Claude Code writes to over MCP
from any project on any machine, with a private dashboard and an opt-in public "Build Log"
feed.

Adapted from the `worklog-mongo` scaffold (`~/Downloads/files (2)`). The scaffold's data
layer targets the raw `mongodb` driver and Cloudflare R2; this repo is Mongoose +
`dbConnect()` + Cloudinary, so the data layer is rewritten while the MCP tool shapes, the
short-id scheme, and the session-upsert behaviour carry over.

## Goals

1. Claude Code, mid-session in any repo, records what it did — no context switch.
2. Work is tracked per project, with status, so "what is left on ToolsAustralia" is answerable.
3. Sessions are tracked without ceremony.
4. Reports summarise a period or a project.
5. Selected entries surface publicly as a living build log.

## Non-goals (this iteration)

- File attachments, presigned uploads, R2. Scoped out; the service layer leaves room.
- GitHub webhook commit ingestion.
- Playwright reporter integration.
- Multi-user. Single operator, single shared token.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Scope | Core worklog only | Smallest useful thing; attachments slot in later without rework |
| Project identity | New `WorkProject` registry, auto-upserted | Zero setup friction, somewhere to hang status/repo, optional link to portfolio `Project` |
| Visibility | Private by default, opt-in public | Client names and blockers must never leak by default |
| Task vs entry | One model with `status` | Open tasks are entries not yet done; the log is the backlog |
| Transport | `mcp-handler` v2, stateless Streamable HTTP | Purpose-built for App Router; no Redis; Claude Code speaks it |
| Tests | `vitest`, service layer only | Report aggregation and public projection fail silently otherwise |

## What is deliberately NOT ported

**The scaffold's `lib/mongo.ts`.** It caches its own `MongoClient` on `globalThis`. Adding it
beside Mongoose opens a *second connection pool* to the same Atlas cluster — the exact
connection-exhaustion failure its README warns about, caused by the remedy. All access goes
through the cached `dbConnect()` in `@/lib/db`.

**R2 / `lib/storage.ts`.** No second storage vendor. Attachments are out of scope; when they
land they use the existing Cloudinary integration.

**snake_case fields.** The scaffold uses `minutes_spent` / `created_at`. This repo uses
camelCase (`hasViewed`, `mobileImage`). Repo convention wins.

## Vocabulary

`Project` already means "portfolio case study". A worklog project is a different concept and
needs a different word — these names are **newly coined** for this repo:

| Term | Meaning |
|---|---|
| `WorkProject` | Something worked on. Slug-keyed (`toolsaustralia`). Optional `portfolioProject` link. |
| `WorkEntry` | One unit of work. Task *and* log line — distinguished by `status`. |
| `WorkSession` | One Claude Code session. |
| `Counter` | Short-id sequence source. |
| worklog | The domain name. Route namespace `/api/worklog`, dashboard `/worklog`. |

MCP tools say `list_work_projects`, never `list_projects` — Claude often holds portfolio
projects in context simultaneously, and one concept must not answer to two names.

## Data model

Mongoose, `models.X || model("X", …)` HMR-safe pattern, `{ timestamps: true }`.

### `lib/models/Counter.ts`

```
_id:  String   // "workEntry"
seq:  Number
```

Exports `nextSeq(name): Promise<number>` — a `findOneAndUpdate` with `$inc` and `upsert`.

Short integer ids are kept from the scaffold on its original reasoning: MCP hands ids to
Claude as text and takes them back as arguments, and a 24-char ObjectId hex is easy to
garble. `_id` stays an ObjectId for Mongoose; `ref` is the MCP-facing and URL-facing handle.

### `lib/models/WorkProject.ts`

```
slug:             String  required unique lowercase trim   // "toolsaustralia"
name:             String  required                          // "Tools Australia"
description:      String
repo:             String
status:           enum ["active","paused","shipped","archived"]  default "active"
portfolioProject: ObjectId ref "Project"                    // optional showcase link
```

### `lib/models/WorkEntry.ts`

```
ref:           Number    required unique index      // #42
project:       ObjectId  ref "WorkProject" required index
title:         String    required
summary:       String
status:        enum ["todo","in_progress","blocked","done"]  default "done"  index
blockedReason: String
tags:          [String]
minutesSpent:  Number
branch:        String
prUrl:         String
session:       ObjectId  ref "WorkSession"
source:        String    default "claude"           // "claude" | "web"
visibility:    enum ["private","public"]  default "private"  index
completedAt:   Date
```

Indexes:

- `{ project: 1, createdAt: -1 }`
- `{ status: 1, createdAt: -1 }`
- `{ visibility: 1, createdAt: -1 }` — public feed
- `{ session: 1, title: 1 }` unique, `partialFilterExpression: { session: { $type: "objectId" } }`

`$type: "objectId"` rather than `$exists: true`: an explicit `session: null` satisfies
`$exists`, which would make every session-less entry collide with every other session-less
entry of the same title. Type-matching excludes nulls, so the constraint applies only to
entries that actually belong to a session.

That last index carries over the scaffold's de-duplication: re-logging the same title within
one session **updates** rather than duplicating. Claude retries and re-runs; without it the
log fills with near-identical rows.

`completedAt` is stamped by the service layer on any transition into `done` and cleared on
any transition out. Never supplied by the caller.

### `lib/models/WorkSession.ts`

```
sessionId:      String  required unique index   // Claude Code's own session id
project:        ObjectId ref "WorkProject"
status:         enum ["active","ended"]  default "active"
startedAt:      Date  default now
lastActivityAt: Date  default now
endedAt:        Date
summary:        String
entryCount:     Number  default 0
```

There is no `start_session` tool. `log_work` carrying a `session_id` upserts the session and
bumps `lastActivityAt` — sessions track themselves. `end_session` closes one with a summary.

## Architecture

The scaffold README's real lesson is *"routes shouldn't know what database you run."* One
service layer, two thin protocol adapters:

```
                 lib/worklog/            <- all business logic
                      ^
        +-------------+-------------+
  app/api/mcp/              app/api/worklog/
  (Claude Code)             (dashboard + public feed)
```

Both adapters stay inside the CLAUDE.md ~30-lines-of-logic-per-handler rule.

### `lib/worklog/` modules

| File | Exports |
|---|---|
| `projects.ts` | `resolveWorkProject(slug, { name? })` auto-upsert · `listWorkProjects()` with open/blocked counts · `setWorkProjectStatus()` |
| `entries.ts` | `logWork()` · `listWorkEntries()` · `updateWorkEntryStatus()` |
| `sessions.ts` | `touchSession()` · `endSession()` · `getSessionStatus()` |
| `report.ts` | `buildReport({ project?, since? })` → structured digest |
| `format.ts` | render digests and lists to the text MCP returns |
| `public.ts` | `listPublicEntries()` — the allowlist projection, isolated on purpose |

`resolveWorkProject` derives a display `name` from the slug when absent (`toolsaustralia` →
`Toolsaustralia`) so a first `log_work` never fails for want of setup.

Every service function calls `await dbConnect()` first.

### Pure core, thin query shell

Each module separates the database query from the logic applied to its results. The query
half touches Mongoose; the pure half is an exported function over plain objects:

| Pure function | In |
|---|---|
| `aggregateReport(entries, opts)` | `report.ts` |
| `toPublicEntry(doc)` | `public.ts` |
| `resolveCompletedAt(prevStatus, nextStatus, now)` | `entries.ts` |
| `deriveProjectName(slug)` | `projects.ts` |
| everything in `format.ts` | `format.ts` |

This is what makes the test suite worth having: the logic that can silently be wrong is
reachable without a database and without mocking Mongoose, which is otherwise painful enough
that the tests quietly do not get written.

## MCP endpoint

**Dependencies:** `mcp-handler@^2`, `@modelcontextprotocol/server@^2`, `zod@^4`. Node 20+
(local is v22). Stateless — no Redis. `zod` is additionally wanted for validating existing
handlers, already flagged in the CLAUDE.md backlog.

**`app/api/mcp/route.ts`** — `runtime = "nodejs"`. Wraps `createMcpHandler` in the bearer
check, exports as GET and POST.

**`app/api/mcp/tools.ts`** — `registerWorklogTools(server)`, mirroring the scaffold's
`artifact-tools.ts` split. Protocol surface only; all logic delegates to `lib/worklog/`.

### Tools

| Tool | Arguments |
|---|---|
| `log_work` | `project`, `title`, `summary?`, `status?`, `tags?`, `minutes_spent?`, `branch?`, `pr_url?`, `session_id?`, `visibility?` |
| `list_work` | `project?`, `status?`, `since?`, `limit?` |
| `update_work_status` | `ref`, `status`, `blocked_reason?` |
| `list_work_projects` | — |
| `set_work_project_status` | `slug`, `status?`, `description?`, `repo?` |
| `work_report` | `project?`, `since?` |
| `session_status` | `session_id?` |
| `end_session` | `session_id`, `summary?` |

Tool arguments stay snake_case — that is MCP convention and what Claude expects; the service
layer maps to camelCase at the boundary.

Descriptions must state *when to reach for the tool*, not merely what it does. A tool Claude
never selects is dead weight.

## Auth

`lib/auth.ts` gains `isAuthorizedMcp(req)` beside the existing `isAuthorizedAdmin`. Three
deliberate differences:

- **Own `MCP_TOKEN`.** Different client, different machine, revocable without losing
  dashboard access.
- **Fails closed.** `ADMIN_API_TOKEN || "admin-static-token"` is the known gap noted in
  CLAUDE.md. Unset `MCP_TOKEN` means **deny**. Never a guessable default.
- Constant-time comparison, length-checked first.

| Surface | Gate |
|---|---|
| `/api/mcp` | `isAuthorizedMcp` |
| `/api/worklog/**` | `isAuthorizedAdmin` |
| `/api/worklog/public` | none — allowlist-projected |

## REST surface

| Route | Methods |
|---|---|
| `app/api/worklog/entries/route.ts` | GET (filter), POST, PATCH (status) |
| `app/api/worklog/projects/route.ts` | GET, PATCH |
| `app/api/worklog/sessions/route.ts` | GET |
| `app/api/worklog/report/route.ts` | GET |
| `app/api/worklog/public/route.ts` | GET, unauthenticated |

### Public feed safety

`listPublicEntries()` filters `visibility: "public"` **and** projects an explicit allowlist:
`ref`, `title`, `summary`, `tags`, `createdAt`, and the project's `name` and `slug`.

An allowlist, not a blocklist — `blockedReason`, `branch`, `prUrl`, `minutesSpent`, `source`
and all session data are structurally unreachable, so a field added to `WorkEntry` later
cannot leak by default. This is the highest-risk surface in the design, which is why the
projection lives in its own module with its own test.

## Dashboard

`app/worklog/page.tsx` inside `ProtectedRoute`, mirroring `app/inbox/page.tsx`. Fetches via
the existing `src/lib/api/client.ts` axios instance, which already attaches the admin token.

- `src/components/worklog/WorkProjectCards.tsx` — per-project open and blocked counts
- `src/components/worklog/WorkEntryList.tsx` — filterable, inline status change
- `src/components/worklog/WorkSessionStrip.tsx` — recent sessions, active first
- `src/components/worklog/WorkReportPanel.tsx` — period digest
- `src/lib/api/worklog.ts` — fetchers
- `src/types/worklog.ts` — shared types

## Public Build Log section

`src/components/portfolio/BuildLogSection.tsx`, composed into `PortfolioPage`. Consumes
`/api/worklog/public`.

Uses the `ATELIER` tokens from `src/config/atelier.ts` (`ink`, `paper`, `gold`, `muted`,
`faint`, `green`) and follows the existing section pattern — static copy and a graceful
fallback live in `atelier.ts`, so an empty or failed feed degrades to copy rather than a
blank band. No hardcoded strings in JSX.

Renders nothing when the feed is empty and no fallback applies.

## Testing

`vitest`, with `npm run test` and `npm run type-check` (`tsc --noEmit`) wired in
`package.json`.

The pure functions above — no UI tests, no route tests, no database, no mocking:

1. `toPublicEntry` — the allowlist. Given an entry with **every** field populated, the output
   contains exactly the allowed keys and nothing else. **This test fails when someone adds a
   field to `WorkEntry` and forgets the projection — that is its whole purpose.**
2. `aggregateReport` — totals, per-project and per-status grouping, `since` boundary
   inclusivity, empty input.
3. `resolveCompletedAt` — stamped entering `done`, cleared leaving it, untouched between two
   non-`done` statuses.
4. `deriveProjectName` — slug to display name.
5. `format.ts` — a report with no entries renders a readable "nothing logged" rather than an
   empty string or a header with a void beneath it.

Behaviour that genuinely needs a database — the `(session, title)` upsert, index enforcement,
`resolveWorkProject` idempotency — is verified once by hand against dev, not unit-tested.
That boundary is deliberate: mocking Mongoose to assert Mongo's own upsert semantics tests
the mock, not the code.

## Environment

```
MCP_TOKEN=            # long random secret; unset means /api/mcp denies all
```

Added to `.env.example` and set in Vercel. Existing `MONGODB_URI` reused.

## Client setup

```bash
claude mcp add --transport http worklog https://<site>/api/mcp \
  --header "Authorization: Bearer $MCP_TOKEN"
```

## Risks

| Risk | Mitigation |
|---|---|
| Second Mongo connection pool | `lib/mongo.ts` not ported; Mongoose `dbConnect()` only |
| Public feed leaking client data | Allowlist projection, isolated module, dedicated test, private default |
| Guessable MCP token | No default value, fails closed, constant-time compare |
| `Project` name collision | `Work*` prefix family |
| MCP spec churn | `mcp-handler` v2 serves 2026-07-28 natively plus 2025-era fallback from one handler |
| Log fills with duplicates on retry | Partial unique index on `(session, title)` |

## Out of scope, deliberately

Attachments, GitHub webhook, Playwright reporter, multi-user auth, entry editing beyond
status, notifications. The service layer boundary is where each would attach.

## Domain Manifest entry

Add to `CLAUDE.md` on implementation:

```json
"worklog": {
  "purpose": "Work tracking written by Claude Code over MCP: entries/tasks by project, session status, reports. Private dashboard at /worklog; opt-in public Build Log feed on the homepage.",
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
    "src/components/portfolio/BuildLogSection.tsx",
    "src/lib/api/worklog.ts",
    "src/types/worklog.ts"
  ]
}
```
