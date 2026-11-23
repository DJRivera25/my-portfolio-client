# api

Common shape: `GET` is public, mutations require `isAuthorizedAdmin(req)` and return
`401 { "message": "Unauthorized" }` without it. Collection-level `PUT`/`DELETE` take `id` in the
JSON body.

## `/api/projects`

| Method | Auth | Body | Success |
|---|---|---|---|
| `GET` | public | — | `200` `Project[]` |
| `POST` | admin | `multipart/form-data` | `201` `Project` |
| `PUT` | admin | `{ id, ...update }` | `200` updated |
| `DELETE` | admin | `{ id }` | `200` `{ message: "Project deleted successfully" }` |

`runtime = "nodejs"` — required for Buffer streaming to Cloudinary.

`POST` fields: `title`, `description`, `link`, `image` (required); `mobileImage`, `tags`,
`highlights`, `year`, `role`, `tagline`, `kind`, `problem`, `solution` (optional).

`image` is either a file, uploaded through `uploadImageToPortfolio`, or a string URL from
`POST /api/projects/screenshot`, stored as-is. A string must pass `isPortfolioImageUrl` (https on
`res.cloudinary.com`) — so the screenshot provider's temporary URL can never be saved.

Errors: `400 { message: "Invalid content type" }` for a non-multipart body;
`400 { message: "Title, description, link, and image are required" }` when a required field is
missing; `400 { message: "Image must be an uploaded file or a captured screenshot" }` for an
`image` string that is not a Cloudinary URL. `PUT`/`DELETE` return `404 { message: "Project not found" }`.

### `/api/projects/[id]`

`GET`, `PUT`, `DELETE`, `PATCH` — path-addressed equivalents. The multipart `PUT` accepts `image`
as a file or a captured Cloudinary URL, with the same `400` as `POST`.

### `POST /api/projects/screenshot`

Admin-only. Captures the homepage at `link` and stores it in Cloudinary, so the admin form can
fill "Desktop screenshot" without an upload. Does not touch the database — the form saves the
returned URL as `image` through `POST`/`PUT` above.

`runtime = "nodejs"`, `maxDuration = 60` (a slow site takes ~30s).

| Body | Success |
|---|---|
| `{ link }` — http(s) URL, validated with Zod | `201 { url }` (Cloudinary `secure_url`) |

| Status | When |
|---|---|
| `400 { message: "A valid http(s) link is required" }` | missing or invalid `link` |
| `429 { message }` | the provider's daily allowance is used up, or a capture is already running |
| `422 { message }` | the site itself failed: timeout, unreachable, bot protection, bad URL |
| `502 { message }` | the provider or the Cloudinary upload failed |

Capture logic lives in `lib/screenshot.ts`, owned by [media-upload](../media-upload/README.md).

## `/api/tools`, `/api/socials`

Same shape: public `GET`, admin `POST` / `PUT` / `DELETE` with JSON bodies, plus `[id]` routes
supporting `GET` / `PUT` / `DELETE`.

## Resume — two overlapping route families

This is the one place the domain's conventions break down.

### `/api/resume` — the upload family

`runtime = "nodejs"`. Admin-only on all methods; there is **no `GET`**.

| Method | Body | Notes |
|---|---|---|
| `POST` | `multipart/form-data`, field `resume` | `400 { message: "Invalid content type" }` for non-multipart; `400 { message: "Resume file is required" }` when the field is absent or a string |
| `PUT` | | |
| `DELETE` | | |

### `/api/resumes` — the JSON CRUD family

| Method | Auth | Body | Success |
|---|---|---|---|
| `GET` | public | — | `200` `Resume[]` |
| `POST` | admin | JSON | `201` `Resume` |
| `PUT` | admin | `{ id, ...update }` | `200` |
| `DELETE` | admin | `{ id }` | `200` |

Both write to the same `Resume` collection. `/api/resume` accepts a file; `/api/resumes` accepts
JSON. The homepage reads `/api/resumes`. See [gotchas.md](./gotchas.md) before adding to either.

### `/api/resume/[id]`

`GET`, `PUT`, `DELETE`.
