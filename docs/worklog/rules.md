# rules

## Auth

- **`/api/mcp` uses `MCP_TOKEN`, never `ADMIN_API_TOKEN`.** They are separate credentials so the
  one sitting on a machine that runs Claude Code can be revoked without losing dashboard access.
- **`MCP_TOKEN` must never gain a default value.** `isAuthorizedMcp` denies when it is unset.
  This is the opposite of `isAuthorizedAdmin`, which falls back to a guessable literal — do not
  "make them consistent" by giving `MCP_TOKEN` a fallback.
- `isAuthorizedMcp` compares with `timingSafeEqual` after a length check. Keep it that way.
- **Every `/api/worklog/*` route starts with `isAuthorizedAdmin(req)`.** No exceptions.

## The pure layer stays pure

`types.ts`, `report.ts`, `format.ts`, `status.ts`, `slug.ts`, and `since.ts` **must not import
`mongoose` or `@/lib/db`**. `lib/db.ts` throws at module scope without `MONGODB_URI`, so one
such import takes the whole test suite down on import.

If a new helper needs the database, it belongs in `entries.ts`, `projects.ts`, or `sessions.ts`.

## Project identity

- **Look projects up by `matchKey`, never by `slug` or `name`.** `projectMatchKey` strips
  separators and lowercases; `slug` is only the display spelling.
- Projects create themselves on first `log_work`. Do not add a registration step.

## Entries

- **Never set `completedAt` directly.** Go through `resolveCompletedAt`, which stamps on
  entering `done`, clears on leaving it, and preserves the original timestamp when an
  already-done entry is touched again.
- **Do not change the `(session, title)` partial index filter to `$exists: true`.** An explicit
  `session: null` satisfies `$exists`, which would collide every session-less entry that shares
  a title.
- `ref` comes from `nextSeq()`. Do not expose ObjectIds to MCP callers.

## Layering

- Route handlers authorize, parse, delegate, and shape a response. Business logic lives in
  `lib/worklog/`.
- Dashboard components fetch through `src/lib/api/worklog.ts`. No component touches Mongoose.
