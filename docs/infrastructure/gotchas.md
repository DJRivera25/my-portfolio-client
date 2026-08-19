# gotchas

## `lib/db.ts` throws at import, not at call

The `MONGODB_URI` check runs at module scope. So *importing* anything that transitively reaches
`lib/db.ts` without the env var set throws before a single line of your code runs.

This is why the pure modules in `lib/worklog/` deliberately avoid importing it — otherwise the
whole vitest suite would die on import rather than fail a useful assertion. See
[worklog/architecture.md](../worklog/architecture.md).

## Schema changes need a dev-server restart

The `models.X || model(…)` pattern means a model registered with the old schema stays registered
across HMR. The symptom is `Path "<field>" is not in schema, strict mode is true` for a field you
just added. Restart `npm run dev`.

## Mongoose does not drop stale indexes

Removing or changing an index in a schema leaves the old one in MongoDB. For worklog collections,
`node --env-file=.env.local scripts/worklog-reset.mjs` drops and rebuilds. For other collections
there is no script — do it from the Mongo shell.

## Stale `.next` types can fail `type-check`

`tsconfig.json` includes `.next/types/**/*.ts`. Delete a route handler and the generated type for
it survives until the next build, so `npm run type-check` reports an error in a file you never
wrote — e.g. `.next/types/app/api/worklog/public/route.ts` after removing that route.

Run `npm run build`, or delete `.next`, before trusting a `type-check` failure in a generated path.

## `package.json` still carries CRA dependencies

`@testing-library/dom`, `@testing-library/jest-dom`, `@testing-library/react`,
`@testing-library/user-event`, `@types/jest`, and `web-vitals` are all present and **unused** —
their only consumer is the retired `src/setupTests.ts`. `@types/jsonwebtoken` is there without
`jsonwebtoken`, and there is no JWT in the codebase at all.

The `eslintConfig` block extends `react-app` / `react-app/jest`, which requires
`eslint-config-react-app`. It is not installed and there is no `lint` script, so nothing lints.

Some of these live in `dependencies` rather than `devDependencies`, which means they ship to the
production install.

## There is no `next.config.*`

Unusual enough to be worth stating: no image-domain allowlist, no redirects, no headers, no
build-time config. If remote images ever need `next/image`, that file has to be created first.

## Two palettes in one Tailwind config

`theme.extend.colors` holds both the navy and Atelier sets. Both compile, neither warns. New work
uses `atelier.*` only — see [shared-ui/gotchas.md](../shared-ui/gotchas.md).

## `bufferCommands: false` makes early queries fail loudly

Intended. A query before the connection is ready errors immediately instead of hanging in
Mongoose's buffer. If you see a "not connected" error, the fix is a missing `await dbConnect()`,
not a retry.
