# auth

Single-admin authentication. One shared static token, checked per route handler. There is no
multi-user login, no session store, and — despite the `@types/jsonwebtoken` entry in
`package.json` — **no JWT**.

| Doc | What's in it |
|---|---|
| [architecture.md](./architecture.md) | The real login flow, end to end |
| [api.md](./api.md) | `POST /api/auth/login`, and the admin-gated `/api/users` |
| [models.md](./models.md) | `User` — and why the login flow never touches it |
| [frontend.md](./frontend.md) | `AuthContext`, `ProtectedRoute`, `AdminBar`, the axios client |
| [rules.md](./rules.md) | What must hold when you touch auth |
| [testing.md](./testing.md) | `lib/auth.test.ts` — what the MCP token tests cover, and what is deliberately untested |
| [gotchas.md](./gotchas.md) | The dead cookie, the dead `User` model, the `/api/users` collection that login ignores |

## What this domain owns

`lib/auth.ts`, `lib/models/User.ts`, `app/api/auth/**`, `app/api/users/**`, `app/login/**`,
`src/context/AuthContext.tsx`, `src/components/ProtectedRoute.tsx`,
`src/components/AdminBar.tsx`, and `src/lib/api/client.ts`.

## Environment variables

| Var | Used by | Behaviour if unset |
|---|---|---|
| `ADMIN_EMAIL` | `POST /api/auth/login` | `500 {"message":"Server misconfiguration"}` |
| `ADMIN_PASSWORD` | `POST /api/auth/login` | `500 {"message":"Server misconfiguration"}` |
| `ADMIN_API_TOKEN` | `isAuthorizedAdmin`, login response | **Falls back to the literal `"admin-static-token"`** |
| `MCP_TOKEN` | `mcpClientFor` → `"claude-code"` | Claude Code is denied (no default, by design) |
| `MCP_CLAUDE_AI_TOKEN` | `mcpClientFor` → `"claude-ai"` | claude.ai is denied (no default, by design) |

## Related domains

- [worklog](../worklog/README.md) — the only consumer of `mcpClientFor` / `isAuthorizedMcp` (`app/api/mcp/route.ts`)
- [shared-ui](../shared-ui/README.md) — `AdminBar` renders from the root layout
