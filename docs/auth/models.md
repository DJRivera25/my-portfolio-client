# models

## `User` — [lib/models/User.ts](../../lib/models/User.ts)

| Field | Type | Notes |
|---|---|---|
| `name` | String | |
| `email` | String | required, **unique** |
| `password` | String | required. bcrypt hash, cost 10. |
| `role` | String | enum `["user", "admin"]`, **default `"admin"`** |

`{ timestamps: true }`, `models.User || model("User", …)`.

### Hooks and methods

- `pre("save")` — hashes `password` with a fresh salt at cost 10 whenever the field is modified.
  Guarded by `isModified("password")`, so re-saving a document does not double-hash.
- `comparePassword(candidate)` — instance method wrapping `bcrypt.compare`.

### This model is not part of the login flow

`POST /api/auth/login` compares against `ADMIN_EMAIL` / `ADMIN_PASSWORD` environment variables
and never queries `User`. **`comparePassword` is defined but never called anywhere in the
repo**, and the `pre("save")` hook only fires through the unauthenticated `/api/users` routes.

So the collection exists, its documents carry real bcrypt hashes, and nothing authenticates
against them. Two consequences:

- The bcrypt machinery is not protecting a login path — it is protecting data that only the
  open `/api/users` endpoint writes.
- `role` defaulting to `"admin"` is harmless only because no code reads `role` for
  authorization. If a future change starts trusting `role`, that default becomes a
  privilege-escalation bug.

See [gotchas.md](./gotchas.md).
