# messaging

Contact-form submissions and the admin inbox. A visitor posts a message; it is stored, emailed
onward via Gmail, and read at `/inbox`.

| Doc | What's in it |
|---|---|
| [architecture.md](./architecture.md) | Submit → store → email → inbox, and the rate limiter |
| [api.md](./api.md) | `/api/messages` and `/api/messages/[id]/viewed` |
| [models.md](./models.md) | `Message` |
| [frontend.md](./frontend.md) | The live form hook and the inbox page |
| [rules.md](./rules.md) | What must hold — the public POST, the admin GET |
| [gotchas.md](./gotchas.md) | In-memory rate limiting on serverless, Gmail creds, 405 stubs |

## What this domain owns

`lib/models/Message.ts`, `app/api/messages/**`, `app/inbox/**`, and
`src/hooks/useContactFormSubmission.ts`.

The form UI itself lives in [atelier-redesign](../atelier-redesign/README.md)
(`portfolio/ContactSection.tsx`); the retired `Contact.tsx` / `ContactMessageForm.tsx` /
`GetInTouchModal.tsx` trio is in [retired-ui](../retired-ui/README.md).

## Environment variables

| Var | Purpose | If unset |
|---|---|---|
| `EMAIL_USER` | Gmail account used as SMTP auth and `from` | `sendMail` throws `"Email credentials not set"` |
| `EMAIL_PASS` | Gmail app password | Same |
| `EMAIL_TO` | Notification recipient | Falls back to `EMAIL_USER` |

## Related domains

- [auth](../auth/README.md) — `isAuthorizedAdmin` gates every read and mutation
- [atelier-redesign](../atelier-redesign/README.md) — renders the form
