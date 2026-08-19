# architecture

## Flow

1. A visitor fills the form in `src/components/portfolio/ContactSection.tsx`.
2. `useContactFormSubmission` posts to `POST /api/messages`.
3. The handler rate-limits by client IP **before** touching the database.
4. `Message.create(...)` stores the submission with `hasViewed: false`.
5. `sendMail` delivers a notification through Gmail to `EMAIL_TO`.
6. The admin opens `/inbox`, which reads `GET /api/messages` (newest first).
7. Opening a message fires `PATCH /api/messages/[id]/viewed`, flipping `hasViewed`.
8. `AuthContext.fetchUnseenCount()` counts `!hasViewed` to badge the `AdminBar` inbox link.

`POST` is the only public method in this domain. Everything else requires
`isAuthorizedAdmin`.

## Rate limiting

Defined inline in [`app/api/messages/route.ts`](../../app/api/messages/route.ts):

```
rateLimitMap: Map<ip, timestamp[]>
RATE_LIMIT_WINDOW = 10 * 60 * 1000   // 10 minutes
RATE_LIMIT_COUNT  = 3                // per window
```

The client IP comes from `x-forwarded-for` (first entry) then `x-real-ip`, defaulting to
`"unknown"`. Timestamps older than the window are dropped on each request.

This is **process-local memory**, which has real consequences on serverless — see
[gotchas.md](./gotchas.md).

## Mail transport

`nodemailer.createTransport({ service: "gmail", auth: { user, pass } })`, constructed per
request inside `sendMail`. The `from` header is a fixed display name over `EMAIL_USER`.

Gmail is named directly in the handler rather than behind an adapter. That is worth knowing if
the provider ever changes: the swap point is `sendMail` in this one file.
