# worklog

Work tracking that Claude Code writes to over MCP, from any project on any machine. Entries
and tasks by project, session status, and reports — with a private dashboard at `/worklog`.

| Doc | What's in it |
|---|---|
| [architecture.md](./architecture.md) | The pure-core / query-shell split, and why it exists |
| [api.md](./api.md) | `/api/mcp` tools and the `/api/worklog/*` dashboard routes |
| [models.md](./models.md) | `WorkProject`, `WorkEntry`, `WorkSession`, `Counter` |
| [frontend.md](./frontend.md) | The `/worklog` dashboard components |
| [rules.md](./rules.md) | Hard constraints — auth, purity, project identity |
| [gotchas.md](./gotchas.md) | Index rebuilds, HMR schema staleness, the in-flight public-feed removal |
| [testing.md](./testing.md) | What the vitest suite covers and why it needs no database |

## What this domain owns

The service layer in `lib/worklog/`, the four Mongoose models backing it, both HTTP adapters
(`/api/mcp` for Claude Code, `/api/worklog/*` for the dashboard), the dashboard UI under
`app/worklog/` and `src/components/worklog/`, and `scripts/worklog-reset.mjs`.

## Setup

### 1. Set `MCP_TOKEN`

A long random secret, separate from `ADMIN_API_TOKEN` so it can be revoked without losing
dashboard access. **It has no default: if unset, `/api/mcp` denies every request.**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Put it in `.env.local` for development and in the Vercel project's environment variables for
production.

### 2. Connect Claude Code

```bash
claude mcp add --transport http worklog https://<your-site>/api/mcp \
  --header "Authorization: Bearer $MCP_TOKEN"
```

Verify with `/mcp` inside Claude Code — the `worklog` server should list its tools.

## Commands

```bash
npm test             # service-layer tests
npm run type-check   # tsc --noEmit
node --env-file=.env.local scripts/worklog-reset.mjs   # drop worklog collections + indexes
```

## Related domains

- [auth](../auth/README.md) — `isAuthorizedMcp` and `isAuthorizedAdmin` both live there
- [portfolio-content](../portfolio-content/README.md) — `WorkProject.portfolioProject` optionally
  references a `Project` case study
