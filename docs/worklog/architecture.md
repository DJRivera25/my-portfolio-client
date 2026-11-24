# architecture

## Layers

```
lib/worklog/          all business logic
  types.ts       pure    vocabulary, status enums, digest/page types (no mongoose)
  report.ts      pure    reportFromCounts (turns Mongo count rows into a digest)
  format.ts      pure    text rendering for MCP responses (formatEntryPage, formatReport)
  status.ts      pure    resolveCompletedAt, resolveWaitingOn
  slug.ts        pure    slugifyProject, projectMatchKey, groupKey, deriveProjectName
  since.ts       pure    parseSince / parseUntil ("7d" / "24h" / ISO)
  filters.ts     pure    entryQueryFrom (Mongo query), parseEntryQuery (dashboard params)
  repo.ts        pure    normaliseRepoUrl, storableRepo, repoNameKey
  attachments.ts pure    attachment kind / label detection
  entries.ts     query   logWork, listWorkEntries (paged), updateWorkEntryStatus, setWorkEntryGroup, deleteWorkEntries, buildReport
  projects.ts    query   resolveWorkProject, findWorkProjectByRepo, setWorkProjectStatus, listWorkProjects
  sessions.ts    query   touchSession, endSession, getSessionStatus, syncSessionEntryCount
  groups.ts / attachmentQueries.ts / dashboard.ts   query shells (groups, attachments, first-paint payload)
scripts/worklog-hooks/  SessionStart hook source, copied to ~/.claude/hooks by install.mjs
        ↑                              ↑
app/api/mcp/                  app/api/worklog/
(Claude Code adapter)         (dashboard adapter)
```

Two adapters, one service layer. Neither adapter contains business logic — they authorize,
parse arguments, call `lib/worklog/*`, and shape a response.

## Why the pure/query split

The pure modules import neither `mongoose` nor `@/lib/db`. That is deliberate:
[`lib/db.ts`](../../lib/db.ts) throws at **module scope** when `MONGODB_URI` is unset, so any
test that transitively imported it would die on import rather than fail a useful assertion.

Keeping aggregation, formatting, slug derivation, `since` parsing, and `completedAt`
resolution free of database imports is what lets [testing.md](./testing.md) run with no
database and no mocks.

## Data flow — logging work

1. Claude Code calls the `log_work` MCP tool with snake_case arguments.
2. `app/api/mcp/route.ts` calls `mcpClientFor(req)` (`MCP_TOKEN` → `claude-code`, `MCP_CLAUDE_AI_TOKEN` → `claude-ai`; an unset token denies) and records the client on `req.auth`.
3. `resolveWorkProject(key)` derives a separator-free `matchKey` and upserts the project.
4. `touchSession(session_id, projectId)` creates or bumps the session.
5. `logWork(...)` writes the `WorkEntry` (`source` `claude-ai` for the claude.ai client), taking a short `ref` from `nextSeq()`.
6. `resolveCompletedAt(...)` decides whether to stamp, clear, or preserve `completedAt`; `resolveWaitingOn(...)` does the same for `waitingOn`.
7. `syncSessionEntryCount(...)` recounts the session's entries.
8. `formatEntries(...)` renders text back to the model.

## Data flow — listing and reporting

`list_work` and `GET /api/worklog/entries` both end in `listWorkEntries`, which resolves `project` (or `repo` via `findWorkProjectByRepo`, or `session_id`) to an id, builds the Mongo query with `entryQueryFrom`, and returns a page `{ entries, total, offset, project, unmatched }`. MCP renders it with `formatEntryPage`; the dashboard route returns `{ entries, total, offset }`. `buildReport` aggregates counts in Mongo and hands them to `reportFromCounts`.

## Hook

The SessionStart hook is a client of the MCP surface, not part of the service layer: it calls `list_work` with `{ repo }` or `{ project }`, `status: "open"`, `limit: 10`. See [gotchas.md](./gotchas.md).

## Project identity

`slug` is the display spelling; **`matchKey` is the identity**. `projectMatchKey` strips every
separator and lowercases, so `Tools Australia`, `tools-australia`, `toolsaustralia`, and
`tools_australia` all resolve to one project. Lookups use `matchKey`; the first spelling seen
becomes the slug.

This exists because a model typing a key from memory would otherwise fork a project's history
in two, and nothing would look wrong until a report was quietly missing half its entries.

## Short refs

`Counter` + [`nextSeq()`](../../lib/models/Counter.ts) issue sequential integers. MCP hands ids
to Claude as text and takes them back as arguments — a 24-char ObjectId hex is easy to garble,
`#42` is not.
