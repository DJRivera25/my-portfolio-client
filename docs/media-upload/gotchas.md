# gotchas

## Deleting a document never deletes the asset

Every `DELETE` in this repo removes the Mongo document only. The Cloudinary asset stays in the
`portfolio` folder indefinitely, unreferenced.

Over time the folder accumulates images from deleted and re-edited projects. Cleanup is manual,
through the Cloudinary console. Nothing in the codebase tracks a `public_id`, so matching an
orphaned asset back to the project that created it means comparing URLs by hand.

Storing `upload.public_id` alongside `image` would make deletion possible — the model does not.

## The two upload paths apply different policies

Same folder, different behaviour:

| | `uploadImageToPortfolio` | `POST /api/upload` |
|---|---|---|
| Width cap | 800px (`crop: "limit"`) | **none** |
| Format allowlist | none | `jpg`/`jpeg`/`png`/`webp` for images |
| Non-image files | rejected (`resource_type: "image"`) | accepted as `raw` |
| Returns | full `UploadApiResponse` | `{ url }` |

So the same photo can be stored twice at different resolutions depending on which entry point was
used, and neither is obviously "the" upload path.

## A Cloudinary failure returns an unshaped 500

Neither upload path wraps the Cloudinary promise in a try/catch. Config problems (a missing
`CLOUDINARY_API_SECRET`), format rejections, and quota errors all surface as a generic `500` with
no message, while the local validation failures return tidy `400`s. The asymmetry makes
misconfiguration look like a server bug.

## Missing env vars fail late

`cloudinary.config({...})` at module scope accepts `undefined` values without complaint. The
first sign of a misconfigured environment is a failed upload, not a boot error — unlike
`lib/db.ts`, which throws at import when `MONGODB_URI` is absent.

## No size limit anywhere

Neither path checks `file.size`, and the whole file is read into a `Buffer` before upload. A large
file is bounded only by the platform's request-body and memory limits. Combined with the missing
auth check on `POST /api/upload`, that is worth fixing together.

## `upload` is typed `any`

`await new Promise<any>(...)` in the route, so `upload.secure_url` is unchecked. This is one of
the few deliberate `any`s the project tolerates — the CLAUDE.md convention says not to propagate
the pattern. The helper in `lib/cloudinary.ts` is properly typed as `UploadApiResponse`; prefer
it.

## `allowed_formats` is undefined for raw uploads

Non-image files get no format restriction at all. That is what lets the resume PDF through, and
it also means any file type at all is accepted once the content-type check passes.
