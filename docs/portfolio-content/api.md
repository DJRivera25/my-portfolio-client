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

Errors: `400 { message: "Invalid content type" }` for a non-multipart body;
`400 { message: "Title, description, link, and image are required" }` when a required field is
missing. `PUT`/`DELETE` return `404 { message: "Project not found" }`.

### `/api/projects/[id]`

`GET`, `PUT`, `DELETE`, `PATCH` — path-addressed equivalents.

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
