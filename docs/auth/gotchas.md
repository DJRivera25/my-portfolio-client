# gotchas

## There is no JWT, despite appearances

`package.json` lists `@types/jsonwebtoken` — the **types only**; `jsonwebtoken` itself is not a
dependency, and `grep` finds no `jwt` usage anywhere in `app/`, `lib/`, or `src/`.

The "token" is `ADMIN_API_TOKEN` handed to the client verbatim. It is not signed, carries no
claims, and has no expiry. Any documentation or comment describing "JWT-based admin bearer
tokens" is wrong, including older revisions of `CLAUDE.md`.

## The httpOnly cookie is decorative

`POST /api/auth/login` sets a `token` cookie with `httpOnly`, `sameSite: "lax"`, and `secure` in
production. Nothing reads it — no `cookies()` call exists in the repo, and `isAuthorizedAdmin`
only looks at the `Authorization` header.

It is easy to mistake this for defence in depth. It is not: the value that actually authorizes
requests is the copy in `localStorage`, which is reachable by any script on the origin.

## The `User` model is orphaned from login

`comparePassword` is never called. `pre("save")` only ever fires via the open `/api/users`
routes. Login compares environment variables. So the collection holds real bcrypt hashes that
authenticate nothing.

Beware the reverse inference: seeing `bcryptjs`, a `password` field, and a `comparePassword`
method suggests a password-based login exists. It does not.

## `role` defaults to `"admin"`

`UserSchema.role` has `default: "admin"`, and `POST /api/users` is unauthenticated. Today
nothing reads `role` for authorization, so this is inert. The moment any code branches on
`role`, it becomes privilege escalation by default. Change the default to `"user"` before
wiring role checks.

## `403` on failed login, `401` everywhere else

`POST /api/auth/login` returns `403 {"message":"Unauthorized access"}` for bad credentials,
while `unauthorizedResponse()` returns `401 {"message":"Unauthorized"}`. A client written
against one shape will not recognise the other.

## Deleting the Content-Type header is deliberate

In `src/lib/api/client.ts` the interceptor strips `Content-Type` when the payload is
`FormData`. This looks like a bug and is not — the browser must set the multipart boundary
itself. Restoring the header breaks every upload.

## `localStorage.clear()` is broader than it looks

Correct today, because the only thing stored is the token. It wipes the whole origin, so
anything cached later — a theme choice, a dismissed banner — disappears on sign-out too.
