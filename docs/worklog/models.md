# models

Five collections, all in `lib/models/`. Every schema uses the `models.X || model("X", …)`
HMR-safe pattern and `{ timestamps: true }` unless noted.

## `WorkProject` — [lib/models/WorkProject.ts](../../lib/models/WorkProject.ts)

| Field | Type | Notes |
|---|---|---|
| `slug` | String | required, unique, lowercase, trimmed. Display spelling. |
| `matchKey` | String | required, unique, lowercase, trimmed. **Identity** — see [architecture.md](./architecture.md). |
| `name` | String | required. Human-readable name. |
| `description` | String | |
| `repo` | String | Stored **normalised** by `storableRepo` (`host/owner/name`: lowercase, no scheme, credentials, query or `.git`) — see [`repo.ts`](../../lib/worklog/repo.ts). Blank clears it. A credential-looking value is refused, never stored. Set by `set_work_project_status`, or self-healed once by `findWorkProjectByRepo` — see [gotchas.md](./gotchas.md). Older rows may hold un-normalised text; `findWorkProjectByRepo` normalises both sides when comparing. |
| `status` | String | enum `WORK_PROJECT_STATUSES` = `active` \| `paused` \| `shipped` \| `archived`, default `active` |
| `portfolioProject` | ObjectId → `Project` | Optional link to the public case study |

Two unique indexes (`slug`, `matchKey`). Lookups go through `matchKey`.

## `WorkEntry` — [lib/models/WorkEntry.ts](../../lib/models/WorkEntry.ts)

| Field | Type | Notes |
|---|---|---|
| `ref` | Number | required, unique. Short id from `nextSeq("workEntry")`. |
| `project` | ObjectId → `WorkProject` | required |
| `title` | String | required, trimmed |
| `summary` | String | |
| `status` | String | enum `WORK_ENTRY_STATUSES` = `todo` \| `in_progress` \| `blocked` \| `done`, default `done` |
| `blockedReason` | String | Cleared by `updateWorkEntryStatus` whenever the new status is not `blocked`. |
| `waitingOn` | String | trimmed. Who or what the entry waits on (`"Derem"`, `"PR #1018"`). Rule `resolveWaitingOn` ([`status.ts`](../../lib/worklog/status.ts)): `done` clears it, a blank value clears it, a string sets it, omitted leaves it. MCP arg `waiting_on`. |
| `tags` | [String] | default `[]` |
| `group` | String | trimmed. Display spelling of the group label. |
| `groupKey` | String | trimmed, lowercase. Separator-free identity from `groupKey()` in [`slug.ts`](../../lib/worklog/slug.ts); filters match on it. |
| `minutesSpent` | Number | |
| `branch` | String | |
| `commitSha` | String | trimmed |
| `commitMessage` | String | |
| `prUrl` | String | |
| `session` | ObjectId → `WorkSession` | |
| `source` | String | default `"claude"`; `"web"` from the dashboard `POST`; `"claude-ai"` from the claude.ai connector. Not enum-validated. |
| `completedAt` | Date | Managed by `resolveCompletedAt`, never set directly |

Indexes:

- `{ project: 1, createdAt: -1 }`
- `{ status: 1, createdAt: -1 }`
- `{ project: 1, groupKey: 1, createdAt: -1 }`
- `{ session: 1, title: 1 }` — unique, partial on `session: { $type: "objectId" }`

That last index is what makes re-logging the same title inside one session an update rather
than a near-duplicate. The filter is `$type: "objectId"` and **not** `$exists: true` because an
explicit `session: null` satisfies `$exists`, which would collide every session-less entry
sharing a title.

## `WorkSession` — [lib/models/WorkSession.ts](../../lib/models/WorkSession.ts)

| Field | Type | Notes |
|---|---|---|
| `sessionId` | String | required, unique. Claude Code's own session id, supplied by the caller. |
| `project` | ObjectId → `WorkProject` | |
| `status` | String | enum `WORK_SESSION_STATUSES` = `active` \| `ended`, default `active` |
| `startedAt` | Date | default now |
| `lastActivityAt` | Date | default now, bumped by `touchSession` |
| `endedAt` | Date | |
| `summary` | String | |
| `entryCount` | Number | default 0, recounted by `syncSessionEntryCount` |

Index: `{ lastActivityAt: -1 }`.

There is no `start_session` tool — passing a `session_id` to `log_work` creates the session.

## `WorkAttachment` — [lib/models/WorkAttachment.ts](../../lib/models/WorkAttachment.ts)

A link hung off a project or an entry (artifact, PR, deploy preview, commit…).

| Field | Type | Notes |
|---|---|---|
| `ref` | Number | required, unique. From `nextSeq("workAttachment")`. |
| `project` | ObjectId → `WorkProject` | required |
| `entry` | ObjectId → `WorkEntry` | optional |
| `kind` | String | enum `WORK_ATTACHMENT_KINDS`, default `link` |
| `label` | String | required, trimmed |
| `group` / `groupKey` | String | inherited from the entry unless given |
| `url` | String | required, trimmed |

Indexes: `{ project: 1, createdAt: -1 }`, `{ entry: 1, createdAt: -1 }`,
`{ project: 1, groupKey: 1, createdAt: -1 }`, and a unique partial `{ entry: 1, url: 1 }` on
`entry: { $type: "objectId" }`, so re-attaching the same URL to one entry updates it.

## `Counter` — [lib/models/Counter.ts](../../lib/models/Counter.ts)

`{ _id: String, seq: Number }`. No timestamps. `nextSeq(name)` does an upserting `$inc` and
returns the new value, which is what issues `WorkEntry.ref` (`"workEntry"`) and `WorkAttachment.ref` (`"workAttachment"`).
