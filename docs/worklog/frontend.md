# frontend

The private dashboard at `/worklog`. Gated client-side; the data it reads is gated
server-side by `isAuthorizedAdmin` on every `/api/worklog/*` route.

## Page

[`app/worklog/page.tsx`](../../app/worklog/page.tsx) owns the fetching and shared state, and
composes the four components below. It reads through
[`src/lib/api/worklog.ts`](../../src/lib/api/worklog.ts) — never Mongoose directly, per the
project's layering rule.

## Components — `src/components/worklog/`

| Component | Shows |
|---|---|
| `WorkSessionStrip.tsx` | Active and recent sessions, from `GET /api/worklog/sessions` |
| `WorkProjectCards.tsx` | Per-project overview and status, from `GET /api/worklog/projects` |
| `WorkEntryList.tsx` | The entry feed with status controls, from `GET /api/worklog/entries` |
| `WorkReportPanel.tsx` | The rendered digest, from `GET /api/worklog/report` |

## Static config

[`src/config/worklog.ts`](../../src/config/worklog.ts) holds the labels, status vocabulary, and
display copy. Types are in [`src/types/worklog.ts`](../../src/types/worklog.ts).

Per the project convention, strings belong in the config module, not inline in JSX.

## No publish controls

The dashboard has no publish/unpublish affordance, because there is nothing to publish to. The
worklog is entirely private — see [rules.md](./rules.md).
