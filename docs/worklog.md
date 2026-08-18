# Worklog

Work tracking that Claude Code writes to over MCP, from any project on any machine.
Entries and tasks by project, session status, and reports — with a private dashboard at
`/worklog` and an opt-in public Build Log on the homepage.

## Setup

### 1. Set `MCP_TOKEN`

A long random secret, separate from `ADMIN_API_TOKEN` so it can be revoked without losing
dashboard access. **It has no default: if unset, `/api/mcp` denies every request.**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Put it in `.env.local` for development and in the Vercel project's environment variables
for production.

### 2. Connect Claude Code

```bash
claude mcp add --transport http worklog https://<your-site>/api/mcp \
  --header "Authorization: Bearer $MCP_TOKEN"
```

Verify with `/mcp` inside Claude Code — the `worklog` server should list eight tools.

## Tools

| Tool | Use it when |
|---|---|
| `log_work` | Something is finished, started, or blocked. Also files future work with `status: "todo"`. |
| `list_work` | Answering what is outstanding, recent, or blocked. Filter by status for the backlog. |
| `update_work_status` | Finishing or blocking something already logged, by its `#ref`. |
| `list_work_projects` | Getting an overview, or checking which project key to use. |
| `set_work_project_status` | A project ships, pauses, or is archived; recording its repo. |
| `work_report` | Standups, weekly reviews, client updates. |
| `session_status` | Picking up where a previous session left off. |
| `end_session` | Wrapping up, with a summary the next session can read. |

Tool arguments are snake_case; the service layer maps them to camelCase at the boundary.

## Behaviour worth knowing

**Projects create themselves.** The first `log_work` against a key creates the project. No
registration step.

**Project keys are matched without separators.** `Tools Australia`, `tools-australia`,
`toolsaustralia` and `tools_australia` are all the same project. The first spelling seen
becomes the display slug. This matters because a model typing a key from memory would
otherwise fork a project's history in two, and nothing would look wrong until a report was
quietly missing half its entries.

**Re-logging deduplicates.** The same title inside one `session_id` updates that entry
rather than adding a near-duplicate. Enforced by a partial unique index on
`(session, title)`, so it holds even under concurrent writes.

**Sessions track themselves.** There is no `start_session`. Passing a `session_id` to
`log_work` creates the session and bumps its activity. `end_session` closes it.

**Completion times are preserved.** `completedAt` is stamped on entering `done` and cleared
on leaving it — but touching an already-done entry does not overwrite the original time.

## Privacy

Entries are **private by default**. Only entries explicitly set to `visibility: "public"`
appear on the site, and `GET /api/worklog/public` is the only unauthenticated route.

That route filters on visibility *and* projects an explicit allowlist of fields — `ref`,
`title`, `summary`, `tags`, `createdAt`, and the project's `name`/`slug`. It is an
allowlist, not a blocklist, so `blockedReason`, `branch`, `prUrl`, `minutesSpent` and all
session data are structurally unreachable. A field added to `WorkEntry` later is private
by default; `lib/worklog/public.test.ts` fails until someone deliberately adds it.

Publish and unpublish individual entries from the `/worklog` dashboard.

## Architecture

```
lib/worklog/          all business logic
  types.ts            vocabulary + status enums (no mongoose — keeps the pure layer testable)
  public.ts   pure    toPublicEntry, PUBLIC_ENTRY_KEYS
  report.ts   pure    aggregateReport
  format.ts   pure    text rendering for MCP responses
  status.ts   pure    resolveCompletedAt
  slug.ts     pure    slugifyProject, projectMatchKey, deriveProjectName
  since.ts    pure    "7d" / "24h" / ISO parsing
  entries.ts  query   logWork, listWorkEntries, updateWorkEntryStatus, buildReport, listPublicEntries
  projects.ts query   resolveWorkProject, listWorkProjects
  sessions.ts query   touchSession, endSession, getSessionStatus
        ↑                              ↑
app/api/mcp/                  app/api/worklog/
(Claude Code)                 (dashboard + public feed)
```

The pure modules import neither mongoose nor `@/lib/db` — deliberately, because `lib/db.ts`
throws at module scope when `MONGODB_URI` is unset, which would take any importing test
down with it. That split is what lets the tests run with no database and no mocks.

## Commands

```bash
npm run test         # service-layer tests
npm run type-check   # tsc --noEmit
node --env-file=.env.local scripts/worklog-reset.mjs   # drop worklog collections + indexes
```

`worklog-reset.mjs` is also how you rebuild indexes after a schema change — Mongoose does
not drop a stale index on its own.

## Gotchas

**Changing a worklog schema in dev needs a dev-server restart.** The `models.X || model(…)`
HMR-safe pattern means a model registered with the old schema stays registered. The symptom
is `Path "<field>" is not in schema, strict mode is true`.
