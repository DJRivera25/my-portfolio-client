# rules

## `GET` public, everything else admin

The homepage is unauthenticated, so collection `GET`s must stay open. Every `POST`, `PUT`,
`DELETE`, and `PATCH` starts with:

```ts
if (!isAuthorizedAdmin(req)) return unauthorizedResponse();
```

before `dbConnect()`. There is no middleware — a handler without this line is public.

## Images go through Cloudinary server-side

Project and resume assets are uploaded by the route handler via `uploadImageToPortfolio`
(or `cloudinary` directly, for the resume PDF). **Never call Cloudinary from a component**, and
never accept a client-supplied URL as `image` — the model stores the `secure_url` the upload
returned.

`runtime = "nodejs"` is mandatory on any handler that streams a Buffer to Cloudinary; edge has no
Buffer.

## Check `content-type` before reading a multipart body

`POST /api/projects` and `POST /api/resume` both reject a non-multipart request with
`400 { message: "Invalid content type" }` before calling `req.formData()`. Keep that guard — the
alternative is an unhandled throw.

## Mirror the sibling route shape

Collection-level `PUT`/`DELETE` take `id` in the JSON body; `[id]` routes take it from the path.
Success bodies are the document; delete returns `{ message: "<Thing> deleted successfully" }`;
misses return `404 { message: "<Thing> not found" }`.

A new collection here copies that shape rather than inventing a new one.

## Keep `src/types/portfolio.ts` in step with the schemas

There is no type generation. Adding a field to `Project` means adding it to the interface in the
same change, or the client silently cannot see it.

## Validate new input with Zod

`zod` ^4 is a dependency. Existing handlers destructure by hand — `PUT` spreads
`{ id, ...update }` straight into `findByIdAndUpdate` with no field allowlist. New handlers should
parse with a schema, and a handler you are already editing should gain one.

## Respect the 12-tag cap

`parseTags` caps `tags` and `highlights` at 12 entries. If a surface needs more, change the
helper deliberately rather than bypassing it.
