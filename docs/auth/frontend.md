# frontend

## `AuthContext` — [src/context/AuthContext.tsx](../../src/context/AuthContext.tsx)

Client provider mounted in the root layout. Exposes
`{ isLoggedIn, unseenCount, login, logout, fetchUnseenCount }` through the `useAuth()` hook,
which throws if used outside the provider.

| Member | Behaviour |
|---|---|
| `login(token)` | `localStorage.setItem("token", token)`, sets `isLoggedIn`, fetches unseen count |
| `logout()` | **`localStorage.clear()`**, resets `isLoggedIn` and `unseenCount` |
| `fetchUnseenCount()` | `GET /api/messages`, counts `!hasViewed`. No-ops without a token. |

On mount it seeds `isLoggedIn` from the presence of the `localStorage` token.

`logout()` clearing client storage is the right instinct — a stale token or cached admin data
must not survive sign-out on a shared machine. Note that `localStorage.clear()` is a **whole
origin wipe**, not a scoped one: any device-level preference stored later (theme,
reduced-motion) will be destroyed by sign-out too. If such a preference is added, switch to
removing the specific user-scoped keys.

## `ProtectedRoute` — [src/components/ProtectedRoute.tsx](../../src/components/ProtectedRoute.tsx)

Wraps admin pages. Reads the `localStorage` token in a `useEffect`, `router.replace("/login")`
if absent, otherwise renders children. Shows a gold spinner and "Checking session…" while
undetermined.

Client-side only — it hides UI, it does not protect data. The server-side check is
`isAuthorizedAdmin` in each handler.

## `AdminBar` — [src/components/AdminBar.tsx](../../src/components/AdminBar.tsx)

Chrome for the signed-in surfaces, rendered by the root layout. Links to `/worklog` and
`/inbox` (the latter badged with `unseenCount`) plus a sign-out button that calls
`logout()` then `router.replace("/login")`.

Returns `null` on `/` and `/login`, and whenever `isLoggedIn` is false — the homepage owns its
own `SiteNav`, and `/login` has nothing to navigate to.

## axios client — [src/lib/api/client.ts](../../src/lib/api/client.ts)

The shared instance every client fetcher uses.

- Request interceptor attaches `Authorization: Bearer <localStorage token>` when running in the
  browser.
- When `config.data` is `FormData`, it **deletes** the `Content-Type` header so the browser can
  set the multipart boundary itself. Overriding it breaks uploads.
- `getAuthHeaders()` returns the same header for callers using `fetch` instead of axios.
- `isAxiosError(err)` is the type guard for error handling.
