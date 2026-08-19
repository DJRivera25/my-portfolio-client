# architecture

## Layers

```
lib/worklog/          all business logic
  types.ts            vocabulary + status enums (no mongoose — keeps the pure layer testable)
  report.ts   pure    aggregateReport
  format.ts   pure    text rendering for MCP responses
  status.ts   pure    resolveCompletedAt
  slug.ts     pure    slugifyProject, projectMatchKey, deriveProjectName
  since.ts    pure    "7d" / "24h" / ISO parsing
  entries.ts  query   logWork, listWorkEntries, updateWorkEntryStatus, buildReport
  projects.ts query   resolveWorkProject, setWorkProjectStatus, listWorkProjects
  sessions.ts query   touchSession, endSession, getSessionStatus, syncSessionEntryCount
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
2. `app/api/mcp/route.ts` checks `isAuthorizedMcp(req)`; an unset `MCP_TOKEN` denies here.
3. `resolveWorkProject(key)` derives a separator-free `matchKey` and upserts the project.
4. `touchSession(session_id, projectId)` creates or bumps the session.
5. `logWork(...)` writes the `WorkEntry`, taking a short `ref` from `nextSeq()`.
6. `resolveCompletedAt(...)` decides whether to stamp, clear, or preserve `completedAt`.
7. `syncSessionEntryCount(...)` recounts the session's entries.
8. `formatEntries(...)` renders text back to the model.

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
