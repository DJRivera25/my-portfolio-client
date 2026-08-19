# infrastructure

Database connection, site constants, environment, and build/test configuration.

| Doc | What's in it |
|---|---|
| [architecture.md](./architecture.md) | `dbConnect` caching, `siteConfig`, TS/Tailwind/vitest setup |
| [rules.md](./rules.md) | One connection path, one source of site strings |
| [gotchas.md](./gotchas.md) | Module-scope throw, HMR model staleness, CRA leftovers in package.json |

## What this domain owns

`lib/db.ts`, `lib/site.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`,
`vitest.config.mts`, `package.json`, `src/images.d.ts`, `.env.local`, `.env.example`.

There is **no `next.config.*`** in this repo.

## Environment variables, all domains

| Var | Domain | If unset |
|---|---|---|
| `MONGODB_URI` | infrastructure | **Throws at module import** of `lib/db.ts` |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | [auth](../auth/README.md) | Login returns `500` |
| `ADMIN_API_TOKEN` | [auth](../auth/README.md) | Falls back to `"admin-static-token"` |
| `MCP_TOKEN` | [worklog](../worklog/README.md) | `/api/mcp` denies everything |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | [media-upload](../media-upload/README.md) | Uploads fail at request time |
| `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO` | [messaging](../messaging/README.md) | `sendMail` throws; `EMAIL_TO` defaults to `EMAIL_USER` |
| `NEXT_PUBLIC_SITE_URL` | infrastructure | `siteConfig.ogUrl` falls back to the Vercel URL |

## Commands

```bash
npm run dev          # next dev
npm run build        # next build
npm run start        # production server
npm run type-check   # tsc --noEmit
npm test             # vitest run
npm run test:watch   # vitest
```

No `lint` script. See [gotchas.md](./gotchas.md).
