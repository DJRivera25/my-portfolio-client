# media-upload

Cloudinary uploads for project and resume assets. Everything lands in the `portfolio` folder.

| Doc | What's in it |
|---|---|
| [architecture.md](./architecture.md) | The two upload paths and how they differ |
| [api.md](./api.md) | `POST /api/upload` |
| [rules.md](./rules.md) | Server-side only, `runtime = "nodejs"`, the missing auth check |
| [gotchas.md](./gotchas.md) | Orphaned assets, the `any` cast, no size limit |

## What this domain owns

`lib/cloudinary.ts` and `app/api/upload/**`.

Project and resume handlers in [portfolio-content](../portfolio-content/README.md) also upload —
they import from here rather than re-configuring Cloudinary.

## Environment variables

`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

All three are read at module scope in `lib/cloudinary.ts` via `cloudinary.config(...)`. Unset
values do not throw at import — the failure surfaces as an upload rejection at request time.

## Related domains

- [portfolio-content](../portfolio-content/README.md) — the main consumer
- [auth](../auth/README.md) — `isAuthorizedAdmin`, which this domain's route is missing
