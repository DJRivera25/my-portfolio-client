# rules

## One connection path

Every server-side database access starts with `await dbConnect()` from `@/lib/db`. **Never call
`mongoose.connect` directly** — a second connection defeats the `global` cache and leaks
connections under serverless concurrency.

Order inside a handler: auth check → `dbConnect()` → query.

## Models use the HMR-safe pattern

```ts
const Thing = models.Thing || model("Thing", ThingSchema);
```

Without it, HMR re-registers the model and Mongoose throws `OverwriteModelError`. Every model in
`lib/models/` follows this, and `{ timestamps: true }` is the default unless there is a reason not
to (`Counter` is the one exception).

## Site strings come from `siteConfig`

`lib/site.ts` is the single source for name, title, description, `ogUrl`, and contact details. Do
not duplicate any of them into a component, a metadata export, or an email template.

## Do not add path aliases

`@/lib/*`, `@/app/*`, `@/src/*`. That is the set. A fourth alias means a reader has to check
`tsconfig.json` to resolve an import.

## Do not introduce `next.config.*` casually

There is none today, which means zero build-time configuration to reason about. Adding one is
fine when something genuinely needs it — image domains, redirects, headers — but it should be for
a stated reason, not scaffolding.

## Keep `.env.example` in step

Any new environment variable is added to `.env.example` in the same change, with a comment on what
happens when it is unset. The table in [README.md](./README.md) is the current inventory.

## Widen the vitest glob deliberately

`include: ["lib/**/*.test.ts"]`. A test outside `lib/` does not fail — it does not run. If tests
are needed elsewhere, widen the glob and say so; do not leave a file that looks like a test and
is not executed.

## `any` stays contained

The `@ts-ignore` and `any` casts in `lib/db.ts` exist for the `global` augmentation, and one more
sits in `app/api/upload/route.ts`. Both are known and tolerated. Do not propagate the pattern to
new code.
