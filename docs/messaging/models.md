# models

## `Message` — [lib/models/Message.ts](../../lib/models/Message.ts)

| Field | Type | Notes |
|---|---|---|
| `name` | String | required |
| `email` | String | required. The visitor's address — not validated beyond presence. |
| `content` | String | required |
| `hasViewed` | Boolean | default `false`. Drives the inbox badge. |

`{ timestamps: true }`, `models.Message || model("Message", …)`.

No indexes beyond the default `_id`. `GET /api/messages` sorts on `createdAt` without one; that
is fine at this collection's size and would want an index if it grew.

Nothing is unique, so a visitor can submit the same message repeatedly up to the rate limit.
