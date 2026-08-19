# architecture

## Database — [lib/db.ts](../../lib/db.ts)

A cached single connection, kept on `global` so Next.js HMR and serverless warm starts reuse it
instead of opening a new one per request:

```
global.mongoose = { conn: null, promise: null }
dbConnect() → returns cached conn
            → else awaits cached promise
            → else mongoose.connect(MONGODB_URI, { bufferCommands: false })
```

`bufferCommands: false` means a query issued before the connection is ready fails fast rather than
queueing silently.

`MONGODB_URI` is read and validated **at module scope**, so importing `lib/db.ts` without it
throws immediately. That is what the pure/query split in
[worklog/architecture.md](../worklog/architecture.md) exists to avoid.

The file carries a `@ts-ignore` and two `any` casts for the `global` augmentation — one of the few
places the project tolerates `any`.

## Site constants — [lib/site.ts](../../lib/site.ts)

`siteConfig` is `as const` and holds `name`, `shortName`, `title`, `description`, `ogUrl`, and
`contact.{email,phone,phoneHref}`.

`ogUrl` is `process.env.NEXT_PUBLIC_SITE_URL || "https://my-portfolio-client-one.vercel.app"`.
It is the only public env var in the repo, and it feeds `metadataBase` in the root layout.

## TypeScript — [tsconfig.json](../../tsconfig.json)

TypeScript 5.9.3. `target: "ES2022"`, `module: "esnext"`,
`moduleResolution: "Bundler"`, `strict: true`, `noEmit: true`, `jsx: "preserve"`,
`isolatedModules: true`, `noFallthroughCasesInSwitch: true`, `incremental: true`, plus the `next`
plugin.

Path aliases — the only three, and no new ones:

```
@/lib/*  → ./lib/*
@/app/*  → ./app/*
@/src/*  → ./src/*
```

`include` is `["app", "lib", "src", ".next/types/**/*.ts"]`. Because generated `.next` types are
in scope, a deleted route can leave a stale generated type failing `type-check` until the next
build.

## Tailwind — [tailwind.config.js](../../tailwind.config.js)

Tailwind 3. Content globs cover `src/`, `app/`, and `lib/`. `theme.extend.colors` carries **both**
palettes: the navy set (`brand.*`, `accent.*`, `surface.glass`, `hairline.*`) and the Atelier set
(`atelier.*`). Only the Atelier half is for new work — see
[shared-ui/gotchas.md](../shared-ui/gotchas.md).

PostCSS is `postcss.config.js` with `tailwindcss` and `autoprefixer`.

## Tests — [vitest.config.mts](../../vitest.config.mts)

```
environment: "node"
include:     ["lib/**/*.test.ts"]
alias:       { "@": <repo root> }
```

Node environment, so no jsdom and no component tests. The include glob covers `lib/` only — a test
anywhere else is silently not run.

## Ambient types — [src/images.d.ts](../../src/images.d.ts)

Declares `*.png` as a module exporting a `string`, which is what lets `src/images/` files be
imported directly.
