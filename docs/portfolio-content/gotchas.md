# gotchas

## `/api/resume` and `/api/resumes` are different endpoints for one collection

Singular takes a file upload and has no `GET`. Plural is JSON CRUD and is what the homepage
reads. Both write `Resume` documents.

Nothing signals which to use from the route name. When adding resume behaviour, decide from the
payload: a file goes to `/api/resume`, JSON to `/api/resumes`. Expect to have to re-check this
every time — the naming gives no help.

## `Resume` has two URL fields and a redundant date

`url` (required) and `fileUrl` (optional) with no documented difference, plus `uploadedAt`
defaulting to `Date.now` while `timestamps: true` already supplies `createdAt`. Read the consumer
before assuming which field is authoritative.

## `PUT` handlers spread unvalidated input into the update

Every collection `PUT` does:

```ts
const { id, ...update } = await request.json();
await Thing.findByIdAndUpdate(id, update, { new: true });
```

There is no field allowlist. An authenticated caller can set any schema field, and Mongoose
`strict` mode silently drops anything not in the schema rather than erroring. This is admin-only,
so it is a robustness problem rather than an open door — but it means a typo'd field name fails
quietly.

## `parseTags` accepts two formats and silently truncates

JSON array or comma-separated string, both trimmed and emptied-filtered, then `.slice(0, 12)`.
A 15-tag submission succeeds and stores 12, with no warning.

## `year` is dropped when it is not finite

`const year = yearRaw ? Number(yearRaw) : undefined` then
`Number.isFinite(year) ? year : undefined`. Submitting `year: "abc"` does not error — the field is
just absent from the created document.

## `mobileImage` needs a non-empty file

The guard is `mobileFile instanceof Blob && mobileFile.size > 0`. Browsers submit an empty `File`
for an untouched file input, so without the size check every project would get a spurious upload
attempt. An empty file is silently skipped.

## `Tool.category` is unconstrained and currently unread

Free-form `String`, no enum. Its old vocabulary source (`src/config/toolCategories.ts`) is
retired, and the live stack section uses `stackGroups` from `src/config/atelier.ts`. So values
written here are neither validated nor displayed today.

## `Social.platform` is not unique

Two rows for the same platform are allowed. `mergeSocials` in `PortfolioPage` matches
case-insensitively and takes the first hit, so a duplicate is invisible rather than an error.

## Deleting a document does not delete the Cloudinary asset

`DELETE` removes the Mongo document only. The uploaded image stays in the `portfolio` folder
forever. See [media-upload/gotchas.md](../media-upload/gotchas.md).
