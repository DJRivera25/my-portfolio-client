# testing

```bash
npm test             # vitest run (lib/**/*.test.ts)
npm run test:watch   # vitest
npm run test:hooks   # node --test scripts/worklog-hooks/worklog-hook-lib.test.mjs
```

Run them from PowerShell in an **uppercase** `C:\...` working directory — a lowercase `c:` makes
every vitest suite fail with `Cannot read properties of undefined (reading 'config')` (see
[gotchas.md](./gotchas.md)).

## What runs

`vitest.config.mts` sets `environment: "node"` and `include: ["lib/**/*.test.ts"]`. Worklog suites:

| File | Covers |
|---|---|
| [`lib/worklog/format.test.ts`](../../lib/worklog/format.test.ts) | `formatDuration`, `formatReport` (incl. the 15-blocker cap), `formatEntries` (waiting-on line, project suffix), `formatPageFooter`, `formatEntryPage` (unmatched project / repo / session, empty, offset past end) |
| [`lib/worklog/report.test.ts`](../../lib/worklog/report.test.ts) | `reportFromCounts` — totals, status and project splits, ordering, blockers pass-through |
| [`lib/worklog/since.test.ts`](../../lib/worklog/since.test.ts) | `parseSince` and `parseUntil` (bare date → next UTC midnight) |
| [`lib/worklog/status.test.ts`](../../lib/worklog/status.test.ts) | `resolveCompletedAt`, `resolveWaitingOn`, `slugifyProject`, `projectMatchKey`, `groupKey`, `deriveProjectName` |
| [`lib/worklog/filters.test.ts`](../../lib/worklog/filters.test.ts) | `entryQueryFrom` (open expansion, text/waiting-on regex escaping, since/until bounds) and `parseEntryQuery` (defaults, rejects) |
| [`lib/worklog/repo.test.ts`](../../lib/worklog/repo.test.ts) | `normaliseRepoUrl`, `storableRepo`, `repoNameKey` — credentials never leak |
| [`lib/worklog/attachments.test.ts`](../../lib/worklog/attachments.test.ts) | `detectAttachmentKind`, `deriveAttachmentLabel`, `isProbablyUrl` |
| [`lib/auth.test.ts`](../../lib/auth.test.ts) | `mcpClientFor` / `isAuthorizedMcp` — owned by [auth](../auth/README.md) |

Counts from a full `npx vitest run` on 2026-11-24 (10 files, 151 tests, all passing; the other two
files are `cloudinary` and `screenshot`): format 24, report 7, since 11, status 21, filters 13,
repo 22, attachments 26, auth 4.

### Hook helpers — `npm run test:hooks`

[`scripts/worklog-hooks/worklog-hook-lib.test.mjs`](../../scripts/worklog-hooks/worklog-hook-lib.test.mjs)
runs under Node's built-in test runner (not vitest — the glob is `lib/**/*.test.ts` only). 12
tests, all passing on 2026-11-24: `normaliseRepoUrl` parity, `callTool` (reply text, error cases,
timeout), `readServerConfig` (URL override), `mainCheckoutName`, `projectLookup`, `capLines`,
`parseHookInput`.

## No database, no mocks

Every tested module is in the pure layer, so the suite imports nothing that reaches for
`MONGODB_URI`. That is the whole point of the split described in
[architecture.md](./architecture.md) — a test file needs no fixture database and no mongoose
mock, and a stray `@/lib/db` import in a pure module breaks the suite immediately.

## What is not covered

- `entries.ts`, `projects.ts` (including `findWorkProjectByRepo` and the self-heal write),
  `sessions.ts`, `groups.ts`, `attachmentQueries.ts`, `dashboard.ts` — the query shells. No
  integration test harness exists.
- The MCP tool registrations in `app/api/mcp/tools.ts` and `app/api/mcp/route.ts` (`req.auth`).
- Every route handler under `app/api/worklog/`.
- `worklog-context.mjs` and `install.mjs` end to end — verified by hand (dry run piping a `cwd`
  into the script), not by a test.
- All dashboard components and `app/worklog/page.tsx` (debounce, Load more, request ordering).
  `environment: "node"` means there is no jsdom; the `@testing-library/*` packages in
  `package.json` are CRA leftovers and are not wired.

Adding a component test means widening the `include` glob and configuring a DOM environment
first.
