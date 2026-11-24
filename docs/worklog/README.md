# worklog

Work tracking that Claude Code writes to over MCP, from any project on any machine. Entries
and tasks by project, session status, and reports — with a private dashboard at `/worklog`.

| Doc | What's in it |
|---|---|
| [architecture.md](./architecture.md) | The pure-core / query-shell split, and why it exists |
| [api.md](./api.md) | `/api/mcp` tools and the `/api/worklog/*` dashboard routes |
| [models.md](./models.md) | `WorkProject`, `WorkEntry`, `WorkSession`, `WorkAttachment`, `Counter` |
| [frontend.md](./frontend.md) | The `/worklog` dashboard components |
| [rules.md](./rules.md) | Hard constraints — auth, purity, project identity |
| [gotchas.md](./gotchas.md) | Hook project resolution, repo self-heal, the 200-attachment gap, `until` semantics, index rebuilds, the public-feed removal |
| [testing.md](./testing.md) | What the vitest suite covers and why it needs no database |

## What this domain owns

The service layer in `lib/worklog/`, the five Mongoose models backing it, both HTTP adapters
(`/api/mcp` for Claude Code and claude.ai, `/api/worklog/*` for the dashboard), the dashboard UI under
`app/worklog/` and `src/components/worklog/`, the SessionStart hook source in
`scripts/worklog-hooks/`, and `scripts/worklog-reset.mjs`.

## Setup

### 1. Set `MCP_TOKEN`

A long random secret, separate from `ADMIN_API_TOKEN` so it can be revoked without losing
dashboard access. **It has no default: if unset, Claude Code is denied; `/api/mcp` is closed to everyone only when `MCP_CLAUDE_AI_TOKEN` is unset too.**

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

### 3. Optional: the claude.ai connector

Set `MCP_CLAUDE_AI_TOKEN` (its own value, generated the same way; see `.env.example`) and add a custom
connector at `https://<your-site>/api/mcp` with the request header `Authorization: Bearer <value>`.
Its writes are stamped `source: "claude-ai"`.

### 4. Optional: the session-start hook

`node scripts/worklog-hooks/install.mjs` copies the hook into `~/.claude/hooks/` (it does not edit any
settings file). How it picks a project: [gotchas.md](./gotchas.md).

## Commands

```bash
npm test             # service-layer tests
npm run test:hooks   # hook helper tests (node --test)
npm run type-check   # tsc --noEmit
node --env-file=.env.local scripts/worklog-reset.mjs   # drop worklog collections + indexes
```

## Related domains

- [auth](../auth/README.md) — `isAuthorizedMcp` and `isAuthorizedAdmin` both live there
- [portfolio-content](../portfolio-content/README.md) — `WorkProject.portfolioProject` optionally
  references a `Project` case study
