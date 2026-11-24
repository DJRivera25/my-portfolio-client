# gotchas

## Two files named `HowIShip.tsx`, two named `ResumeSection.tsx`

| Live (this domain) | Retired |
|---|---|
| `src/components/portfolio/HowIShip.tsx` | `src/components/HowIShip.tsx` |
| `src/components/portfolio/ResumeSection.tsx` | `src/components/projects/ResumeSection.tsx` |

The live one is always under `portfolio/`. Opening the wrong file means editing code that never
renders, with no error to tell you. This is the most common way to lose time in this repository —
see [retired-ui/gotchas.md](../retired-ui/gotchas.md).

## `StackSection` does not read the `Tool` collection

It renders `stackGroups` from `src/config/atelier.ts`, a static list. The `Tool` model,
`/api/tools`, and `Tool.category` are all still live but nothing on the homepage displays them.

So editing a tool in the database changes nothing on the site. To change the stack section, edit
`stackGroups`.

## `PROJECT_DISPLAY_ORDER` silently ignores unknown entries

`sortProjectsForDisplay` orders against a curated list of titles. A project missing from the list
still appears, just not where you might expect; a stale entry in the list for a deleted project is
inert. Neither case warns.

## The motion hooks no-op more often than you would think

`useCursorGlow`, `useMagnetic`, and `useTypewriter` all bail out on touch devices and under
`prefers-reduced-motion: reduce`. Testing on a laptop with reduced motion enabled in the OS makes
the hero's typed terminal look broken when it is behaving correctly.

## Socials always render, database or not

`mergeSocials` starts from `defaultSocials` and overlays DB rows by lowercased `platform`. A
platform with no row still renders with its default URL — so a "missing" social link is a
`defaultSocials` entry, not an empty state. Two DB rows for the same platform: the first wins,
silently.

## The downloaded resume is built in the browser from `resumeContent`

`ResumeSection` screenshots each `.pdf-block` with html2canvas and packs the images into a jsPDF
document. Edit `resumeContent` in `src/config/atelier.ts` to change it — the `Resume` collection,
`/api/resumes`, and `public/atelier/Derem-Joshua-Rivera-Resume.pdf` play no part.

The PDF is images only, with no text layer, so a recruiter's applicant-tracking system cannot read
it without OCR.

## jsPDF stores PNGs uncompressed unless you pass a compression level

`addImage` with no compression argument resolves to `"NONE"` (`checkCompressValue` in jsPDF 4.2.1)
and writes raw RGB — the resume came out at 15.6 MB. Passing `"FAST"` with `compress: true` on the
document brings the same pixels to about 0.6 MB, losslessly. Keep the argument on any new
`addImage` call.

## The live preview is the real site, popups and all

The drawer's iframe loads the project's actual homepage, so its cookie banners, promo popups and
slow loads show too (Maximum88 shows both). It also counts as a visit in that site's analytics.
The sandbox omits `allow-top-navigation`, so a site's frame-busting script cannot navigate the
portfolio away.

## Keyboard shortcuts stop while the live preview has focus

After "Explore the live site", clicks inside the iframe move focus into the embedded page, and its
key presses go there. Esc and the arrow keys stop closing or paging the drawer until the visitor
clicks back on the drawer.

## Keyframes live in another domain's file

Every animation these components use is defined in `src/index.css`, owned by
[shared-ui](../shared-ui/README.md). A new class in a section component with no matching keyframe
there fails silently — no error, just no animation.

## `PortfolioPage` is one large client component

It fetches, holds state, defines `mergeSocials` and the grain data-URI, and composes thirteen
children. It is the natural place to look for homepage behaviour, and also the file most likely to
need splitting as sections grow.
