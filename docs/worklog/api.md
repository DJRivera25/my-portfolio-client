# api

Two adapters over the same service layer. Both are authenticated; there are currently **no
public worklog routes** (see [gotchas.md](./gotchas.md)).

## `/api/mcp` — the MCP adapter (Claude Code and claude.ai)

[`app/api/mcp/route.ts`](../../app/api/mcp/route.ts) wraps `mcp-handler`'s
`createMcpHandler` and exports the same guarded function as `GET`, `POST`, and `DELETE`.

- **Auth:** `mcpClientFor(req)` → `401 {"error":"Unauthorized"}` when it returns `null`. Two
  credentials are accepted: `MCP_TOKEN` (Claude Code) and `MCP_CLAUDE_AI_TOKEN` (claude.ai custom
  connector). Neither has a default — unset means that client is denied. See
  [auth/architecture.md](../auth/architecture.md).
- **Client identity:** on success the route sets
  `req.auth = { token: "", clientId: <McpClient>, scopes: [] }` (the real token is deliberately
  left out). `clientOf(ctx)` in [`tools.ts`](../../app/api/mcp/tools.ts) reads
  `ctx.http.authInfo.clientId`; `log_work` stamps `source: "claude-ai"` for claude.ai writes and
  otherwise leaves the default `"claude"`.
- **Runtime:** `nodejs` + `dynamic = "force-dynamic"`. Mongoose and `node:crypto` cannot run
  on edge.
- Tools are registered in [`app/api/mcp/tools.ts`](../../app/api/mcp/tools.ts).
- MCP exposes **no delete** — deleting entries is dashboard-only.

Tool arguments are **snake_case**; the service layer maps them to camelCase at the boundary.

| Tool | Use it when |
|---|---|
| `log_work` | Something is finished, started, or blocked. Also files future work with `status: "todo"`. |
| `list_work` | Answering what is outstanding, recent, blocked or waiting on someone. Paged. |
| `update_work_status` | Finishing or blocking something already logged, by its `#ref`. |
| `list_work_projects` | Getting an overview, or checking which project key to use. |
| `set_work_project_status` | A project ships, pauses, or is archived; recording its repo. |
| `work_report` | Standups, weekly reviews, client updates. |
| `session_status` | Picking up where a previous session left off. |
| `end_session` | Wrapping up, with a summary the next session can read. |
| `attach_link` / `list_attachments` | Hanging a URL (artifact, PR, deploy) on a project or entry, and listing them. |
| `list_groups` / `set_work_group` | Seeing groups with counts; putting existing entries (by ref) into a group. |

### `log_work` — arguments

`project`, `title` (required); `summary`, `status` (default `done`), `tags`, `group`,
`minutes_spent`, `branch`, `commit_sha`, `commit_message`, `pr_url`, `blocked_reason`,
`waiting_on`, `session_id`. The reply is one line, `Logged #<ref> <title> [<project>] — <status>`.

`waiting_on` follows `resolveWaitingOn` ([`status.ts`](../../lib/worklog/status.ts)): `done` always
clears it, an empty/blank string clears it, a string sets it (trimmed), omitting it leaves it
alone.

### `list_work` — arguments

All optional. Registered in [`tools.ts`](../../app/api/mcp/tools.ts).

| Arg | Meaning |
|---|---|
| `project` | Project key, matched by `matchKey`. Wins over `repo`. |
| `repo` | A git remote URL; resolved by `findWorkProjectByRepo` (see [gotchas.md](./gotchas.md)). Ignored when `project` is given. |
| `group` | One group label (matched by `groupKey`). |
| `status` | `todo`, `in_progress`, `blocked`, `done`, or `open` (= todo + in_progress + blocked). |
| `text` | Case-insensitive literal match in `title` or `summary`. |
| `waiting_on` | Case-insensitive literal substring match on `waitingOn`. |
| `since` / `until` | Window on `createdAt`. `since` is `"7d"`, `"24h"`, `"2w"` or ISO; `until` is parsed by `parseUntil`. |
| `session_id` | Claude Code session id; an unknown id gives `No session <id>.` |
| `offset` | Entries to skip, default 0. |
| `limit` | 1–100, default 25 (the service caps at 500). |

The reply is built by `formatEntryPage` ([`format.ts`](../../lib/worklog/format.ts)):

