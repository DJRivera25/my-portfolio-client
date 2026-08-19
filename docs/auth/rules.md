# rules

## Every non-public handler starts with the check

```ts
if (!isAuthorizedAdmin(req)) return unauthorizedResponse();
```

First line of the handler, before `dbConnect()`. There is **no middleware** — a handler without
this line is public to the internet.

Public by design, and only these: `GET` on `/api/projects`, `/api/tools`, `/api/socials`,
`/api/resumes` (the portfolio reads them unauthenticated), and `POST /api/auth/login`.

Still open and **should not be**: all four methods on `/api/users`, and `POST /api/upload`.

## Never return a password hash

Any handler returning `User` documents must `.select("-password")` or project explicitly.
`GET /api/users` currently violates this. The fix is both parts together:

```ts
if (!isAuthorizedAdmin(req)) return unauthorizedResponse();
await dbConnect();
const users = await User.find().select("-password");
```

## `MCP_TOKEN` gets no default, ever

`isAuthorizedMcp` denies when the env var is unset. Do not "harmonize" it with
`isAuthorizedAdmin` by adding a fallback — the fallback on the admin side is the bug, not the
pattern to copy.

## Do not add a second token store

The token lives in `localStorage` under the key `token`, and that is the one source. The login
route also sets an `httpOnly` cookie which nothing reads — do not start reading it without
removing the `localStorage` path, or the app will have two disagreeing notions of "signed in".

## Sign-out clears client storage

`logout()` must clear the user-scoped browser storage, not just flip React state. It currently
calls `localStorage.clear()`. If a device-level preference is ever stored, narrow this to the
user-scoped keys rather than dropping the clear.

## Rotate `ADMIN_API_TOKEN` away from the default

`isAuthorizedAdmin` falls back to the literal string `"admin-static-token"`. An unset env var in
any environment means the admin API is open to anyone who reads this repository. Set it in
`.env.local` and in Vercel.

Because the login route hands `ADMIN_API_TOKEN` to the browser verbatim, rotating it signs out
every client — that is expected.

## Client-side gating is not authorization

`ProtectedRoute` improves the UX of an unauthenticated visit. It is never the reason data is
safe. If a page shows admin data, the handler behind it needs `isAuthorizedAdmin`.
