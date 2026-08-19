# api

Two adapters over the same service layer. Both are authenticated; there are currently **no
public worklog routes** (see [gotchas.md](./gotchas.md)).

## `/api/mcp` — the Claude Code adapter

[`app/api/mcp/route.ts`](../../app/api/mcp/route.ts) wraps `mcp-handler`'s
`createMcpHandler` and exports the same guarded function as `GET`, `POST`, and `DELETE`.

- **Auth:** `isAuthorizedMcp(req)` → `401 {"error":"Unauthorized"}`. Uses `MCP_TOKEN`, which
  has **no default** — unset means every request is denied.
- **Runtime:** `nodejs` + `dynamic = "force-dynamic"`. Mongoose and `node:crypto` cannot run
  on edge.
- Tools are registered in [`app/api/mcp/tools.ts`](../../app/api/mcp/tools.ts).

Tool arguments are **snake_case**; the service layer maps them to camelCase at the boundary.

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

## `/api/worklog/*` — the dashboard adapter

Every route starts with `isAuthorizedAdmin(req)` → `401 {"message":"Unauthorized"}`, using
`ADMIN_API_TOKEN`.

### `GET /api/worklog/entries`

Query params, all optional: `project`, `status`, `since` (`"7d"`, `"24h"`, or ISO — parsed by
`parseSince`), `limit` (positive numbers only; anything else is ignored).

→ `200` array of entries.

### `POST /api/worklog/entries`

Body requires `project` and `title`. Entries created here are stamped `source: "web"`, which
distinguishes them from MCP-written entries (`source: "claude"` by default).

→ `201` entry, or `400 {"message":"project and title are required"}`.

### `PATCH /api/worklog/entries`

Body requires an integer `ref` and a valid `status`. Optional `blockedReason`.

→ `400 {"message":"ref is required"}` when `ref` is not an integer,
`400 {"message":"A valid status is required"}` when `status` is missing or not in
`WORK_ENTRY_STATUSES`, or `404 {"message":"Entry not found"}` when no entry has that `ref`.

### `GET /api/worklog/projects`

→ `200` `WorkProjectSummary[]` from `listWorkProjects()`.

### `PATCH /api/worklog/projects`

Body requires `slug`. → `200` updated project, or `400 {"message":"slug is required"}`.

### `GET /api/worklog/report`

→ `200` `ReportDigest` from `buildReport()`.

### `GET /api/worklog/sessions`

Optional `sessionId` query param. → `200` `WorkSessionSummary[]` from `getSessionStatus()`.