- unmatched project → `No worklog project matches "<key>".`
- unmatched repo → ``No worklog project matches this repo — set it with `set_work_project_status` (repo).``
- no entries → `No entries.` (or `No entries at offset N (T in total).` when the offset is past the end)
- when the query resolved to one project, a header `<Name> · <N> matching` and lines without the per-line `[Project]` suffix
- a footer `Showing 25 of 96 — pass offset 25 for more` whenever more pages remain (`formatPageFooter`)
- open entries with a `waitingOn` get a `↳ waiting on <who>` line; blocked ones also get `↳ <reason>`

### `work_report`

`project` (optional), `since` (optional). Calls `buildReport`, which counts with a Mongo
aggregation (`$group` by project and status) — **there is no row cap**. Blockers are fetched with
a limit of 50 (`BLOCKER_LIMIT` in [`entries.ts`](../../lib/worklog/entries.ts)); the text shows 15
(`REPORT_BLOCKER_LINES`) and then `…and N more — list_work status 'blocked'`, where N comes from
the blocked **count**, not the fetched list.

### `set_work_project_status`

`slug` (required), `status`, `name`, `description`, `repo`. The repo is stored via `storableRepo`
([`repo.ts`](../../lib/worklog/repo.ts)): normalised, blank clears it, and a value that
contains `@` but is not a recognisable address is **refused, not stored**. The reply then ends
with `— repo not saved: it looks like it carries login details; pass the plain https or git@ URL`.

## `/api/worklog/*` — the dashboard adapter

Every route starts with `isAuthorizedAdmin(req)` → `401 {"message":"Unauthorized"}`, using
`ADMIN_API_TOKEN`.

### `GET /api/worklog/dashboard`

→ `200` from `getDashboard()` ([`dashboard.ts`](../../lib/worklog/dashboard.ts)):
`{ projects, entries, entryTotal, sessions, attachments, groups }`. `entries` is the first page
(300 newest) of the unfiltered list and `entryTotal` the unfiltered count. `attachments` is the
**newest 200 only** — see [gotchas.md](./gotchas.md).

### `GET /api/worklog/entries`

Query params, all optional, parsed by `parseEntryQuery`
([`filters.ts`](../../lib/worklog/filters.ts)): `project`, `group`, `status` (a status or
`open`), `text`, `waitingOn`, `since`, `until`, `offset` (default 0), `limit` (1–500, default 300).
Blank values are ignored.

→ `200 { entries, total, offset }`. `total` is the count of **all** matching entries, so a client
can tell whether more pages exist.
→ `400 { message }` with the Zod issues when a value is invalid (unknown `status`, `limit` over 500, …).

Note: a `project` that matches nothing returns an empty page, not an error.

### `POST /api/worklog/entries`

Body requires `project` and `title`; the rest is passed to `logWork`. Entries created here are
stamped `source: "web"`, which distinguishes them from MCP-written entries (`"claude"` or
`"claude-ai"`).

→ `201` entry, or `400 {"message":"project and title are required"}`.

### `PATCH /api/worklog/entries`

Body requires an integer `ref`. If the body has a `group` key, sets or (when falsy) clears the
group. Otherwise requires a valid `status`, with optional `blockedReason`. This route does **not**
forward `waitingOn`; moving an entry to `done` still clears it (rule in `resolveWaitingOn`).

→ `400 {"message":"ref is required"}`, `400 {"message":"A valid status is required"}`, or
`404 {"message":"Entry not found"}`.

### `DELETE /api/worklog/entries`

Body `{ refs: number[] }`. → `200 { deleted }`, or `400` when `refs` is empty. Admin-only; absent
from MCP.

### `GET /api/worklog/projects`

→ `200` `WorkProjectSummary[]` from `listWorkProjects()`.

### `PATCH /api/worklog/projects`

Body requires `slug`; optional `status`, `name`, `description`, `repo`. → `200` updated project,
or `400 {"message":"slug is required"}`. `repo` goes through the same `storableRepo` rules as the
MCP tool (a credential-looking value is silently not stored).

### `GET /api/worklog/report`

Optional `project`, `since` (parsed by `parseSince`). → `200` `ReportDigest` from `buildReport()`
— same uncapped counting as `work_report`.

### `GET /api/worklog/sessions`

Optional `sessionId` query param. → `200` `WorkSessionSummary[]` from `getSessionStatus()`.

### `GET` / `POST /api/worklog/attachments`

`GET` takes optional `project` and `entryRef`. `POST` requires `project` and `url` (`400` otherwise,
or `400 { message }` when `attachLink` throws). → `201` attachment.
