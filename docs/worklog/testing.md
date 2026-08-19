# testing

```bash
npm test           # vitest run
npm run test:watch # vitest
```

## What runs

`vitest.config.mts` sets `environment: "node"` and `include: ["lib/**/*.test.ts"]`. The suites
in this domain are the only tests in the repo:

| File | Covers |
|---|---|
| [`lib/worklog/format.test.ts`](../../lib/worklog/format.test.ts) | `formatDuration`, `formatReport`, `formatEntries` |
| [`lib/worklog/report.test.ts`](../../lib/worklog/report.test.ts) | `aggregateReport` |
| [`lib/worklog/since.test.ts`](../../lib/worklog/since.test.ts) | `parseSince` — `"7d"`, `"24h"`, ISO, junk |
| [`lib/worklog/status.test.ts`](../../lib/worklog/status.test.ts) | `resolveCompletedAt` stamp / clear / preserve |

40 tests across the four files, all passing as of 2026-08-19.

`lib/worklog/public.test.ts` used to guard a public field allowlist. It was deleted along with the
feed it protected — see [gotchas.md](./gotchas.md).

## No database, no mocks

Every tested module is in the pure layer, so the suite imports nothing that reaches for
`MONGODB_URI`. That is the whole point of the split described in
[architecture.md](./architecture.md) — a test file needs no fixture database and no mongoose
mock, and a stray `@/lib/db` import in a pure module breaks the suite immediately.

## What is not covered

- `entries.ts`, `projects.ts`, `sessions.ts` — the query shells. No integration test harness
  exists.
- The MCP tool registrations in `app/api/mcp/tools.ts`.
- Every route handler under `app/api/worklog/`.
- All dashboard components. `environment: "node"` means there is no jsdom; the
  `@testing-library/*` packages in `package.json` are CRA leftovers and are not wired.

Adding a component test means widening the `include` glob and configuring a DOM environment
first.
