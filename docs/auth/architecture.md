# architecture

## The login flow, as it actually works

1. The admin submits email + password from [`app/login/`](../../app/login/).
2. [`POST /api/auth/login`](../../app/api/auth/login/route.ts) compares them **as plaintext
   string equality** against `process.env.ADMIN_EMAIL` and `process.env.ADMIN_PASSWORD`.
3. On a match the handler responds with `{ user: { email, role: "admin" }, token }` where
   `token` is `process.env.ADMIN_API_TOKEN || "admin-static-token"`.
4. It also sets an `httpOnly` `token` cookie (`sameSite: "lax"`, `secure` in production,
   1-week `maxAge`). **Nothing ever reads that cookie** — see [gotchas.md](./gotchas.md).
5. `AuthContext.login(token)` puts the token in `localStorage` under the key `token`.
6. [`src/lib/api/client.ts`](../../src/lib/api/client.ts) attaches
   `Authorization: Bearer <token>` to every axios request via a request interceptor.
7. Each protected route handler calls `isAuthorizedAdmin(req)`, which compares the bearer
   token against `ADMIN_API_TOKEN`.

The consequence worth stating plainly: **the token the browser stores is the server's admin
secret itself.** It is not derived from it, not signed, and not scoped to a session — so it
never expires and cannot be revoked for one client without rotating the secret for all of them.

## Server-side authorization

[`lib/auth.ts`](../../lib/auth.ts) exports three functions:

| Function | Comparison | Fallback |
|---|---|---|
| `getBearerToken(req)` | Parses `Authorization: Bearer …` | — |
| `isAuthorizedAdmin(req)` | `token === ADMIN_API_TOKEN` — plain `===` | `"admin-static-token"` |
| `isAuthorizedMcp(req)` | `timingSafeEqual` after a length check | **none** — unset denies |

`unauthorizedResponse()` returns `401 {"message":"Unauthorized"}`.

There is **no middleware**. Authorization is per handler, so a new handler is public until
someone adds the check. See [rules.md](./rules.md).

## Client-side gating

[`ProtectedRoute`](../../src/components/ProtectedRoute.tsx) checks for the presence of a
`localStorage` token in a `useEffect` and redirects to `/login` if absent, rendering a spinner
until it resolves. It is **presentation only** — it proves nothing to the server, and the data
behind it is protected by the handler check, not by this component.
