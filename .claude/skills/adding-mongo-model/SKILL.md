---
name: adding-mongo-model
description: Use when adding a new Mongoose model under lib/models/. Enforces the HMR-safe pattern, timestamp convention, and security defaults for sensitive fields.
---

# Adding a Mongoose model

## When to use

You are creating `lib/models/<Name>.ts` for a new MongoDB collection.

## Required template

```ts
import { Schema, models, model } from "mongoose";

const ResourceSchema = new Schema(
  {
    name: { type: String, required: true },
    // … fields
  },
  { timestamps: true }
);

const Resource = models.Resource || model("Resource", ResourceSchema);

export default Resource;
```

## Critical patterns

1. **`models.X || model("X", schema)` — always.** Without this guard, Next.js HMR throws `OverwriteModelError` on re-saves. Look at any existing file in `lib/models/` to confirm.

2. **`{ timestamps: true }` — always.** Every existing model uses it. Future-you will want `createdAt`/`updatedAt` for sorting and debugging.

3. **One collection per file.** Don't bundle related schemas in one file. If you need a sub-document, define it inline as a schema constant in the same file.

4. **Sensitive fields need extra care.** If your model has anything like a password, token, or secret:
   - Hash it in a `pre("save")` hook (see `lib/models/User.ts` for the bcrypt pattern).
   - Document on the schema that consumers must `.select("-fieldName")` when returning to client.
   - Add a comment at the top of the file noting which fields are sensitive.

5. **Indexes.** If you'll query by a field other than `_id`, add an index:
   ```ts
   ResourceSchema.index({ slug: 1 }, { unique: true });
   ```

## Field type cheatsheet

| Field type | Schema definition |
|---|---|
| Required string | `{ type: String, required: true }` |
| Optional string | `{ type: String }` |
| Unique string | `{ type: String, required: true, unique: true }` |
| Enum | `{ type: String, enum: ["a", "b"], default: "a" }` |
| Boolean default false | `{ type: Boolean, default: false }` |
| Number | `{ type: Number, required: true }` |
| Date | `{ type: Date }` |
| Reference | `{ type: Schema.Types.ObjectId, ref: "OtherModel" }` |
| Array of strings | `{ type: [String], default: [] }` |
| Cloudinary URL | `{ type: String, required: true }` (just store the secure URL) |

## Checklist

- [ ] File is `lib/models/<PascalCaseName>.ts`.
- [ ] Schema uses `new Schema(..., { timestamps: true })`.
- [ ] Export uses `models.X || model("X", schema)` pattern.
- [ ] Single default export.
- [ ] Sensitive fields hashed via `pre("save")` and noted in a top-of-file comment.
- [ ] Indexes added for any non-`_id` query fields.
- [ ] If the model is used by an API route, that route is also created (use `adding-api-route` skill).
- [ ] New file path added to the appropriate domain in `CLAUDE.md`'s Domain Manifest (or new domain created).

## Anti-patterns

- ❌ `export const Resource = mongoose.model(...)` without the `models.X ||` guard.
- ❌ Defining `_id` manually (Mongoose handles it).
- ❌ Hardcoding `createdAt`/`updatedAt` fields — use `{ timestamps: true }`.
- ❌ Storing raw passwords / API keys without hashing.
- ❌ One file with multiple schemas exported.
