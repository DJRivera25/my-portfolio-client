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

[`lib/auth.ts`](../../lib/auth.ts) exports these functions (plus the `McpClient` type):

| Function | Comparison | Fallback |
|---|---|---|
| `getBearerToken(req)` | Parses `Authorization: Bearer …` | — |
| `isAuthorizedAdmin(req)` | `token === ADMIN_API_TOKEN` — plain `===` | `"admin-static-token"` |
| `mcpClientFor(req)` | `timingSafeEqual` after a length check, against `MCP_TOKEN` then `MCP_CLAUDE_AI_TOKEN` | **none** — an unset token never matches |
| `isAuthorizedMcp(req)` | `mcpClientFor(req) !== null` | **none** |

### MCP clients

`McpClient = "claude-code" | "claude-ai"`. `mcpClientFor` returns which client a bearer token belongs to, or `null` to deny. Each client has its own secret so claude.ai can be revoked without touching Claude Code. Both secrets are always compared (no early return between them) so timing does not reveal which one matched; a token whose length differs from a secret fails that comparison without `timingSafeEqual`, and an unset secret never matches.

[`app/api/mcp/route.ts`](../../app/api/mcp/route.ts) calls `mcpClientFor`, answers `401 {"error":"Unauthorized"}` on `null`, and otherwise sets `req.auth = { token: "", clientId: <client>, scopes: [] }` — the real token is deliberately not passed on. The worklog tools read `clientId` to stamp entry `source` `"claude-ai"` (see [worklog/api.md](../worklog/api.md)). Tests: [`lib/auth.test.ts`](../../lib/auth.test.ts).

`unauthorizedResponse()` returns `401 {"message":"Unauthorized"}`.

There is **no middleware**. Authorization is per handler, so a new handler is public until
someone adds the check. See [rules.md](./rules.md).

## Client-side gating

[`ProtectedRoute`](../../src/components/ProtectedRoute.tsx) checks for the presence of a
`localStorage` token in a `useEffect` and redirects to `/login` if absent, rendering a spinner
until it resolves. It is **presentation only** — it proves nothing to the server, and the data
behind it is protected by the handler check, not by this component.
