# architecture

## The layout tree

[`app/layout.tsx`](../../app/layout.tsx) is the only layout in the app. It renders:

```
<html className={…5 font variables}>
  <body className="font-grotesk bg-atelier-ink text-atelier-paper antialiased">
    <AuthProvider>          ← src/context/AuthContext.tsx  (auth domain)
      <AdminBar />          ← src/components/AdminBar.tsx  (auth domain)
      <ToastContainer />    ← react-toastify, theme="dark", top-right, 3s
      {children}
```

Line 1 is `import "../src/index.css"`. **Not** `app/globals.css` — see
[gotchas.md](./gotchas.md).

`AdminBar` returns `null` on `/` and `/login` and whenever the visitor is not signed in, so the
public site renders with no global chrome at all. The homepage supplies its own `SiteNav` and
`SiteFooter`.

## Ground colour

`body` carries `bg-atelier-ink text-atelier-paper`. The comment in the file states the intent:
Atelier ink is the ground for every route — the homepage paints its own, and the signed-in pages
inherit it here rather than the retired navy theme.

## Fonts

Five families, all exposed as CSS variables on `<html>`:

| Source | Family | Variable |
|---|---|---|
| `geist/font/sans` | Geist Sans | `GeistSans.variable` |
| `geist/font/mono` | Geist Mono | `GeistMono.variable` |
| `next/font/google` | Instrument Serif (400, normal + italic) | `--font-instrument-serif` |
| `next/font/google` | Space Grotesk (300–700) | `--font-space-grotesk` |
| `next/font/google` | JetBrains Mono (400–600) | `--font-jetbrains-mono` |

All `display: "swap"`. Tailwind maps them to utilities such as `font-grotesk` in
`tailwind.config.js`.

## Metadata

Built entirely from `siteConfig` ([`lib/site.ts`](../../lib/site.ts)): `metadataBase` from
`ogUrl`, a title template of `%s | <shortName>`, plus OpenGraph and Twitter cards pointing at
`/thumbnail.png` (1200×630). The favicon is `/my-photo.png`.

Per the project rule, these strings are never duplicated into components — they come from
`siteConfig`.

## Redirect stubs

`app/about/page.tsx`, `app/projects/page.tsx`, and `app/contact/page.tsx` are three-line server
components that call `redirect("/#about")`, `redirect("/#work")`, and `redirect("/#contact")`.

Each carries the same comment: the page duplicated a section of the single-page home and nothing
linked to it, so redirecting keeps old links and bookmarks working without maintaining a second
copy of the copy, which would drift.
