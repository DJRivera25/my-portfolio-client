---
name: registering-new-domain
description: Use when creating files under a new feature folder no manifest entry covers, when doc-sync reports an orphan path, or when scaffolding a brand-new feature area. Triggers on "new domain", "add a feature area", "manifest", "doc-sync warned about orphans".
---

# registering-new-domain

## When to use

- `doc-sync` warned that changed files match no domain
- You are creating a feature folder that no existing `paths` glob covers
- You are about to add a new top-level area under `app/`, `lib/`, or `src/`

## First: does it need a new domain?

Usually not. Nine domains already cover every tracked source file, so a new file almost always
belongs to an existing one. Check before coining anything:

```bash
node -e "import('./.claude/hooks/lib/manifest.mjs').then(m=>{const d=m.readManifest(process.cwd()).domains;for(const[k,v]of Object.entries(d))console.log(k,'\n  ',v.paths.join('\n   '))})"
```

Add a new domain only when the work is a genuinely separate feature area with its own models,
routes, or UI surface — not when it is a new file in an existing one.

**Adding a path to an existing domain is the common case.** Do that, and update that domain's docs
in the same change.

## Naming

Follow the vocabulary already in the repo. Existing names are all lowercase kebab, named for the
feature, not the layer: `portfolio-content`, `messaging`, `auth`, `media-upload`, `shared-ui`,
`atelier-redesign`, `worklog`, `retired-ui`, `infrastructure`.

- Reuse the term the code already uses. Grep before you coin.
- No vendor names — Cloudinary lives in `media-upload`, Gmail in `messaging`. A provider name
  belongs in env config and one adapter module, never in a domain name.
- If nothing fits and you must coin a term, say so explicitly to the user, pick the clearest single
  word, and use it everywhere — folder, docs, manifest, and prose.

## Path rules

Paths must not overlap **ambiguously**. The matcher resolves a literal path over a glob, so a
deliberate override is fine:

```
"atelier-redesign": ["src/components/portfolio/**"]        ← glob
"worklog":          ["src/components/portfolio/Foo.tsx"]   ← literal, wins for that one file
```

Two globs of equal specificity claiming one file is a real ambiguity, and `doc-sync` reports it.
Fix it by narrowing one glob or adding a literal.

Supported syntax: `**` (any depth), `*` (one segment), `{a,b}` (alternatives), literal paths.
Nothing else — no `?`, no character classes.

## Steps

1. **Add the manifest entry** in `CLAUDE.md`, between the `DOMAIN-MANIFEST` markers:

   ```json
   "<name>": {
     "purpose": "One or two sentences. What it owns, and the one thing a newcomer would get wrong.",
     "docs": "docs/<name>/",
     "lastVerified": null,
     "paths": ["..."]
   }
   ```

   `lastVerified: null` is correct until the docs exist. Do not date it early.

2. **Verify coverage** — 0 orphans, 0 dead paths, 0 true ambiguity:

   ```bash
   node -e "import('./.claude/hooks/lib/manifest.mjs').then(m=>{m.readManifest(process.cwd());console.log('manifest parses')})"
   ```

   Then run `/doc-sync` for the full audit.

3. **Write the docs** — `/doc-domain <name>` scaffolds them. Four required (`README.md`,
   `architecture.md`, `rules.md`, `gotchas.md`) plus `api.md` / `models.md` / `frontend.md` /
   `testing.md` where they apply. A conditional that does not apply is absent, not stubbed.

4. **Bump `lastVerified`** once the docs are real.

5. **Cross-link** — add the new domain to the table in `docs/README.md`, and to the "Related
   domains" section of any domain it touches.

## Do not

- Do not add paths to `retired-ui`. That domain is a deletion queue, not a home for new work.
- Do not commit. The no-auto-commit hook blocks it; ask the user.
- Do not leave `lastVerified` dated with no docs behind it — that makes the staleness check lie.
