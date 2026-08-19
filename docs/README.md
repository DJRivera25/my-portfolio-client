# Documentation

One folder per domain in the [Domain Manifest](../CLAUDE.md#domain-manifest). Docs are
code-grounded: every claim cites a file, and anything unverifiable from the source is marked
`_TODO: verify._` rather than guessed.

## Domains

| Domain | Files | What it is |
|---|---|---|
| [worklog](./worklog/README.md) | 34 | Work tracking Claude Code writes over MCP. Pure core + query shells, two HTTP adapters, private dashboard. |
| [retired-ui](./retired-ui/README.md) | 30 | Pre-Atelier components and CRA scaffolding. **Unreachable from every entry point** — deletion candidates. |
| [atelier-redesign](./atelier-redesign/README.md) | 21 | "The Build Log" single-page home and the Atelier design system. |
| [portfolio-content](./portfolio-content/README.md) | 15 | Projects, tools, socials, resume — models and HTTP surface. |
| [auth](./auth/README.md) | 8 | Single-admin bearer-token auth. No JWT, no session store. |
| [shared-ui](./shared-ui/README.md) | 7 | Root layout, global stylesheet, `ModalFrame`, 404, redirect stubs. |
| [messaging](./messaging/README.md) | 5 | Contact form and admin inbox, with Gmail notification. |
| [infrastructure](./infrastructure/README.md) | 3 | DB connection, site constants, build and test config. |
| [media-upload](./media-upload/README.md) | 2 | Cloudinary uploads for project and resume assets. |

File counts are tracked source files owned by the domain, not doc counts.

## Per-domain layout

Five files always, three when they apply:

| File | When |
|---|---|
| `README.md` | always — index, what the domain owns, related domains |
| `architecture.md` | always — data flow, layers, key entities |
| `rules.md` | always — hard must / must-not constraints |
| `gotchas.md` | always — surprising behaviour, past incidents, traps |
| `api.md` | the domain has routes |
| `models.md` | the domain has Mongoose models |
| `frontend.md` | the domain has UI |
| `testing.md` | the domain has tests |

A conditional file that does not apply is absent, not stubbed.

## Keeping these honest

```
/doc-domain <name>   refresh one domain against current code (or scaffold a new one)
/doc-sync            audit all domains: orphans, ambiguous ownership, stale lastVerified
/doc-bootstrap       first-pass docs for every domain that has none
```

The `doc-sync` Stop hook warns when a domain's source changes without a docs update. It is
warn-only; `BLOCKING` in `.claude/hooks/doc-sync.mjs` turns it into a gate.

## Read these first

If you are new to the repository, three things will save you the most time:

1. **[retired-ui/gotchas.md](./retired-ui/gotchas.md)** — 30 of 115 source files are dead, and two
   pairs of files share a filename. This is the biggest trap here.
2. **[auth/gotchas.md](./auth/gotchas.md)** — there is no JWT, the cookie is decorative, and the
   `User` model is not part of login.
3. **[shared-ui/gotchas.md](./shared-ui/gotchas.md)** — `app/globals.css` is not the stylesheet;
   `src/index.css` is.

## Other documentation

- [`docs/superpowers/`](./superpowers/) — design specs and implementation plans
- [`docs/claudeDesign/`](./claudeDesign/) — design handoff assets
