# frontend

The private dashboard at `/worklog`. Gated client-side; the data it reads is gated
server-side by `isAuthorizedAdmin` on every `/api/worklog/*` route.

## Page

[`app/worklog/page.tsx`](../../app/worklog/page.tsx) owns the fetching and shared state and
composes the components below. It reads through
[`src/lib/api/worklog.ts`](../../src/lib/api/worklog.ts) — never Mongoose directly, per the
project's layering rule.

### Data flow

- **First paint:** one `fetchDashboard()` (`GET /api/worklog/dashboard`) gives projects, sessions,
  attachments, groups, the first page of entries (300) and `entryTotal`.
- **Filters:** project card, group chip, status (list view only — every status is a board column),
  search text, waiting-on, From and To. Any change re-asks `GET /api/worklog/entries` with the
  filter at offset 0; the server filters, nothing is filtered in memory.
- **Debounce:** text and waiting-on are debounced 300 ms (`DEBOUNCE_MS`); the other filters apply
  at once.
- **Dates:** From/To are `YYYY-MM-DD` inputs converted by `startOfLocalDay` to the viewer's
  local-midnight ISO instants (To plus one day, exclusive), not bare dates — see
  [gotchas.md](./gotchas.md).
- **Load more:** shown while `entries.length < total`; asks for the next page at
  `offset = entries.length` using `loadedFilter` (the filter the loaded entries belong to, even if
  a newer one is still debouncing) and appends, de-duplicating by `_id`.
- **Ordering guard:** every entries response checks it is still the newest request (`entrySeq`)
  before landing; the report has its own (`reportSeq`).
- **Report:** `fetchWorkReport` → `GET /api/worklog/report`, scoped by the selected project and
  report window (default `7d`); refetched after a status change. It is server-computed, so it
  covers every entry, not just the loaded page.
- **Status change:** optimistic, reconciled from the `PATCH` response; on failure the entries are
  reloaded and an update error is shown.
- **Errors:** one slot per request kind (`update`, `entries`, `report`, `dashboard`), de-duplicated
  into a single `role="alert"` banner, so one success cannot clear another source's failure.
- **Views:** `board` (default) or `list`, from `VIEW_MODES`.

## Components — `src/components/worklog/`

| Component | Shows |
|---|---|
| `WorkProjectCards.tsx` | Per-project overview and status; selecting one scopes entries, groups and the report |
| `WorkEntryFilters.tsx` | Search, waiting-on, From and To inputs (controlled by the page via `WorkEntryFilterValue`) |
| `WorkBoard.tsx` | Kanban view: one column per status, with attachment chips |
| `WorkEntryList.tsx` | The entry feed with status controls and attachment chips |
| `WorkReportPanel.tsx` | The rendered digest and its window selector |
| `WorkSessionStrip.tsx` | Active and recent sessions |

## Static config and types

[`src/config/worklog.ts`](../../src/config/worklog.ts) holds the labels, status vocabulary and
display copy (including `searchPlaceholder`, `waitingOnPlaceholder`, `fromLabel`, `toLabel`,
`loadMore`, `loadError`, `updateError`). Types are in
[`src/types/worklog.ts`](../../src/types/worklog.ts) (`DashboardPayload` with `entryTotal`,
`WorkEntryPage`, `WorkEntryFilterValue`).

Per the project convention, strings belong in the config module, not inline in JSX.

## Known gap

Attachment chips come from the dashboard's newest-200 attachment list only; entries reached by
filters or Load more may show none. See [gotchas.md](./gotchas.md).

## No publish controls

The dashboard has no publish/unpublish affordance, because there is nothing to publish to. The
worklog is entirely private — see [rules.md](./rules.md).
