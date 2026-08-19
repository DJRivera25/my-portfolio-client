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

## `/api/users` — **currently unauthenticated**

[`app/api/users/route.ts`](../../app/api/users/route.ts) exports `GET`, `POST`, `PUT`, and
`DELETE`. **None of them call `isAuthorizedAdmin`.**

| Method | Behaviour | Problem |
|---|---|---|
| `GET` | `User.find()` → full documents | Returns the bcrypt `password` hash for every user |
| `POST` | `User.create(req.json())` | Anyone can create an admin — `role` defaults to `"admin"` |
| `PUT` | `findByIdAndUpdate(id, update)` | Unrestricted field update, including `role` and `password` |
| `DELETE` | `findByIdAndDelete(id)` | Anyone can delete any user |

This is the single largest security gap in the repo. Both project rules it violates —
"admin auth on protected routes" and "don't leak password hashes" — are documented in
[rules.md](./rules.md), and the fix is described there.
