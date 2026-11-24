# gotchas

## The public Build Log feed was removed — the worklog is entirely private

There used to be an opt-in public feed: a `visibility` field on `WorkEntry`, a
`toPublicEntry` field allowlist, an unauthenticated `GET /api/worklog/public`, and a
`BuildLogSection` on the homepage. **All of it is gone** as of 2026-08-19.

Removed: `lib/worklog/public.ts`, `lib/worklog/public.test.ts`,
`app/api/worklog/public/route.ts`, `src/components/portfolio/BuildLogSection.tsx`, the
`visibility` field and its index, `setWorkEntryVisibility`, `listPublicEntries`, the
`visibility` branch in `PATCH /api/worklog/entries`, and the dashboard's publish controls.

The header comment in [`lib/worklog/types.ts`](../../lib/worklog/types.ts) is now the
authoritative statement: *"The worklog is entirely private: there is no visibility flag and no
unauthenticated route. Every read goes through `isAuthorizedAdmin` or `isAuthorizedMcp`."*

**Treat any older documentation, comment, or commit message describing a public feed as false.**
One stale reference survives in code: the header comment in
[`src/config/worklog.ts`](../../src/config/worklog.ts) still says "and the public Build Log".

If a public feed is ever wanted again, rebuild it as an explicit field **allowlist** (the deleted
`PUBLIC_ENTRY_KEYS` approach), not a blocklist — so a field added to `WorkEntry` later is private
by default rather than leaking.

## The dropped `visibility` index may still exist in MongoDB

Mongoose does not drop an index when you remove it from a schema. `WorkEntry` previously declared
`{ visibility: 1, createdAt: -1 }`; that declaration is gone from the code, but the index itself
survives in any database that ran the old schema.

It is harmless — an index on a field no document has — but it is real, and it will not disappear on
its own. To clear it:

```bash
node --env-file=.env.local scripts/worklog-reset.mjs
```

That drops the worklog collections and their indexes, which is also how you rebuild them. On a
database with data you want to keep, drop the single index from the Mongo shell instead.

## Changing a worklog schema in dev needs a dev-server restart

The `models.X || model(…)` HMR-safe pattern means a model registered with the old schema stays
registered. The symptom is `Path "<field>" is not in schema, strict mode is true` for a field you
just added. Restart `npm run dev`.

## Deleting a route leaves a stale generated type

`tsconfig.json` includes `.next/types/**/*.ts`. After `app/api/worklog/public/route.ts` was
deleted, `npm run type-check` kept failing inside
`.next/types/app/api/worklog/public/route.ts` — a file nobody wrote — until the next build.

Run `npm run build`, or delete `.next`, before believing a `type-check` failure in a generated
path.

## `session: null` is not the same as no session

The unique partial index on `(session, title)` filters `session: { $type: "objectId" }` and **not**
`$exists: true`. An explicit `session: null` satisfies `$exists`, which would make every
session-less entry sharing a title collide with every other.

## Re-logging is an update, not an insert

The same `title` inside one `session_id` updates the existing entry rather than adding a
near-duplicate. This is intended — a model re-reporting the same finished task should not create
noise — but it means a genuinely repeated task needs a distinct title or a different session.

## `source` distinguishes who wrote an entry

MCP-written entries default to `source: "claude"`. Entries created through
`POST /api/worklog/entries` are stamped `source: "web"`. Neither is validated against an enum, so a
third value is possible and nothing would complain.

## `completedAt` is not a plain timestamp

It is managed by `resolveCompletedAt`: stamped on entering `done`, cleared on leaving it, and
**preserved** when an already-done entry is touched again. Setting it directly, or assuming it
tracks the last write, breaks the report aggregation.

## `source` has a third value now

`"claude-ai"` is stamped by `log_work` when the request came in with `MCP_CLAUDE_AI_TOKEN`
([`tools.ts`](../../app/api/mcp/tools.ts) `clientOf`). Claude Code writes keep the default
`"claude"`, and the dashboard `POST` stamps `"web"`. Still not enum-validated.

## The session-start hook: how it picks the project

Source in [`scripts/worklog-hooks/`](../../scripts/worklog-hooks/); `install.mjs` **copies** (does
not link) `worklog-hook-lib.mjs` and `worklog-context.mjs` into `~/.claude/hooks/`, backing up a
changed existing file as `<name>.bak-<YYYYMMDD>`. Re-run it after editing the source.

Resolution, in order ([`worklog-context.mjs`](../../scripts/worklog-hooks/worklog-context.mjs),
`projectLookup` in [`worklog-hook-lib.mjs`](../../scripts/worklog-hooks/worklog-hook-lib.mjs)):

1. **Git remote `origin`**, normalised with credentials stripped. If it normalises, the hook calls
   `list_work` with `{ repo }`. The server then runs `findWorkProjectByRepo`: first a project whose
   stored `repo` normalises to the same value, then a project whose `matchKey` equals the repo
   name's separator-free key (`repoNameKey`) — and that second path **stores the repo on the
   project** (self-heal).
