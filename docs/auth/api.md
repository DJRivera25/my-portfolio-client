# api

## `POST /api/auth/login`

Unauthenticated by necessity. Body: `{ email, password }`.

| Status | Body | When |
|---|---|---|
| `200` | `{ user: { email, role: "admin" }, token }` | Both env vars set and both values match |
| `500` | `{ "message": "Server misconfiguration" }` | `ADMIN_EMAIL` or `ADMIN_PASSWORD` unset |
| `403` | `{ "message": "Unauthorized access" }` | Credentials do not match |

Also sets an `httpOnly` `token` cookie that no code reads.

Notes:

- The failure status is `403`, not `401` — sibling routes use `401` via `unauthorizedResponse()`.
- The comparison is `===` on both fields, so it is not constant-time.
- The response body echoes the submitted `email` rather than a stored user record.

## `/api/users` — admin-gated, password never returned

[`app/api/users/route.ts`](../../app/api/users/route.ts) exports `GET`, `POST`, `PUT`, and
`DELETE`. Each starts with `isAuthorizedAdmin(req)` → `401 {"message":"Unauthorized"}`, and every
read-back uses `.select("-password")` (`SAFE_FIELDS`). Nothing in the app calls this endpoint.

| Method | Behaviour |
|---|---|
| `GET` | `User.find().select("-password")` |
| `POST` | `User.create(body)`; returns the created user without `password` (`201`) |
| `PUT` | body `{ id, ...update }` → `findByIdAndUpdate`; `404 {"message":"User not found"}` if absent |
| `DELETE` | body `{ id }` → `findByIdAndDelete`; `404 {"message":"User not found"}` if absent |

Remaining caveats: `PUT` passes the body straight to `findByIdAndUpdate`, so it can set `role` or
`password`, and an update query does not run the `pre("save")` hash hook, so a `password` set this
way would be stored as given (_TODO: verify against a real update._). `POST` creates users whose
`role` defaults to `"admin"`.
