# api

## `GET /api/messages`

Admin only. Returns every message sorted `createdAt: -1`.

| Status | Body |
|---|---|
| `200` | `Message[]`, newest first |
| `401` | `{ "message": "Unauthorized" }` |

## `POST /api/messages` — public

The only unauthenticated route in this domain. Body: `{ name, email, content }`.

Order of operations: rate-limit check → `dbConnect()` → `Message.create` → `sendMail`.

| Status | Meaning |
|---|---|
| `201` | Stored (and mail attempted) |
| `429` | More than 3 submissions from this IP in 10 minutes |
| `500` | `sendMail` threw — most often `EMAIL_USER` / `EMAIL_PASS` unset |

## `PUT /api/messages`, `DELETE /api/messages`

Admin only. Both take `{ id, ...update }` / `{ id }` in the JSON body, consistent with the other
collection routes in this repo.

## `PATCH /api/messages/[id]/viewed`

Admin only. Sets `hasViewed: true`.

| Status | Body |
|---|---|
| `200` | The updated `Message` |
| `401` | `{ "message": "Unauthorized" }` |
| `404` | `{ "message": "Message not found" }` |

The same file also exports `GET`, `POST`, and `DELETE` handlers that return
`405 { "message": "Method Not Allowed" }`. They exist to make the method surface explicit rather
than letting Next.js return its own 405.
