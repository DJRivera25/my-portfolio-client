# architecture

## Two paths to Cloudinary

### 1. `uploadImageToPortfolio(buffer)` — the helper

[`lib/cloudinary.ts`](../../lib/cloudinary.ts) wraps `upload_stream` in a Promise and applies a
fixed policy:

```
folder:         "portfolio"
resource_type:  "image"
transformation: [{ width: 800, crop: "limit" }]
```

`crop: "limit"` only shrinks — an image narrower than 800px is left alone. Returns the full
`UploadApiResponse`; callers use `.secure_url`.

This is what `POST /api/projects` uses for both `image` and `mobileImage`.

### 2. `POST /api/upload` — the generic route

[`app/api/upload/route.ts`](../../app/api/upload/route.ts) imports the configured `cloudinary`
default export and calls `upload_stream` itself, with different options:

```
folder:          "portfolio"
resource_type:   "image" | "raw"   // branched on file.type
allowed_formats: ["jpg","jpeg","png","webp"] for images, undefined for raw
```

**No transformation.** So an image uploaded here is stored at full resolution, while the same
image through `uploadImageToPortfolio` is capped at 800px wide.

Non-image files go up as `resource_type: "raw"` with **no format restriction at all** — that is
how the resume PDF gets in.

## Request flow

1. Reject a non-`multipart/form-data` content type with `400`.
2. `req.formData()`, read field `file`.
3. Reject a missing field or a string value with `400`.
4. Branch `resourceType` / `allowedFormats` on `file.type`.
5. `Buffer.from(await file.arrayBuffer())` — the whole file is buffered in memory.
6. `upload_stream(...).end(buffer)`, wrapped in a Promise.
7. Respond `201 { url }`.

## Why `runtime = "nodejs"`

Both `lib/cloudinary.ts` and the route use `Buffer` and the Cloudinary SDK's Node stream API.
Neither exists on the edge runtime, so every handler that uploads declares
`export const runtime = "nodejs"`.
