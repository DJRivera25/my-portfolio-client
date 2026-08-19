# gotchas

## The rate limiter is per-instance and resets on cold start

`rateLimitMap` is a module-level `Map` in the route file. On Vercel that means:

- Each serverless instance has its **own** counter. Concurrent requests routed to different
  instances each get their own allowance of 3.
- A cold start wipes the map entirely, restoring a full allowance.
- The map grows unbounded within an instance's lifetime — one entry per distinct IP, never
  evicted except by the per-request window filter on that IP's own array.

So "3 per 10 minutes" is the best case, not a guarantee. Durable limiting needs shared state
(the database or a KV store).

## `x-forwarded-for` is client-supplied

`getClientIp` reads the first entry of `x-forwarded-for`, falling back to `x-real-ip`, then
`"unknown"`. Behind Vercel's proxy the leading value is trustworthy, but the
header is attacker-controllable in principle, and everything that fails both headers shares a
single `"unknown"` bucket.

## Gmail needs an app password, not the account password

`service: "gmail"` with basic auth requires a Google **app password** on an account with 2FA.
A normal password fails authentication, and the resulting `500` says only that mail failed.

## A `500` on submit usually means missing mail env vars

`sendMail` throws `"Email credentials not set"` when `EMAIL_USER` or `EMAIL_PASS` is absent. The
message is already saved at that point — check `/inbox` before assuming a submission was lost.

## `EMAIL_TO` silently defaults to `EMAIL_USER`

`const EMAIL_TO = process.env.EMAIL_TO || EMAIL_USER`. Forgetting to set it does not error; the
notification just goes to the sending account.

## The `viewed` route answers 405 on purpose

`app/api/messages/[id]/viewed/route.ts` exports `GET`, `POST`, and `DELETE` handlers that all
return `405 { "message": "Method Not Allowed" }`. They are deliberate, not leftovers — only
`PATCH` does anything.

## `params` is a Promise

`PATCH(req, props: { params: Promise<{ id: string }> })` then `await props.params`. This is the
Next.js 15 dynamic-params signature. Copying an older `{ params }` destructure into a new dynamic
route will not compile.

## The unseen badge downloads every message

Covered in [frontend.md](./frontend.md): `fetchUnseenCount` fetches the full list to count
unread. Cheap now, wrong shape later.