2. **Only when there is no usable remote**: the main checkout's folder name, taken from
   `git rev-parse --git-common-dir` (so a worktree maps to its main checkout), sent as
   `{ project }` and matched strictly by `matchKey`.
3. Not in a git repo (or neither works): `projectLookup` returns `null` and the hook prints
   nothing.

When nothing matches, the hook prints the server's own line instead of a list. For a repo lookup
that is the fixed line ``No worklog project matches this repo — set it with `set_work_project_status` (repo).``;
for the folder-name fallback it is `No worklog project matches "<folder>".` (the value is in the
text). Server unreachable, a non-2xx reply, a JSON-RPC error or a 4 s timeout prints exactly
`Worklog unreachable: no cross-session check this time.`. No open entries prints nothing. Output is
capped at 40 lines, and the hook always exits 0. It never prints the token or the remote URL.

Credentials: it reads the `worklog` server's URL and `Authorization` header from the user's Claude
Code MCP config (`readServerConfig`). `WORKLOG_HOOK_URL_OVERRIDE` replaces only the URL and is read
only by the hook.

`normaliseRepoUrl` exists twice — [`lib/worklog/repo.ts`](../../lib/worklog/repo.ts) and the hook
lib — because the hook cannot import TypeScript. Change both together; each has its own tests
([`repo.test.ts`](../../lib/worklog/repo.test.ts),
[`worklog-hook-lib.test.mjs`](../../scripts/worklog-hooks/worklog-hook-lib.test.mjs)).

## Repo self-heal happens only when the project has no repo yet

`findWorkProjectByRepo` writes `repo` on a name-matched project only if its `repo` is empty
(`if (!byName || byName.repo) return null`). A project that already stores a *different* repo is
never overwritten, and the lookup returns "no match" — the fix is `set_work_project_status` with
`repo` by hand. Because the name match is on the repo's last path segment, this checkout's remote
`my-portfolio-client` matches a project called `my-portfolio-client`, **not** `my-portfolio`.

## A credential-looking `repo` is dropped silently on the dashboard

`storableRepo` returns `null` for text containing `@` that is not a recognisable address, and
`resolveWorkProject` then skips the `repo` write. The MCP tool says so in its reply; the dashboard
`PATCH /api/worklog/projects` does not.

## The dashboard only loads the newest 200 attachments (known gap)

`getDashboard` calls `listAttachments({ limit: 200 })`
([`dashboard.ts`](../../lib/worklog/dashboard.ts); the query caps at 200). The page builds its
attachment chips from that one list (`attachmentsByEntry` in
[`app/worklog/page.tsx`](../../app/worklog/page.tsx)). Entries reached through filters or **Load
more** that are older than those attachments can therefore show no attachment chips even though
attachments exist. `list_attachments` over MCP is not affected. Not fixed in this build.

## `until`: a bare date means different things on the server and in the dashboard

On the server, `parseUntil("2026-08-31")` returns the **next UTC midnight** (`2026-09-01T00:00Z`),
and `entryQueryFrom` treats `until` as exclusive (`createdAt < until`), so the whole UTC day is
included. A full ISO timestamp, or `"7d"`-style value, is used as given (and exclusive).
The dashboard does not send bare dates: `startOfLocalDay` in
[`app/worklog/page.tsx`](../../app/worklog/page.tsx) converts the From/To inputs to the viewer's
local-midnight instants (To plus one day), so a day filter there follows the viewer's timezone,
not UTC. The same date typed to `list_work` and into the dashboard can differ by the UTC offset.

## Reports used to cap at 500 rows

`buildReport` previously fetched at most 500 entries (`limit: ENTRY_LIMIT_MAX`) and aggregated them in memory with `aggregateReport` (now removed); it now counts in Mongo with
no cap (`reportFromCounts` in [`report.ts`](../../lib/worklog/report.ts)). Only blockers are
capped — 50 fetched, 15 printed with an "…and N more" line. A report total that matches
`list_work_projects`' "logged" count is expected; an older quoted number may not.

## `scripts/worklog-reset.mjs` does not drop `workattachments`

Its `COLLECTIONS` list is `workentries`, `workprojects`, `worksessions`, `counters`. The
`workattachments` collection (and its index) survives a reset, while the `workAttachment` counter is
dropped — so after a reset the next attachment is issued `ref` 1 again while old attachments survive; with the unique `ref` index that looks like a duplicate-key failure (_TODO: verify._ — inferred from the schema, not run).

## vitest on Windows fails everywhere from a lowercase `c:` directory

Running `npm test` / `npx vitest` from a shell whose working directory is spelled `c:\...` makes
vitest load twice and every suite fail with `Cannot read properties of undefined (reading
'config')`. That means wrong cwd, not broken code — `Set-Location "C:\..."` with an uppercase drive
letter and re-run.
