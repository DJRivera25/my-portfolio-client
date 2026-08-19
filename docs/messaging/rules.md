# rules

## `POST /api/messages` stays public; everything else stays admin-only

The whole point of the domain is that a stranger can send a message. `GET`, `PUT`, `DELETE`, and
the `viewed` PATCH all read or mutate private correspondence and must keep
`isAuthorizedAdmin(req)` as their first line.

## Rate-limit before the database

The IP check runs before `dbConnect()` and before `Message.create`. Keep that order — moving it
after the write turns the limiter into a way to fill the collection.

## Mail failure must not lose the message

`Message.create` happens before `sendMail`. If mail throws, the submission is already stored and
readable in `/inbox`. Do not reorder these, and do not wrap them in a transaction that would
discard the message when Gmail is unreachable.

## Keep the provider in one function

Gmail is referenced only inside `sendMail` in `app/api/messages/route.ts`. If mail moves to
another provider, that function is the only thing that changes — do not spread transport
config into other handlers or into the domain's types.

Per the project's naming convention, a provider name belongs in env config and one adapter, not
in domain logic. `sendMail` is that adapter; it is just inline rather than in its own module.

## Do not trust `email` as an identity

`Message.email` is unvalidated visitor input. It is a reply-to hint, not a verified address, and
it must never be used to look anything up or to authorize anything.
