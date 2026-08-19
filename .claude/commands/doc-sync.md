---
description: Audit every domain's documentation against the code — orphan files, ambiguous ownership, stale lastVerified, missing doc files.
allowed-tools: Read, Glob, Grep, Bash
---

# /doc-sync — audit the documentation

Read-only. Report; do not fix unless the user asks.

## Step 1 — parse the manifest

Read the Domain Manifest from `CLAUDE.md` (the fenced JSON between
`<!-- DOMAIN-MANIFEST-START -->` and `<!-- DOMAIN-MANIFEST-END -->`). The hook library already
does this:

```bash
node -e "import('./.claude/hooks/lib/manifest.mjs').then(m=>console.log(JSON.stringify(m.readManifest(process.cwd()),null,2)))"
```

## Step 2 — coverage

For every tracked source file (`git ls-files`, filtered to `.ts`/`.tsx`/`.mjs`/`.css` under
`app/`, `lib/`, `src/`), resolve its owning domain with `findDomain` from
`.claude/hooks/lib/match.mjs`. Remember the specificity rule: a **literal** path beats a glob.

Report:

- **Orphans** — source files matching no domain. Each needs a home or a new domain.
- **Dead manifest paths** — a literal path that no longer exists, or a glob matching nothing.
- **True ambiguity** — two patterns of *equal* specificity claiming one file. A literal
  overriding another domain's glob is the manifest working as designed; do not report it.

## Step 3 — doc completeness

For each domain, check its `docs` folder against the template:

- Always required: `README.md`, `architecture.md`, `rules.md`, `gotchas.md`
- `api.md` if the domain owns anything under `app/api/`
- `models.md` if it owns anything under `lib/models/`
- `frontend.md` if it owns `.tsx` outside `app/api/`
- `testing.md` if it owns any `*.test.ts`

A conditional file that does not apply should be **absent**, not a stub. Flag both a missing
required file and a stub file that should have been deleted.

## Step 4 — staleness

For each domain with a non-null `lastVerified`, count commits touching its paths since that date:

```bash
git log --oneline --since=<lastVerified> -- <paths…> | wc -l
```

Flag any domain with `lastVerified: null` (undocumented) or more than 20 commits since.

## Step 5 — report

One table: domain, owned files, docs present/expected, `lastVerified`, commits since. Then the
orphan / dead-path / ambiguity lists. End with the single highest-value next action, usually a
specific `/doc-domain <name>`.

Do not edit files. Do not commit.
