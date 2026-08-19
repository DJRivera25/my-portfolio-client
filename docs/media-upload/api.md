# api

## `POST /api/upload`

Accepts `multipart/form-data` with a single field named `file`.

**Currently unauthenticated.** There is no `isAuthorizedAdmin` check — see
[rules.md](./rules.md).

| Status | Body | When |
|---|---|---|
| `201` | `{ "url": "<secure_url>" }` | Upload succeeded |
| `400` | `{ "message": "Invalid content type" }` | Content type is not `multipart/form-data` |
| `400` | `{ "message": "File is required" }` | `file` absent, or present as a string |

A Cloudinary rejection is **not** caught — the promise rejects, the handler throws, and Next.js
returns an unshaped `500`. Compare with the explicit `400`s above.

### Behaviour by file type

| Input | `resource_type` | `allowed_formats` | Transformation |
|---|---|---|---|
| `image/*` | `image` | `jpg`, `jpeg`, `png`, `webp` | none |
| anything else | `raw` | none | none |

An `image/gif` or `image/svg+xml` is sent as `resource_type: "image"` but is not in
`allowed_formats`, so Cloudinary rejects it — surfacing as the unshaped `500` above, not a `400`.

### Response shape differs from the helper

This route returns `{ url }`. `uploadImageToPortfolio` returns the full `UploadApiResponse`, and
its callers read `.secure_url`. Do not assume one shape from having seen the other.
