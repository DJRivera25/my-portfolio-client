# frontend

## `useContactFormSubmission` — [src/hooks/useContactFormSubmission.ts](../../src/hooks/useContactFormSubmission.ts)

The single submission path. Returns `{ form, sending, handleSubmit, handleFieldChange }`.

Its live consumer is
[`src/components/portfolio/ContactSection.tsx`](../../src/components/portfolio/ContactSection.tsx).
Three retired components also import it — `Contact.tsx`, `ContactMessageForm.tsx`,
`GetInTouchModal.tsx` — which is why a `grep` for this hook suggests four call sites when only
one renders. See [retired-ui/gotchas.md](../retired-ui/gotchas.md).

## Inbox — [app/inbox/](../../app/inbox/)

Wrapped in `ProtectedRoute`, so an unauthenticated visitor is redirected to `/login` rather than
shown an empty list. The data is protected independently by `isAuthorizedAdmin` on
`GET /api/messages` — the wrapper is UX, not authorization.

Reads newest-first, and marks a message read via `PATCH /api/messages/[id]/viewed`.

## Unseen badge

`AuthContext.fetchUnseenCount()` calls `GET /api/messages` and counts entries where
`hasViewed` is false. `AdminBar` renders that count next to its Inbox link.

This means the badge fetches **every** message to compute one number. Acceptable at current
volume; a `countDocuments({ hasViewed: false })` endpoint would be the fix if it grows.
