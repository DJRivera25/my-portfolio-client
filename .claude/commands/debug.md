---
description: Root-cause a bug, test failure, or unexpected behaviour before proposing a fix. Usage /debug <symptom>
allowed-tools: Read, Glob, Grep, Bash
argument-hint: <symptom>
---

# /debug — find the cause before the fix

`$ARGUMENTS` is the symptom. If empty, ask what is going wrong.

Follow the `superpowers:systematic-debugging` discipline: reproduce, isolate, hypothesise, verify,
name. **Do not apply a fix until the cause is named and confirmed.**

## Step 1 — reproduce

Get a deterministic failure before theorising:

```bash
npm run type-check   # tsc --noEmit
npm test             # vitest run
npm run build        # catches what type-check does not
```

If it cannot be reproduced, say so and ask for the exact steps, route, and payload.

## Step 2 — rule out the known traps

This repo has a specific set of confusing-but-expected behaviours. Check these before digging:

| Symptom | Likely cause |
|---|---|
| Edited a component, nothing changed | The file is in the `retired-ui` domain and is unreachable. Two pairs share a filename; the live one is under `src/components/portfolio/`. |
| Edited `app/globals.css`, nothing changed | The layout imports `src/index.css`. `app/globals.css` is unused. |
| `Path "<field>" is not in schema, strict mode is true` | HMR kept the old model registered. Restart `npm run dev`. |
| type-check error inside a `.next/types/...` path | Stale generated type for a deleted route. Run `npm run build`, or delete `.next`. |
| Query fails with a "not connected" error | Missing `await dbConnect()`. `bufferCommands: false` fails fast by design. |
| Upload returns an unshaped 500 | Cloudinary rejection. Check the three env vars and `allowed_formats`. |
| 401 on an API call | Bearer token missing, or `ADMIN_API_TOKEN` rotated. A 403 instead means it is the login route. |
| Contact form returns 500 | `EMAIL_USER` / `EMAIL_PASS` unset. The message was still saved — check `/inbox`. |
| Stack section ignores a `Tool` edit | `StackSection` renders static `stackGroups`, not the database. |
| Animation not running | The motion hooks no-op on touch devices and under `prefers-reduced-motion`. |
| Rate limit lets more than 3 through | `rateLimitMap` is per serverless instance and resets on cold start. |

The `docs/<domain>/gotchas.md` for the affected domain is the fuller list — read it.

## Step 3 — isolate

Narrow to the smallest failing unit. Prefer reading the code over adding logging. Trace the actual
call path; do not assume the layering holds — verify it.

## Step 4 — name the cause

One sentence: what is wrong, in which file, and why it produces this symptom. Cite `path:line`.
If two causes are still possible, say which evidence would separate them.

## Step 5 — propose, do not apply

State the smallest fix that addresses the cause, and what it risks breaking. Then stop and let the
user decide — unless they already asked for the fix.

Do not commit. Do not fix unrelated problems you noticed on the way; list them separately.
