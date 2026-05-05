---
name: adding-api-route
description: Use when creating a new App Router API route under app/api/. Enforces project conventions for dbConnect, admin auth, error shapes, and Domain Manifest updates.
---

# Adding an API route

## When to use

You are creating a new file under `app/api/<resource>/route.ts` (or `app/api/<resource>/[id]/route.ts`).

## Decide first

1. **Public or protected?**
   - Public: GETs of marketing data (projects list, tools list, socials list, public resume).
   - Protected: anything mutating (POST/PUT/DELETE), anything returning admin-only data (`/api/users`, `/api/messages` inbox view).
   When in doubt, protect it.

2. **Collection or item?**
   - Collection: `app/api/<resource>/route.ts` — typically `GET` (list) and `POST` (create).
   - Item: `app/api/<resource>/[id]/route.ts` — typically `GET` (one), `PUT` (update), `DELETE` (remove).
   - Look at `app/api/projects/` and `app/api/tools/` for the existing shape — mirror it.

3. **Which model?** All schemas live in `lib/models/`. If yours doesn't exist, use the `adding-mongo-model` skill first.

## Required template

```ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { isAuthorizedAdmin, unauthorizedResponse } from "@/lib/auth";
import Resource from "@/lib/models/Resource";

export async function GET() {
  await dbConnect();
  const items = await Resource.find();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) return unauthorizedResponse();
  await dbConnect();
  const data = await req.json();
  const created = await Resource.create(data);
  return NextResponse.json(created, { status: 201 });
}
```

For an item handler (`[id]/route.ts`):

```ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { isAuthorizedAdmin, unauthorizedResponse } from "@/lib/auth";
import Resource from "@/lib/models/Resource";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorizedAdmin(req)) return unauthorizedResponse();
  await dbConnect();
  const { id } = await params;
  const update = await req.json();
  const updated = await Resource.findByIdAndUpdate(id, update, { new: true });
  if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}
```

Note: in Next 15 App Router, `params` is async — always `await params`.

## Checklist

- [ ] File is at `app/api/<resource>/route.ts` or `app/api/<resource>/[id]/route.ts`.
- [ ] `await dbConnect()` is the first line after auth check (if any).
- [ ] Mutating handlers (POST/PUT/DELETE) start with `if (!isAuthorizedAdmin(req)) return unauthorizedResponse();`.
- [ ] Handler stays thin — if business logic exceeds ~30 lines, extract it to a helper in `lib/` (server-side, not `src/lib/api/`).
- [ ] Response shape matches sibling routes in the same folder (`{ message: "…" }` for errors, raw entity or `{ data, meta }` for success — match the neighbors).
- [ ] If the route returns `User` documents, password is stripped via `.select("-password")` or explicit projection.
- [ ] If the route reads file uploads, follows the `app/api/upload/route.ts` pattern (`runtime = "nodejs"`, `multipart/form-data` content-type guard).
- [ ] New file paths added to the appropriate domain in `CLAUDE.md`'s Domain Manifest.

## Anti-patterns

- ❌ `mongoose.connect(process.env.MONGODB_URI!)` — always use `dbConnect`.
- ❌ Putting business logic in the handler (e.g. complex validation rules, multi-step workflows). Extract to `lib/`.
- ❌ Returning `await Resource.find()` raw if the model has sensitive fields. Project explicitly.
- ❌ Inventing a new error response shape. Match siblings.
- ❌ Calling Cloudinary or any external API from a handler that hasn't set `runtime = "nodejs"` if it needs Node APIs.

## Verification

After scaffolding, suggest:
```bash
npx tsc --noEmit
```
And a manual curl/browser flow appropriate to the method.
