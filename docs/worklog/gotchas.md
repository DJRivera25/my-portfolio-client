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
