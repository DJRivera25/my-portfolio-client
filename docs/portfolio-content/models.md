# models

All four use `{ timestamps: true }` and the `models.X || model("X", …)` HMR-safe pattern. None
declares an index beyond the default `_id`.

## `Project` — [lib/models/Project.ts](../../lib/models/Project.ts)

| Field | Type | Notes |
|---|---|---|
| `title` | String | required |
| `description` | String | required |
| `image` | String | required. Cloudinary `secure_url`. |
| `link` | String | required |
| `featured` | Boolean | default `false` |
| `tags` | [String] | default `[]`, capped at 12 by `parseTags` |
| `year` | Number | |
| `role` | String | |
| `mobileImage` | String | Cloudinary `secure_url` |
| `tagline` | String | Case-study field |
| `kind` | String | Case-study field |
| `problem` | String | Case-study field |
| `solution` | String | Case-study field |
| `highlights` | [String] | default `[]`, case-study field |

The five case-study fields exist for "The Build Log" presentation and are read by
`toCaseStudy()` in `src/config/atelier.ts`. All optional — a project without them still renders
via the fallbacks.

## `Tool` — [lib/models/Tool.ts](../../lib/models/Tool.ts)

| Field | Type | Notes |
|---|---|---|
| `name` | String | required |
| `icon` | String | |
| `description` | String | |
| `category` | String | Free-form string, **not** an enum |

`category` has no validation. The retired `src/config/toolCategories.ts` used to supply the
vocabulary; the live Atelier stack section uses `stackGroups` in `src/config/atelier.ts`
instead, so nothing currently constrains or consumes this field's values.

## `Social` — [lib/models/Social.ts](../../lib/models/Social.ts)

| Field | Type | Notes |
|---|---|---|
| `platform` | String | required. Matched case-insensitively against `defaultSocials`. |
| `url` | String | required |
| `icon` | String | |

`platform` is not unique, so two rows for the same platform are possible. `mergeSocials` in
`PortfolioPage` takes the first match.

## `Resume` — [lib/models/Resume.ts](../../lib/models/Resume.ts)

| Field | Type | Notes |
|---|---|---|
| `url` | String | required |
| `fileUrl` | String | |
| `uploadedAt` | Date | default `Date.now` |

Two URL fields with no documented distinction, plus `uploadedAt` duplicating what
`timestamps: true` already provides as `createdAt`. See [gotchas.md](./gotchas.md).
