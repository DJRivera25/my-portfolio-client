# rules

## Never call Cloudinary from the client

The API key and secret are server-only environment variables. Uploads go through a route handler;
a component posts a `FormData` to that handler and gets back a URL.

`src/lib/api/client.ts` already strips `Content-Type` for `FormData` payloads so the browser can
set the multipart boundary — do not add it back.

## `POST /api/upload` needs an auth check

It has none. Per the project's own rule 3, a route that mutates state must start with:

```ts
if (!isAuthorizedAdmin(req)) return unauthorizedResponse();
```

As it stands, anyone can push arbitrary files — including `resource_type: "raw"` files of any
format — into the Cloudinary account. Add the check before extending this route.

## `runtime = "nodejs"` on every uploading handler

`Buffer` and the Cloudinary stream API are unavailable on edge. Omitting the export produces a
runtime failure, not a build error.

## Reuse `uploadImageToPortfolio` for images

New image uploads should use the helper rather than calling `upload_stream` directly, so the
800px `crop: "limit"` policy applies consistently. If a surface genuinely needs full resolution,
add a parameter to the helper instead of hand-rolling a second call site.

## Everything stays in the `portfolio` folder

Both paths hard-code `folder: "portfolio"`. Keep it — the account is shared with nothing else,
and a second folder means two places to look when auditing assets.

## Keep the vendor name at the boundary

Cloudinary appears in `lib/cloudinary.ts`, in the env var names, and in the handlers that upload.
It must not leak into model fields, domain types, or component props — those carry a `url`
string, not a provider-shaped object.
