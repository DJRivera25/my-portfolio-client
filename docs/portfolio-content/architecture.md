# architecture

## One shape, five collections

Every route family follows the same pattern:

| Concern | Convention |
|---|---|
| Read | `GET` on the collection — **public, unauthenticated** |
| Mutate | `POST` / `PUT` / `DELETE` — `isAuthorizedAdmin(req)` first line |
| Identity on mutate | `id` in the **JSON body**, not the path, on the collection routes |
| Per-item routes | `app/api/<thing>/[id]/route.ts` for path-addressed operations |
| Connection | `await dbConnect()` after the auth check |
| Response | `NextResponse.json(payload, { status })` |

`GET` being public is deliberate: the homepage fetches projects, tools, socials, and resumes
without a token.

## Read path

`PortfolioPage` (client) → `src/lib/api/client.ts` axios instance → `GET /api/<thing>` →
`dbConnect()` → Mongoose `find()` → JSON.

No component imports Mongoose. That is the project's layering rule, and this domain is where it
matters most because the models are right there.

## Write path — projects

`POST /api/projects` is the most involved handler in the repo:

1. `isAuthorizedAdmin` check.
2. Reject anything that is not `multipart/form-data` with `400`.
3. Require `title`, `description`, `link`, and an `image` file.
4. Upload `image` through `uploadImageToPortfolio` (Cloudinary, `portfolio` folder, width-limited
   to 800px).
5. Optionally upload `mobileImage` when present and non-empty.
6. Parse `tags` and `highlights` through the local `parseTags` helper.
7. Coerce `year` to a number, dropping it unless finite.
8. Create the document, return `201`.

`parseTags` accepts either a JSON array or a comma-separated string, trims, drops empties, and
**caps at 12 entries**.

## Types

[`src/types/portfolio.ts`](../../src/types/portfolio.ts) declares the client-side shapes,
including the case-study fields the Atelier presentation reads: `tagline`, `kind`, `problem`,
`solution`, `highlights`.

These are hand-maintained alongside the Mongoose schemas — there is no generation step, so a
schema change needs a matching edit here.
