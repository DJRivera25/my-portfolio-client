# Aurora Glass Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the public-facing portfolio at `c:\Codes\my-portfolio-client` in the "Aurora Glass" design language so it reads as futuristic and AI-era through design quality, while keeping the fullstack-engineer positioning intact.

**Architecture:** A small, reusable primitive layer (`AuroraBackdrop`, `GlassCard`, `EyebrowLabel`, `GradientText`, `SectionHeader`) under `src/components/ui/` is built first. Every section then consumes those primitives, so the visual language is consistent and centrally tunable. Copy lives in `src/config/content.ts`; tools categories in `src/config/toolCategories.ts`; nav structure in `src/config/navigation.ts`. No backend, schema, or auth changes.

**Tech Stack:** Next.js 15 App Router · React 19 · TypeScript · Tailwind 3 · Framer Motion · Geist Sans/Mono (new) · existing Mongoose API layer (untouched).

**Spec reference:** `docs/superpowers/specs/2026-05-04-aurora-glass-portfolio-redesign-design.md`

---

## Verification approach (read this first)

This codebase has **no test runner, no lint script, no type-check script**. Per `CLAUDE.md`, the verification commands are:

- `npx tsc --noEmit` — ad-hoc type check (run after every code change)
- `npm run build` — full production build, catches more issues than tsc alone (run before final commit / before declaring a phase done)
- `npm run dev` — local dev server for visual verification (run after every UI change)

Each task in this plan ends with a verification step + a commit step. **Per the project's `CLAUDE.md` no-auto-commit rule, commit steps require explicit user authorization** ("commit", "push", "ship it") in the user's most recent message. The executor must pause at each commit step and ask the user to authorize.

---

## File structure

### New files (6)
- `src/components/ui/AuroraBackdrop.tsx` — ambient gradient + grid backdrop (configurable tint)
- `src/components/ui/GlassCard.tsx` — frosted glass card surface with optional hover lift
- `src/components/ui/EyebrowLabel.tsx` — uppercase tracking label with optional pulsing dot
- `src/components/ui/GradientText.tsx` — gradient punch-word wrapper
- `src/components/ui/SectionHeader.tsx` — eyebrow + heading + subhead block
- `src/components/HowIShip.tsx` — new "process" section between About and Projects

### Modified files (~16)
- `package.json` — add `geist` dependency
- `app/layout.tsx` — swap Montserrat → Geist Sans / Geist Mono
- `app/page.tsx` — insert `<HowIShip />` between `<About />` and `<Projects />`
- `tailwind.config.js` — add cyan/violet/glass/hairline tokens + display type scale
- `src/index.css` — aurora drift keyframes
- `src/config/content.ts` — full copy rewrite
- `src/config/navigation.ts` — add `process` link
- `src/config/toolCategories.ts` — restructure to 5 categories incl. `ai-workflow`
- `src/components/Landing.tsx` — full rewrite
- `src/components/About.tsx` — full rewrite
- `src/components/Projects.tsx` — card-layer refresh
- `src/components/Tools.tsx` — consume new categories + visual polish
- `src/components/Contact.tsx` — full rewrite
- `src/components/Navbar.tsx` — glass treatment + new nav item polish
- `src/components/Footer.tsx` — glass-edge polish
- `src/components/ContactMessageForm.tsx` — input/button restyle
- `src/components/ProjectModal.tsx` — Aurora Glass shell
- `src/components/ResumeModal.tsx` — Aurora Glass shell
- `src/components/SocialModal.tsx` — Aurora Glass shell
- `src/components/ToolModal.tsx` — Aurora Glass shell
- `src/components/GetInTouchModal.tsx` — Aurora Glass shell

### Out of scope
- API routes (`app/api/**`), Mongoose models (`lib/models/**`), `lib/` server libraries, auth flow, admin pages (`app/inbox/**`, `app/login/**`), upload pipeline, modal *behavior* (only visuals change).

---

## Task 1: Install Geist + add Aurora Glass theme tokens

**Files:**
- Modify: `package.json` (add dependency)
- Modify: `tailwind.config.js`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Install Geist font package**

```bash
npm install geist
```

Expected: dependency added, `package-lock.json` updated.

- [ ] **Step 2: Extend `tailwind.config.js` with new tokens**

Replace the `theme.extend` block in `tailwind.config.js` with:

```js
theme: {
  extend: {
    colors: {
      brand: {
        navy: "#0a0f29",
        "navy-mid": "#1a1f3a",
        "navy-light": "#23284a",
        surface: "#2d3257",
      },
      accent: {
        DEFAULT: "#FFD600",
        hover: "#e6c200",
        muted: "rgba(255, 214, 0, 0.15)",
        cyan: "#00E0FF",
        "cyan-soft": "rgba(0, 224, 255, 0.18)",
        violet: "#8A6DFF",
        "violet-soft": "rgba(138, 109, 255, 0.18)",
      },
      surface: {
        glass: "rgba(255, 255, 255, 0.04)",
        "glass-strong": "rgba(255, 255, 255, 0.06)",
      },
      hairline: {
        DEFAULT: "rgba(255, 255, 255, 0.08)",
        strong: "rgba(255, 255, 255, 0.12)",
      },
    },
    fontFamily: {
      sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
    },
    fontSize: {
      "display-xl": ["clamp(2.5rem, 7vw, 5.25rem)", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
      "display-lg": ["clamp(2rem, 4.5vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "700" }],
      eyebrow: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.18em", fontWeight: "500" }],
    },
    spacing: {
      section: "5rem",
      "section-sm": "3.5rem",
    },
    maxWidth: {
      readable: "42rem",
    },
    boxShadow: {
      "brand-glow": "0 0 24px rgba(255, 214, 0, 0.25)",
      "cyan-glow": "0 0 28px rgba(0, 224, 255, 0.18)",
      "glass-lift": "0 12px 40px rgba(0, 0, 0, 0.35)",
    },
    backdropBlur: {
      glass: "12px",
    },
    animation: {
      "aurora-drift": "aurora-drift 60s ease-in-out infinite",
      "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
    },
    keyframes: {
      "aurora-drift": {
        "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
        "33%": { transform: "translate(8%, -6%) scale(1.05)" },
        "66%": { transform: "translate(-6%, 8%) scale(0.95)" },
      },
      "pulse-soft": {
        "0%, 100%": { opacity: "1", boxShadow: "0 0 0 0 rgba(0, 224, 255, 0.7)" },
        "50%": { opacity: "0.6", boxShadow: "0 0 0 6px rgba(0, 224, 255, 0)" },
      },
    },
  },
},
```

- [ ] **Step 3: Swap fonts in `app/layout.tsx`**

Replace the Montserrat import and usage with Geist:

```tsx
import "../src/index.css";
import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer";
import { AuthProvider } from "../src/context/AuthContext";
import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { siteConfig } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(siteConfig.ogUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.ogUrl,
    siteName: siteConfig.name,
    images: [{ url: "/thumbnail.png", width: 1200, height: 630, alt: siteConfig.name }],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/thumbnail.png"],
  },
  icons: { icon: "/my-photo.png" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans bg-brand-navy text-white antialiased">
        <AuthProvider>
          <Navbar />
          <ToastContainer position="top-right" autoClose={3000} theme="dark" />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
```

Note: body bg is now `brand-navy` (was `white`). This is intentional — every section in the new design assumes a dark base.

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 5: Build to confirm no Tailwind config breakage**

Run: `npm run build`
Expected: Build succeeds. Warnings about unused styles are OK; errors are not.

- [ ] **Step 6: Commit (requires user authorization)**

```bash
git add package.json package-lock.json tailwind.config.js app/layout.tsx
git commit -m "feat(theme): add Aurora Glass tokens and swap to Geist fonts"
```

---

## Task 2: Add aurora drift utility classes

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add new utilities and respect reduced motion**

Replace the contents of `src/index.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-brand-navy: #0a0f29;
  --color-accent: #ffd600;
  --color-accent-cyan: #00e0ff;
  --color-accent-violet: #8a6dff;
  --nav-offset: 5rem;
}

@media (max-width: 1023px) {
  :root {
    --nav-offset: 4.25rem;
  }
}

@layer base {
  html {
    scroll-behavior: smooth;
  }
  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
  }
  body {
    margin: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

/* Anchor targets clear fixed navbar */
#landing,
#about,
#process,
#projects,
#resume,
#tools,
#contact {
  scroll-margin-top: var(--nav-offset);
}

code {
  font-family: var(--font-geist-mono), ui-monospace, monospace;
}

/* Aurora ambient blobs respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .animate-aurora-drift {
    animation: none !important;
  }
  .animate-pulse-soft {
    animation: none !important;
  }
}

/* Skeleton shimmer — respect reduced motion */
.shimmer {
  position: relative;
  overflow: hidden;
}
.shimmer::after {
  content: "";
  position: absolute;
  top: 0;
  left: -150%;
  width: 150%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.13), transparent);
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  100% {
    left: 100%;
  }
}
@media (prefers-reduced-motion: reduce) {
  .shimmer::after {
    animation: none;
  }
}

/* Faint grid overlay used by AuroraBackdrop */
.aurora-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 32px 32px;
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Commit (requires user authorization)**

```bash
git add src/index.css
git commit -m "feat(theme): add aurora drift utilities and process anchor"
```

---

## Task 3: Build `<AuroraBackdrop>` primitive

**Files:**
- Create: `src/components/ui/AuroraBackdrop.tsx`

- [ ] **Step 1: Write the primitive**

Create `src/components/ui/AuroraBackdrop.tsx`:

```tsx
import React from "react";

type Tint = "yellow-cyan" | "cyan-violet" | "violet-yellow";

type AuroraBackdropProps = {
  tint?: Tint;
  withGrid?: boolean;
  className?: string;
};

const TINT_BLOBS: Record<Tint, { a: string; b: string; c?: string }> = {
  "yellow-cyan": {
    a: "radial-gradient(circle at 78% 12%, rgba(255,214,0,0.20) 0%, transparent 38%)",
    b: "radial-gradient(circle at 8% 92%, rgba(0,224,255,0.22) 0%, transparent 42%)",
    c: "radial-gradient(circle at 50% 50%, rgba(138,109,255,0.10) 0%, transparent 60%)",
  },
  "cyan-violet": {
    a: "radial-gradient(circle at 12% 18%, rgba(0,224,255,0.22) 0%, transparent 40%)",
    b: "radial-gradient(circle at 84% 88%, rgba(138,109,255,0.20) 0%, transparent 42%)",
  },
  "violet-yellow": {
    a: "radial-gradient(circle at 20% 80%, rgba(138,109,255,0.22) 0%, transparent 42%)",
    b: "radial-gradient(circle at 80% 20%, rgba(255,214,0,0.18) 0%, transparent 40%)",
  },
};

const AuroraBackdrop: React.FC<AuroraBackdropProps> = ({
  tint = "yellow-cyan",
  withGrid = true,
  className = "",
}) => {
  const blobs = TINT_BLOBS[tint];
  const layered = [blobs.a, blobs.b, blobs.c].filter(Boolean).join(", ");

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div
        className="absolute inset-0 animate-aurora-drift"
        style={{ background: layered, willChange: "transform" }}
      />
      {withGrid && <div className="absolute inset-0 aurora-grid opacity-60" />}
    </div>
  );
};

export default AuroraBackdrop;
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Commit (requires user authorization)**

```bash
git add src/components/ui/AuroraBackdrop.tsx
git commit -m "feat(ui): add AuroraBackdrop primitive"
```

---

## Task 4: Build `<GlassCard>` primitive

**Files:**
- Create: `src/components/ui/GlassCard.tsx`

- [ ] **Step 1: Write the primitive**

Create `src/components/ui/GlassCard.tsx`:

```tsx
"use client";

import React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  hoverLift?: boolean;
  as?: "div" | "article" | "section";
} & Omit<HTMLMotionProps<"div">, "ref">;

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  hoverLift = false,
  as = "div",
  ...rest
}) => {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;

  return (
    <Tag
      className={`relative rounded-2xl border border-hairline bg-surface-glass backdrop-blur-glass shadow-glass-lift ${className}`}
      whileHover={
        hoverLift && !reduceMotion
          ? { y: -4, boxShadow: "0 20px 48px rgba(0,0,0,0.45), 0 0 28px rgba(0,224,255,0.20)", borderColor: "rgba(0,224,255,0.35)" }
          : undefined
      }
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default GlassCard;
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Commit (requires user authorization)**

```bash
git add src/components/ui/GlassCard.tsx
git commit -m "feat(ui): add GlassCard primitive"
```

---

## Task 5: Build small primitives (`<EyebrowLabel>`, `<GradientText>`, `<SectionHeader>`)

**Files:**
- Create: `src/components/ui/EyebrowLabel.tsx`
- Create: `src/components/ui/GradientText.tsx`
- Create: `src/components/ui/SectionHeader.tsx`

- [ ] **Step 1: Write `EyebrowLabel.tsx`**

```tsx
import React from "react";

type EyebrowLabelProps = {
  children: React.ReactNode;
  withDot?: boolean;
  dotColor?: string;
  className?: string;
};

const EyebrowLabel: React.FC<EyebrowLabelProps> = ({
  children,
  withDot = false,
  dotColor = "#00E0FF",
  className = "",
}) => (
  <span
    className={`inline-flex items-center gap-2 text-eyebrow uppercase text-white/60 ${className}`}
  >
    {withDot && (
      <span
        className="inline-block h-1.5 w-1.5 rounded-full animate-pulse-soft"
        style={{ background: dotColor, boxShadow: `0 0 8px ${dotColor}` }}
        aria-hidden
      />
    )}
    {children}
  </span>
);

export default EyebrowLabel;
```

- [ ] **Step 2: Write `GradientText.tsx`**

```tsx
import React from "react";

type Variant = "yellow" | "cyan" | "violet";

type GradientTextProps = {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
};

const GRADIENTS: Record<Variant, string> = {
  yellow: "linear-gradient(110deg, #FFD600 0%, #FFF6B0 100%)",
  cyan: "linear-gradient(110deg, #00E0FF 0%, #FFFFFF 100%)",
  violet: "linear-gradient(110deg, #FFFFFF 30%, #8A6DFF 100%)",
};

const GradientText: React.FC<GradientTextProps> = ({ children, variant = "yellow", className = "" }) => (
  <span
    className={`bg-clip-text text-transparent ${className}`}
    style={{ backgroundImage: GRADIENTS[variant] }}
  >
    {children}
  </span>
);

export default GradientText;
```

- [ ] **Step 3: Write `SectionHeader.tsx`**

```tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import EyebrowLabel from "./EyebrowLabel";

type SectionHeaderProps = {
  eyebrow: string;
  heading: React.ReactNode;
  subhead?: string;
  withDot?: boolean;
  align?: "left" | "center";
  className?: string;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  heading,
  subhead,
  withDot = false,
  align = "left",
  className = "",
}) => {
  const alignClass = align === "center" ? "text-center mx-auto items-center" : "text-left items-start";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, type: "spring" }}
      className={`flex flex-col gap-4 max-w-3xl ${alignClass} ${className}`}
    >
      <EyebrowLabel withDot={withDot}>{eyebrow}</EyebrowLabel>
      <h2 className="text-display-lg text-white">{heading}</h2>
      {subhead && <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-readable">{subhead}</p>}
    </motion.div>
  );
};

export default SectionHeader;
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 5: Commit (requires user authorization)**

```bash
git add src/components/ui/EyebrowLabel.tsx src/components/ui/GradientText.tsx src/components/ui/SectionHeader.tsx
git commit -m "feat(ui): add EyebrowLabel, GradientText, SectionHeader primitives"
```

---

## Task 6: Update content / navigation / tool categories config

**Files:**
- Modify: `src/config/content.ts`
- Modify: `src/config/navigation.ts`
- Modify: `src/config/toolCategories.ts`

- [ ] **Step 1: Replace `src/config/content.ts` content**

```ts
/**
 * Marketing copy — Aurora Glass redesign. Edit here to update multiple sections.
 */
export const heroContent = {
  eyebrow: "Available — open to roles & projects",
  headline: "Ship more. Ship better.",
  headlinePunch: "Faster.",
  subhead:
    "Fullstack engineer — APIs, data, and interfaces built end to end, designed to scale with the team maintaining them.",
  primaryCta: "Start a project",
  secondaryCta: "View work",
  stack: ["TypeScript", "Next.js", "Node", "Postgres", "MongoDB"],
} as const;

export const aboutContent = {
  eyebrow: "About",
  heading: "Built for the long maintenance window.",
  paragraphs: [
    "I'm Derem Joshua Rivera — a fullstack engineer who likes owning features end to end. I think in systems: constraints, trade-offs, and what 'done' looks like for the people who'll maintain the code six months from now.",
    "I lean on a modern toolchain — including AI in the loop — to ship faster without giving up the boring qualities that make code last: clear boundaries, predictable APIs, accessible UI, and documentation the next person can actually use.",
  ],
  principles: [
    {
      title: "Architecture first",
      body: "Models, contracts, and trade-offs decided up front. Less rework later.",
    },
    {
      title: "Ship and iterate",
      body: "Small, reversible deploys beat heroic launches every time.",
    },
    {
      title: "Documented to hand off",
      body: "If the next dev can't move fast, I haven't shipped yet.",
    },
  ],
} as const;

export const howIShipContent = {
  eyebrow: "Process",
  heading: "How I ship",
  subhead: "A workflow tuned for speed and durability.",
  steps: [
    {
      number: "01",
      title: "Architect",
      body: "Break the problem down, model the data, define the contracts. Decisions get written down in plain language so the next dev moves fast.",
    },
    {
      number: "02",
      title: "Build",
      body: "Type-safe, tested code with a modern toolchain. I pair with AI to ship more in less time, without cutting quality.",
    },
    {
      number: "03",
      title: "Ship & iterate",
      body: "Deploy, monitor, refine. Boring is a feature.",
    },
  ],
} as const;

export const projectsSectionContent = {
  eyebrow: "Selected work",
  heading: "Projects",
  subhead: "Context, stack, and what shipped.",
  empty: "No projects to show yet. Check back soon — or reach out if you'd like to see private work.",
  error: "Couldn't load projects. Refresh the page or try again shortly.",
} as const;

export const resumeSectionContent = {
  heading: "Resume",
  subhead: "Experience and impact at a glance.",
  viewDownload: "Open PDF",
  noResume: "Resume will appear here once uploaded.",
  iframeTitle: "Resume PDF preview",
} as const;

export const toolsSectionContent = {
  eyebrow: "Stack",
  heading: "Tools & technologies",
  subhead: "What I reach for across backend, frontend, data, and shipping.",
  empty: "No tools listed yet.",
} as const;

export const contactSectionContent = {
  eyebrow: "Contact",
  heading: "Let's build something.",
  subhead:
    "Hiring, collaboration, or a product idea — send a note. I usually reply within 2 business days.",
  formTitle: "Send a message",
  followLabel: "Connect",
} as const;

export const footerContent = {
  tagline: "Fullstack engineer · shipping the boring qualities that make products last.",
  rights: "All rights reserved.",
} as const;
```

- [ ] **Step 2: Update `src/config/navigation.ts`**

```ts
export type NavItem = { to: string; label: string };

/** Section ids must match element `id` attributes on the home page. */
export const navLinks: NavItem[] = [
  { to: "landing", label: "Home" },
  { to: "about", label: "About" },
  { to: "process", label: "Process" },
  { to: "projects", label: "Projects" },
  { to: "tools", label: "Tools" },
  { to: "contact", label: "Contact" },
];

export const NAV_SCROLL_OFFSET = -80;
```

Note: `resume` was removed from nav (resume lives inside the Projects section as `<ResumeSection />` and isn't its own anchor in the new layout). `process` is added.

- [ ] **Step 3: Update `src/config/toolCategories.ts`**

```ts
/** Tool section categories — keep ToolModal options and Tools headings in sync. */

export const TOOL_CATEGORY_OPTIONS = [
  { value: "languages", label: "Languages" },
  { value: "frameworks", label: "Frameworks" },
  { value: "data", label: "Data" },
  { value: "devops", label: "DevOps" },
  { value: "ai-workflow", label: "AI Workflow" },
] as const;

export type ToolCategoryValue = (typeof TOOL_CATEGORY_OPTIONS)[number]["value"];

/** Display order for section columns (unknown categories sort last, alphabetically). */
export const TOOL_CATEGORY_ORDER: readonly string[] = [
  "languages",
  "frameworks",
  "data",
  "devops",
  "ai-workflow",
];

export function formatToolCategoryLabel(category: string): string {
  const row = TOOL_CATEGORY_OPTIONS.find((o) => o.value === category);
  if (row) return row.label;
  return category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function sortToolCategoryEntries<T>(entries: [string, T][]): [string, T][] {
  return [...entries].sort((a, b) => {
    const ia = TOOL_CATEGORY_ORDER.indexOf(a[0]);
    const ib = TOOL_CATEGORY_ORDER.indexOf(b[0]);
    if (ia === -1 && ib === -1) return a[0].localeCompare(b[0]);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}
```

**Heads up for executor:** Existing tool documents in MongoDB will have the OLD category strings (`frontend`, `backend`, `database`, `devtools`, `deployment`, `integrations`). Until they're re-categorized via the admin UI, they'll fall into the "unknown — sorts last alphabetically" path of `sortToolCategoryEntries` and display with title-cased raw values. Mention this to the user when surfacing the task; they'll need to migrate categories via the admin UI after deploy.

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 errors. (If `heroContent.headline` consumers in `Navbar.tsx` break — `heroContent.primaryCta` is still defined so the navbar mobile button still works.)

- [ ] **Step 5: Commit (requires user authorization)**

```bash
git add src/config/content.ts src/config/navigation.ts src/config/toolCategories.ts
git commit -m "feat(content): rewrite copy + restructure tool categories + add process nav"
```

---

## Task 7: Rewrite Landing section

**Files:**
- Modify: `src/components/Landing.tsx`

- [ ] **Step 1: Replace `src/components/Landing.tsx` with the Aurora Glass hero**

```tsx
"use client";

import React from "react";
import { scroller } from "react-scroll";
import { motion, useReducedMotion } from "framer-motion";
import { heroContent } from "../config/content";
import { NAV_SCROLL_OFFSET } from "../config/navigation";
import AuroraBackdrop from "./ui/AuroraBackdrop";
import EyebrowLabel from "./ui/EyebrowLabel";
import GradientText from "./ui/GradientText";

const Landing: React.FC = () => {
  const reduceMotion = useReducedMotion();

  const handleScrollTo = (to: string) => {
    scroller.scrollTo(to, {
      smooth: !reduceMotion,
      duration: reduceMotion ? 0 : 500,
      offset: NAV_SCROLL_OFFSET,
    });
  };

  return (
    <section
      id="landing"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-navy text-white pt-28 pb-20"
    >
      <AuroraBackdrop tint="yellow-cyan" />
      <div className="container relative z-10 mx-auto max-w-5xl px-6 sm:px-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          className="flex flex-col items-start gap-8"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6 }}
          >
            <EyebrowLabel withDot>{heroContent.eyebrow}</EyebrowLabel>
          </motion.div>

          <motion.h1
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, type: "spring" }}
            className="text-display-xl"
          >
            {heroContent.headline}{" "}
            <GradientText variant="yellow">{heroContent.headlinePunch}</GradientText>
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6 }}
            className="max-w-readable text-base md:text-lg text-white/75 leading-relaxed"
          >
            {heroContent.subhead}
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            <button
              type="button"
              onClick={() => handleScrollTo("contact")}
              className="rounded-lg bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wide text-brand-navy shadow-brand-glow transition hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={heroContent.primaryCta}
            >
              {heroContent.primaryCta} →
            </button>
            <button
              type="button"
              onClick={() => handleScrollTo("projects")}
              className="rounded-lg border border-hairline-strong bg-surface-glass backdrop-blur-glass px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-accent-cyan hover:text-accent-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
              aria-label={heroContent.secondaryCta}
            >
              {heroContent.secondaryCta}
            </button>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-eyebrow uppercase text-white/45"
          >
            {heroContent.stack.map((item, i) => (
              <React.Fragment key={item}>
                <span>{item}</span>
                {i < heroContent.stack.length - 1 && <span aria-hidden>·</span>}
              </React.Fragment>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Landing;
```

Note: `landing-image.png` import is removed entirely. The 2-card teaser layout is removed. The mobile-only stacked layout is removed (the desktop layout is mobile-friendly because it's a single-column stack).

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Visual verification**

Run: `npm run dev`
Open http://localhost:3000 — verify hero shows: pulsing cyan dot eyebrow → headline with yellow gradient on "Faster." → subhead → two CTAs (yellow primary + glass secondary) → stack chip line. Aurora glow drifts subtly. No `landing-image.png` rendered. Reduced-motion: aurora frozen.

- [ ] **Step 4: Commit (requires user authorization)**

```bash
git add src/components/Landing.tsx
git commit -m "feat(landing): rewrite hero in Aurora Glass language"
```

---

## Task 8: Rewrite About section

**Files:**
- Modify: `src/components/About.tsx`

- [ ] **Step 1: Replace `src/components/About.tsx`**

```tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { aboutContent } from "../config/content";
import AuroraBackdrop from "./ui/AuroraBackdrop";
import GlassCard from "./ui/GlassCard";
import SectionHeader from "./ui/SectionHeader";

const About: React.FC = () => {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-brand-navy py-section-sm md:py-section text-white"
    >
      <AuroraBackdrop tint="cyan-violet" />
      <div className="container relative z-10 mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeader
          eyebrow={aboutContent.eyebrow}
          heading={aboutContent.heading}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
            className="flex flex-col gap-6"
          >
            {aboutContent.paragraphs.map((text, i) => (
              <motion.p
                key={i}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.6 }}
                className="text-base md:text-lg leading-relaxed text-white/80"
              >
                {text}
              </motion.p>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
            className="flex flex-col gap-4"
          >
            {aboutContent.principles.map((principle, i) => (
              <motion.div
                key={principle.title}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5 }}
              >
                <GlassCard className="p-5 sm:p-6" hoverLift>
                  <div className="flex items-start gap-4">
                    <span className="font-mono text-eyebrow text-accent-cyan">{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-lg font-semibold text-white">{principle.title}</h3>
                      <p className="text-sm leading-relaxed text-white/65">{principle.body}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
```

Note: `about-image.png` is no longer imported. If you want a portrait back later, drop it into a separate decoration component — leaving it out keeps the section's focus on the principles.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Visual verification**

Run dev server, scroll to About — verify two paragraphs on left, three numbered glass principle cards on right. Cards lift with cyan edge glow on hover.

- [ ] **Step 4: Commit (requires user authorization)**

```bash
git add src/components/About.tsx
git commit -m "feat(about): rewrite About section with principle cards"
```

---

## Task 9: Build `<HowIShip>` section + wire into page

**Files:**
- Create: `src/components/HowIShip.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `src/components/HowIShip.tsx`**

```tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { howIShipContent } from "../config/content";
import AuroraBackdrop from "./ui/AuroraBackdrop";
import GlassCard from "./ui/GlassCard";
import SectionHeader from "./ui/SectionHeader";

const HowIShip: React.FC = () => {
  return (
    <section
      id="process"
      className="relative overflow-hidden bg-brand-navy py-section-sm md:py-section text-white"
    >
      <AuroraBackdrop tint="yellow-cyan" />
      <div className="container relative z-10 mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeader
          eyebrow={howIShipContent.eyebrow}
          heading={howIShipContent.heading}
          subhead={howIShipContent.subhead}
        />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {howIShipContent.steps.map((step) => (
            <motion.div
              key={step.number}
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              <GlassCard className="h-full p-6 sm:p-7" hoverLift>
                <div className="flex flex-col gap-4">
                  <span className="font-mono text-eyebrow text-accent-cyan">{step.number}</span>
                  <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-white/70">{step.body}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowIShip;
```

- [ ] **Step 2: Wire into `app/page.tsx`**

```tsx
import Landing from "../src/components/Landing";
import About from "../src/components/About";
import HowIShip from "../src/components/HowIShip";
import Projects from "../src/components/Projects";
import Tools from "../src/components/Tools";
import Contact from "../src/components/Contact";

export default function Home() {
  return (
    <>
      <Landing />
      <About />
      <HowIShip />
      <Projects />
      <Tools />
      <Contact />
    </>
  );
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 4: Visual verification**

Run dev server, scroll between About and Projects — new "How I ship" section appears with eyebrow `Process`, heading `How I ship`, subhead, and 3 numbered glass cards in a row (stacked on mobile).

- [ ] **Step 5: Commit (requires user authorization)**

```bash
git add src/components/HowIShip.tsx app/page.tsx
git commit -m "feat(process): add 'How I ship' section between About and Projects"
```

---

## Task 10: Refresh Projects section card layer

**Files:**
- Modify: `src/components/Projects.tsx`

The data layer (`fetchProjects`, `fetchResume`, admin handlers, `<ProjectModal>` usage, `<ResumeModal>` usage, `<ResumeSection>` rendering) is **unchanged**. Only the section chrome and project card visuals get the Aurora Glass treatment.

- [ ] **Step 1: Replace `src/components/Projects.tsx`**

```tsx
"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Upload, Star } from "lucide-react";
import api from "../lib/api/client";
import ProjectModal from "./ProjectModal";
import ResumeModal from "./ResumeModal";
import ResumeSection from "./projects/ResumeSection";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { projectsSectionContent } from "../config/content";
import type { Project, ResumeDoc } from "../types/portfolio";
import AuroraBackdrop from "./ui/AuroraBackdrop";
import GlassCard from "./ui/GlassCard";
import SectionHeader from "./ui/SectionHeader";

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const { isLoggedIn: isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [featuringId, setFeaturingId] = useState<string | null>(null);

  const fetchResume = async () => {
    try {
      const res = await api.get<ResumeDoc[]>("/api/resumes");
      const first = res.data[0];
      setResumeUrl(first?.url || (first as { fileUrl?: string })?.fileUrl || "");
    } catch {
      setResumeUrl("");
    }
  };

  const fetchProjects = async () => {
    setFetchError(false);
    try {
      const res = await api.get<Project[]>("/api/projects");
      setProjects(res.data);
    } catch (e) {
      console.error("Failed to fetch projects:", e);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchResume();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const ok = window.confirm("Are you sure you want to delete this project?");
      if (!ok) return;
      await api.delete("/api/projects", { data: { id } });
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleModalSaved = () => {
    fetchProjects();
    handleModalClose();
  };

  const handleSetFeatured = async (id: string) => {
    setFeaturingId(id);
    try {
      await api.patch(`/api/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.error("Failed to set featured project:", error);
    } finally {
      setFeaturingId(null);
    }
  };

  const featured = projects.find((p) => p.featured);
  const regularProjects = featured ? projects.filter((p) => p !== featured) : projects;

  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-brand-navy py-section-sm md:py-section text-white"
    >
      <AuroraBackdrop tint="yellow-cyan" />
      <div className="container relative z-10 mx-auto max-w-6xl px-6 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow={projectsSectionContent.eyebrow}
            heading={projectsSectionContent.heading}
            subhead={projectsSectionContent.subhead}
          />
          {isAdmin && (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-brand-navy shadow-brand-glow transition hover:bg-accent-hover"
                onClick={() => {
                  setEditingProject(null);
                  setIsModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4" /> Add project
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-hairline-strong bg-surface-glass backdrop-blur-glass px-4 py-2 text-sm font-semibold text-white transition hover:border-accent-cyan hover:text-accent-cyan"
                onClick={() => setIsResumeModalOpen(true)}
              >
                <Upload className="h-4 w-4" /> Upload resume
              </button>
            </div>
          )}
        </div>

        {fetchError && (
          <p className="mt-8 text-center text-red-300/90" role="alert">
            {projectsSectionContent.error}
          </p>
        )}

        {loading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {[...Array(4)].map((_, idx) => (
              <GlassCard key={idx} className="overflow-hidden">
                <div className="h-48 w-full bg-gradient-to-r from-brand-navy-light via-brand-surface to-brand-navy-light shimmer" />
                <div className="space-y-2 p-5">
                  <div className="h-5 w-1/2 rounded bg-accent/20 shimmer" />
                  <div className="h-4 w-full rounded bg-white/10 shimmer" />
                </div>
              </GlassCard>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <p className="mt-12 rounded-2xl border border-dashed border-white/15 bg-surface-glass py-16 text-center text-white/70">
            {projectsSectionContent.empty}
          </p>
        ) : (
          <>
            {featured && (
              <GlassCard className="mt-12 overflow-hidden" hoverLift as="article">
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-1/2 h-[260px] md:h-[340px] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featured.image}
                      alt={featured.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-4 right-4 rounded-full bg-accent px-3 py-1 text-xs font-bold text-brand-navy shadow-brand-glow">
                      Featured
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-3 p-6 md:p-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-white">{featured.title}</h3>
                    <p className="text-white/75 leading-relaxed">{featured.description}</p>
                    <a
                      href={featured.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block w-fit rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-brand-navy shadow-brand-glow transition hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      View project →
                    </a>
                  </div>
                </div>
              </GlassCard>
            )}

            <motion.div
              className="mt-8 grid gap-6 sm:grid-cols-2"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            >
              {regularProjects.map((project) => (
                <motion.div
                  key={project._id}
                  variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <GlassCard className="group flex h-full flex-col overflow-hidden" hoverLift>
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/95 via-brand-navy/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex items-end justify-start p-5">
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-brand-navy shadow-brand-glow transition hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                          aria-label={`View project: ${project.title}`}
                        >
                          View project →
                        </a>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 p-5">
                      <h5 className="text-lg font-semibold text-white">{project.title}</h5>
                      <p className="text-sm leading-relaxed text-white/65 line-clamp-3">{project.description}</p>
                    </div>
                    {isAdmin && (
                      <div className="absolute right-3 top-3 z-20 flex gap-2">
                        <button
                          type="button"
                          className={`rounded-full border p-1.5 ${project.featured ? "border-accent bg-accent text-brand-navy" : "border-hairline-strong bg-surface-glass-strong text-accent backdrop-blur-glass hover:border-accent hover:bg-accent hover:text-brand-navy"}`}
                          onClick={() => handleSetFeatured(project._id)}
                          disabled={featuringId === project._id}
                          aria-label={project.featured ? "Featured project" : "Set as featured"}
                          title={project.featured ? "Featured" : "Set as featured"}
                        >
                          {featuringId === project._id ? (
                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <Star fill={project.featured ? "currentColor" : "none"} className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-hairline-strong bg-red-500/20 p-1.5 text-red-300 backdrop-blur-glass hover:bg-red-500 hover:text-white"
                          onClick={() => handleDelete(project._id)}
                          aria-label="Delete project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-hairline-strong bg-blue-500/20 p-1.5 text-blue-300 backdrop-blur-glass hover:bg-blue-500 hover:text-white"
                          onClick={() => {
                            setEditingProject(project);
                            setIsModalOpen(true);
                          }}
                          aria-label="Edit project"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}

        <ResumeSection resumeUrl={resumeUrl || null} />
      </div>

      {isModalOpen && (
        <ProjectModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSaved={handleModalSaved}
          initialData={editingProject}
        />
      )}

      {isResumeModalOpen && (
        <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} onSaved={fetchResume} />
      )}
    </section>
  );
};

export default Projects;
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Visual verification**

Run dev server, scroll to Projects — verify section uses AuroraBackdrop, SectionHeader, project cards are GlassCard with hover lift + cyan edge glow, featured card sits on top. Loading skeletons render in glass cards. Admin buttons (when logged in) sit in glass icon-buttons.

- [ ] **Step 4: Commit (requires user authorization)**

```bash
git add src/components/Projects.tsx
git commit -m "feat(projects): refresh project cards in Aurora Glass language"
```

---

## Task 11: Refresh Tools section with new categories + glass styling

**Files:**
- Modify: `src/components/Tools.tsx`

The data layer is unchanged. The new `toolCategories.ts` (Task 6) is consumed automatically. Only visuals change.

- [ ] **Step 1: Replace `src/components/Tools.tsx`**

```tsx
"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import ToolModal from "./ToolModal";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import api from "../lib/api/client";
import { useAuth } from "../context/AuthContext";
import type { Tool } from "../types/portfolio";
import { toolsSectionContent } from "../config/content";
import { formatToolCategoryLabel, sortToolCategoryEntries } from "../config/toolCategories";
import AuroraBackdrop from "./ui/AuroraBackdrop";
import GlassCard from "./ui/GlassCard";
import SectionHeader from "./ui/SectionHeader";

const groupByCategory = (tools: Tool[]) => {
  const grouped: Record<string, Tool[]> = {};
  tools.forEach((tool) => {
    if (!grouped[tool.category]) grouped[tool.category] = [];
    grouped[tool.category].push(tool);
  });
  return grouped;
};

const Tools: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn: isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTool, setEditTool] = useState<Tool | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTools = async () => {
    try {
      const res = await api.get<Tool[]>("/api/tools");
      setTools(res.data);
    } catch (err) {
      console.error("Error fetching tools:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this tool?")) return;
    setDeletingId(id);
    try {
      await api.delete("/api/tools", { data: { id } });
      setTools((prev) => prev.filter((tool) => tool._id !== id));
      toast.success("Tool deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete tool. Please try again.");
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const openModal = (tool?: Tool) => {
    setEditTool(tool || null);
    setIsModalOpen(true);
  };

  const groupedTools = groupByCategory(tools);
  const sortedCategoryEntries = sortToolCategoryEntries(Object.entries(groupedTools));

  return (
    <section
      id="tools"
      className="relative overflow-hidden bg-brand-navy py-section-sm md:py-section text-white"
    >
      <AuroraBackdrop tint="cyan-violet" />
      <div className="container relative z-10 mx-auto max-w-6xl px-6 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow={toolsSectionContent.eyebrow}
            heading={toolsSectionContent.heading}
            subhead={toolsSectionContent.subhead}
          />
          {isAdmin && (
            <button
              type="button"
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-brand-navy shadow-brand-glow transition hover:bg-accent-hover"
            >
              <Plus className="h-4 w-4" /> Add tool
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, catIdx) => (
              <GlassCard key={catIdx} className="p-6">
                <div className="h-5 w-1/2 rounded bg-accent/20 shimmer mb-6" />
                <div className="flex flex-wrap gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 w-16 rounded-xl bg-white/10 shimmer" />
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        ) : tools.length === 0 ? (
          <p className="mt-12 rounded-2xl border border-dashed border-white/15 bg-surface-glass py-16 text-center text-white/70">
            {toolsSectionContent.empty}
          </p>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {sortedCategoryEntries.map(([category, items]) => (
              <motion.div
                key={category}
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <GlassCard className="h-full p-6" hoverLift>
                  <h3 className="text-eyebrow uppercase text-accent-cyan mb-5">
                    {formatToolCategoryLabel(category)}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {items.map((tool) => (
                      <div
                        key={tool._id}
                        className="group relative flex flex-col items-center gap-1.5 w-[4.5rem]"
                        title={tool.name}
                      >
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-hairline-strong bg-white/5 transition hover:border-accent-cyan hover:bg-white/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={tool.icon} alt="" className="h-9 w-9 object-contain" />
                          {isAdmin && (
                            <div className="absolute -top-1.5 -right-1.5 z-20 flex gap-0.5">
                              <button
                                type="button"
                                onClick={() => handleDelete(tool._id)}
                                className="rounded-full border border-white/30 bg-red-500/80 p-0.5 text-white shadow backdrop-blur-glass hover:bg-red-500"
                                disabled={deletingId === tool._id}
                                aria-label="Delete tool"
                              >
                                {deletingId === tool._id ? (
                                  <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                  <Trash2 size={11} />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => openModal(tool)}
                                className="rounded-full border border-white/30 bg-blue-500/80 p-0.5 text-white shadow backdrop-blur-glass hover:bg-blue-500"
                                aria-label="Edit tool"
                              >
                                <Pencil size={11} />
                              </button>
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] text-center text-white/65 leading-tight max-h-[2.5rem] overflow-hidden">
                          {tool.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <ToolModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={() => {
          fetchTools();
          setIsModalOpen(false);
        }}
        initialData={editTool}
      />
    </section>
  );
};

export default Tools;
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Visual verification**

Run dev server, scroll to Tools — categories appear as glass cards in a grid; each card holds tool chips with logos. "AI Workflow" category appears (will be empty until tools are re-categorized via admin UI). Admin edit/delete buttons sit on the chip corners.

- [ ] **Step 4: Commit (requires user authorization)**

```bash
git add src/components/Tools.tsx
git commit -m "feat(tools): glass-card category grid with new taxonomy"
```

---

## Task 12: Rewrite Contact section

**Files:**
- Modify: `src/components/Contact.tsx`

Data layer (`fetchSocials`, contact form submission via `useContactFormSubmission`, social CRUD admin handlers, `<SocialModal>` usage, `<ContactMessageForm>` usage) is unchanged.

- [ ] **Step 1: Replace `src/components/Contact.tsx`**

```tsx
"use client";

import React, { useEffect, useState } from "react";
import api from "../lib/api/client";
import { Plus, Trash2, Pencil, Mail, Phone } from "lucide-react";
import SocialModal from "./SocialModal";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/site";
import { contactSectionContent } from "../config/content";
import type { Social } from "../types/portfolio";
import { useContactFormSubmission } from "../hooks/useContactFormSubmission";
import ContactMessageForm from "./ContactMessageForm";
import AuroraBackdrop from "./ui/AuroraBackdrop";
import GlassCard from "./ui/GlassCard";
import SectionHeader from "./ui/SectionHeader";

const Contact: React.FC = () => {
  const [socials, setSocials] = useState<Social[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSocial, setEditSocial] = useState<Social | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loadingSocials, setLoadingSocials] = useState(true);

  const { isLoggedIn } = useAuth();
  const { form, sending, handleSubmit, handleFieldChange } = useContactFormSubmission();

  const fetchSocials = async () => {
    try {
      const res = await api.get<Social[]>("/api/socials");
      setSocials(res.data);
    } catch (err) {
      console.error("Error fetching socials:", err);
    } finally {
      setLoadingSocials(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this social link?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/socials/${id}`);
      setSocials((prev) => prev.filter((s) => s._id !== id));
      toast.success("Social link deleted successfully!");
    } catch (err) {
      toast.error("Delete failed. Please try again.");
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const openModal = (social?: Social) => {
    setEditSocial(social || null);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchSocials();
  }, []);

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-brand-navy py-section-sm md:py-section text-white"
    >
      <AuroraBackdrop tint="cyan-violet" />
      <div className="container relative z-10 mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeader
          eyebrow={contactSectionContent.eyebrow}
          heading={contactSectionContent.heading}
          subhead={contactSectionContent.subhead}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring" }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-4">
              <h3 className="text-eyebrow uppercase text-accent-cyan">{contactSectionContent.followLabel}</h3>
              {isLoggedIn && (
                <button
                  type="button"
                  onClick={() => openModal()}
                  className="inline-flex w-fit items-center gap-2 rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-brand-navy shadow-brand-glow transition hover:bg-accent-hover"
                >
                  <Plus size={14} /> Add social
                </button>
              )}
              <div className="flex flex-wrap gap-3">
                {loadingSocials && socials.length === 0
                  ? [...Array(4)].map((_, i) => (
                      <div key={i} className="h-12 w-12 rounded-xl bg-white/10 shimmer" />
                    ))
                  : socials.map((social) => (
                      <div key={social._id} className="group relative">
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.platform}
                          className="flex h-12 w-12 items-center justify-center rounded-xl border border-hairline-strong bg-surface-glass backdrop-blur-glass transition hover:border-accent-cyan hover:shadow-cyan-glow"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={social.icon} alt="" className="h-6 w-6 object-contain" />
                        </a>
                        <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-brand-navy-light px-2 py-1 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
                          {social.platform}
                        </span>
                        {isLoggedIn && (
                          <div className="absolute -top-2 -right-2 flex gap-1">
                            <button
                              onClick={() => handleDelete(social._id!)}
                              className="rounded-full border border-white/30 bg-red-500/80 p-0.5 text-white backdrop-blur-glass hover:bg-red-500"
                              disabled={deletingId === social._id}
                              aria-label="Delete social"
                            >
                              {deletingId === social._id ? (
                                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              ) : (
                                <Trash2 size={11} />
                              )}
                            </button>
                            <button
                              onClick={() => openModal(social)}
                              className="rounded-full border border-white/30 bg-blue-500/80 p-0.5 text-white backdrop-blur-glass hover:bg-blue-500"
                              aria-label="Edit social"
                            >
                              <Pencil size={11} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 text-white/85">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="inline-flex items-center gap-3 transition hover:text-accent-cyan"
              >
                <Mail className="h-4 w-4 text-accent-cyan" aria-hidden />
                <span className="break-all text-sm md:text-base">{siteConfig.contact.email}</span>
              </a>
              <a
                href={siteConfig.contact.phoneHref}
                className="inline-flex items-center gap-3 transition hover:text-accent-cyan"
              >
                <Phone className="h-4 w-4 text-accent-cyan" aria-hidden />
                <span className="text-sm md:text-base">{siteConfig.contact.phone}</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <GlassCard className="p-6 sm:p-8">
              <ContactMessageForm
                form={form}
                onFieldChange={handleFieldChange}
                onSubmit={handleSubmit}
                sending={sending}
                animated
              />
            </GlassCard>
          </motion.div>
        </div>
      </div>

      <SocialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={() => {
          fetchSocials();
          setIsModalOpen(false);
        }}
        initialData={editSocial}
      />
    </section>
  );
};

export default Contact;
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Visual verification**

Run dev server, scroll to Contact — section header up top; left column has socials in glass tiles + email/phone with cyan icons; right column has the form inside a glass card. Aurora glow drifts.

- [ ] **Step 4: Commit (requires user authorization)**

```bash
git add src/components/Contact.tsx
git commit -m "feat(contact): rewrite Contact in Aurora Glass language"
```

---

## Task 13: Polish Navbar (glass treatment + new nav item)

**Files:**
- Modify: `src/components/Navbar.tsx`

Behavior unchanged. Visual treatment becomes consistent with Aurora Glass: the bottom yellow gradient bar is removed in favor of a hairline border; underline color shifts to cyan; mobile drawer gets glass surface. The new `process` nav item from `navigation.ts` Task 6 is already consumed automatically because `navLinks` is iterated.

- [ ] **Step 1: Replace `src/components/Navbar.tsx`**

```tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { scroller } from "react-scroll";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import myPhoto from "../images/my-photo.png";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { navLinks, NAV_SCROLL_OFFSET } from "../config/navigation";
import { siteConfig } from "@/lib/site";
import { heroContent } from "../config/content";
import GetInTouchModal from "./GetInTouchModal";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const { isLoggedIn, unseenCount, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(navLinks[0].to);
  const navRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});

  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      let found = navLinks[0].to;
      for (let i = 0; i < navLinks.length; i++) {
        const section = document.getElementById(navLinks[i].to);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom > 120) {
            found = navLinks[i].to;
            break;
          }
        }
      }
      setActiveSection(found);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const scrollToSection = (to: string) => {
    scroller.scrollTo(to, {
      smooth: !reduceMotion,
      duration: reduceMotion ? 0 : 500,
      offset: NAV_SCROLL_OFFSET,
    });
  };

  const handleNavClick = (to: string) => {
    if (!isHome) {
      router.push(`/#${to}`);
      setActiveSection(to);
      closeMenu();
      return;
    }
    scrollToSection(to);
    setActiveSection(to);
    closeMenu();
  };

  const handleLogoClick = () => {
    if (!isHome) {
      router.push("/");
      return;
    }
    scrollToSection("landing");
  };

  const handleLogoKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleLogoClick();
    }
  };

  const handleToggle = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const [underlineProps, setUnderlineProps] = useState({ left: 0, width: 0 });
  useEffect(() => {
    const ref = navRefs.current[activeSection];
    if (ref) {
      const rect = ref.getBoundingClientRect();
      const parentRect = ref.parentElement?.getBoundingClientRect();
      if (parentRect) {
        setUnderlineProps({ left: rect.left - parentRect.left, width: rect.width });
      }
    }
  }, [activeSection, isOpen]);

  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 z-50 w-full backdrop-blur-glass transition-all duration-300 ${scrolled ? "bg-brand-navy/85 border-b border-hairline" : "bg-brand-navy/40"}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:py-4">
        <button
          type="button"
          className="group flex items-center gap-2.5 rounded-lg p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
          onClick={handleLogoClick}
          onKeyDown={handleLogoKeyDown}
          aria-label={`${siteConfig.name} — go to home`}
        >
          <span className="inline-flex h-9 w-9 shrink-0 overflow-hidden rounded-full border border-hairline-strong">
            <Image
              src={myPhoto}
              alt=""
              width={40}
              height={40}
              className="h-full w-full rounded-full object-cover"
            />
          </span>
          <span className="text-base font-bold tracking-tight text-white transition group-hover:text-accent-cyan sm:text-lg">
            {siteConfig.shortName}
          </span>
        </button>

        <ul className="relative hidden items-center gap-8 lg:flex">
          <motion.div
            className="absolute -bottom-2 h-px rounded-full pointer-events-none"
            style={{
              left: underlineProps.left,
              width: underlineProps.width,
              background: "linear-gradient(90deg, transparent, #00E0FF, transparent)",
              boxShadow: "0 0 10px rgba(0, 224, 255, 0.6)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            layout
          />
          {navLinks.map(({ to, label }) => (
            <li
              key={to}
              ref={(el: HTMLLIElement | null) => {
                navRefs.current[to] = el;
              }}
              className="relative"
              aria-current={activeSection === to ? "page" : undefined}
            >
              <button
                type="button"
                onClick={() => handleNavClick(to)}
                className={`text-eyebrow uppercase transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan rounded ${activeSection === to ? "text-white" : "text-white/55 hover:text-white"}`}
                aria-label={label}
              >
                {label}
              </button>
            </li>
          ))}
          {isLoggedIn && (
            <li>
              <button
                type="button"
                onClick={() => router.push("/inbox")}
                className="relative text-eyebrow uppercase text-white/70 transition hover:text-accent-cyan"
                aria-label="Inbox"
              >
                Inbox
                {unseenCount > 0 && (
                  <span className="absolute -top-2 -right-3 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-brand-navy">
                    {unseenCount}
                  </span>
                )}
              </button>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-hairline-strong bg-surface-glass px-3 py-1.5 text-eyebrow uppercase text-white transition hover:border-accent-cyan hover:text-accent-cyan"
                aria-label="Logout"
              >
                Logout
              </button>
            </li>
          )}
        </ul>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setContactModalOpen(true)}
            className="rounded-lg bg-accent px-3 py-2 text-xs font-bold uppercase tracking-wide text-brand-navy shadow-brand-glow transition hover:bg-accent-hover"
            aria-label={heroContent.primaryCta}
          >
            {heroContent.primaryCta}
          </button>
          <button
            type="button"
            onClick={handleToggle}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-hairline-strong text-white transition hover:border-accent-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] bg-brand-navy/80 backdrop-blur-glass lg:hidden"
              onClick={closeMenu}
              aria-hidden
            />
            <motion.aside
              key="mobile-menu-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 38 }}
              className="fixed top-0 right-0 z-[110] flex h-[100dvh] w-[min(85vw,18rem)] flex-col border-l border-hairline-strong bg-brand-navy shadow-2xl lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-hairline px-4 py-3">
                <span className="text-eyebrow uppercase text-white/55">Menu</span>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="rounded-lg p-2 text-white transition hover:text-accent-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-4">
                <ul className="flex flex-col gap-1">
                  {navLinks.map(({ to, label }) => (
                    <li key={to} aria-current={activeSection === to ? "page" : undefined}>
                      <button
                        type="button"
                        onClick={() => handleNavClick(to)}
                        className={`flex w-full items-center rounded-xl px-3 py-3 text-left text-sm font-semibold uppercase tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan ${
                          activeSection === to
                            ? "bg-surface-glass text-accent-cyan"
                            : "text-white/70 hover:bg-surface-glass hover:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>

                {isLoggedIn && (
                  <div className="mt-4 border-t border-hairline pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        router.push("/inbox");
                        closeMenu();
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold text-white/80 transition hover:bg-surface-glass hover:text-accent-cyan"
                      aria-label="Inbox"
                    >
                      <span>Inbox</span>
                      {unseenCount > 0 && (
                        <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-brand-navy">
                          {unseenCount > 99 ? "99+" : unseenCount}
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </nav>

              {isLoggedIn && (
                <div className="shrink-0 border-t border-hairline px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-bold text-brand-navy shadow-brand-glow transition hover:bg-accent-hover"
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <GetInTouchModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
    </motion.nav>
  );
};

export default Navbar;
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Visual verification**

Run dev server — navbar is glass with hairline border on scroll, active nav item has cyan underline glow, "Process" appears in nav, mobile drawer is dark glass with cyan accent on active item. Logout button (when logged in) is glass-secondary style.

- [ ] **Step 4: Commit (requires user authorization)**

```bash
git add src/components/Navbar.tsx
git commit -m "feat(navbar): glass treatment with cyan underline and process nav item"
```

---

## Task 14: Polish Footer

**Files:**
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Replace `src/components/Footer.tsx`**

```tsx
"use client";

import React, { useEffect, useState } from "react";
import { scroller } from "react-scroll";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import api from "../lib/api/client";
import { navLinks, NAV_SCROLL_OFFSET } from "../config/navigation";
import type { Social } from "../types/portfolio";
import { siteConfig } from "@/lib/site";
import { footerContent } from "../config/content";
import AuroraBackdrop from "./ui/AuroraBackdrop";

const Footer: React.FC = () => {
  const [socials, setSocials] = useState<Social[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    api
      .get<Social[]>("/api/socials")
      .then((res) => setSocials(res.data))
      .catch(() => {});
  }, []);

  const goToSection = (to: string) => {
    if (pathname !== "/") {
      router.push(`/#${to}`);
      return;
    }
    scroller.scrollTo(to, {
      smooth: !reduceMotion,
      duration: reduceMotion ? 0 : 500,
      offset: NAV_SCROLL_OFFSET,
    });
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden border-t border-hairline bg-brand-navy text-white"
    >
      <AuroraBackdrop tint="violet-yellow" withGrid={false} />
      <div className="container relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold tracking-tight text-white">{siteConfig.name}</span>
          <p className="max-w-md text-sm text-white/60 leading-relaxed">{footerContent.tagline}</p>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
          {navLinks.map(({ to, label }) => (
            <button
              key={to}
              type="button"
              onClick={() => goToSection(to)}
              className="text-eyebrow uppercase text-white/55 transition hover:text-accent-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan rounded"
              aria-label={label}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          {socials.map((social) => (
            <a
              key={social._id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline-strong bg-surface-glass backdrop-blur-glass transition hover:border-accent-cyan hover:shadow-cyan-glow"
              aria-label={social.platform}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={social.icon} alt="" className="h-5 w-5 object-contain" />
            </a>
          ))}
        </div>
      </div>

      <div className="relative z-10 border-t border-hairline px-6 py-4 text-center text-xs text-white/45 sm:px-8">
        &copy; {new Date().getFullYear()} {siteConfig.name}. {footerContent.rights}
      </div>
    </motion.footer>
  );
};

export default Footer;
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Visual verification**

Run dev server, scroll to footer — glass-edge top border, ambient violet/yellow halo, socials in glass tiles, nav links in eyebrow style.

- [ ] **Step 4: Commit (requires user authorization)**

```bash
git add src/components/Footer.tsx
git commit -m "feat(footer): polish in Aurora Glass language"
```

---

## Task 15: Restyle ContactMessageForm

**Files:**
- Modify: `src/components/ContactMessageForm.tsx`

This component is rendered inside `<GlassCard>` from the Contact section. It needs inputs/buttons styled to read on a glass surface and to use the new tokens. Behavior (validation, submission via the `useContactFormSubmission` hook the parent passes) is unchanged.

- [ ] **Step 1: Read the current file**

Run: read `src/components/ContactMessageForm.tsx` and identify (a) the form inputs (likely `<input>`, `<textarea>`), (b) the submit button, (c) the labels, (d) any existing motion treatments.

- [ ] **Step 2: Restyle inputs and button**

Apply this style pattern to **every** input and textarea:

```tsx
className="w-full rounded-lg border border-hairline-strong bg-brand-navy/40 px-4 py-3 text-sm text-white placeholder:text-white/40 transition focus:border-accent-cyan focus:bg-brand-navy/60 focus:outline-none focus:ring-1 focus:ring-accent-cyan"
```

Apply this style to the submit button:

```tsx
className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-bold uppercase tracking-wide text-brand-navy shadow-brand-glow transition hover:bg-accent-hover disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
```

Apply this style to labels (if present):

```tsx
className="text-eyebrow uppercase text-white/60 mb-1.5 block"
```

Remove any old yellow border, gradient bar, or off-brand background colors. Keep all `name`, `value`, `onChange`, `onSubmit`, `disabled`, `aria-*` attributes exactly as they were.

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 4: Visual verification**

Run dev server, scroll to Contact, type into the form fields — inputs have hairline border, focus turns cyan, submit button is yellow primary. Form sits inside the glass card from Task 12.

- [ ] **Step 5: Commit (requires user authorization)**

```bash
git add src/components/ContactMessageForm.tsx
git commit -m "feat(contact-form): restyle inputs and button in Aurora Glass tokens"
```

---

## Task 16: Redesign ProjectModal

**Files:**
- Modify: `src/components/ProjectModal.tsx`

Behavior (open/close, form fields, image upload via `fileInputRef`, submit via `api.put`/`api.post`, toast handling) is **unchanged**. Only the modal shell and form styling change.

- [ ] **Step 1: Replace the JSX return** (everything from `if (!isOpen) return null;` onward)

```tsx
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-hairline-strong bg-brand-navy shadow-glass-lift">
        <div className="pointer-events-none absolute inset-0 opacity-90">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 80% 0%, rgba(0,224,255,0.15) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(255,214,0,0.10) 0%, transparent 50%)",
            }}
          />
        </div>

        <div className="relative z-10 p-6 sm:p-7">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full border border-hairline-strong bg-surface-glass p-1.5 text-white/70 backdrop-blur-glass transition hover:border-accent-cyan hover:text-accent-cyan"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <h2 className="text-eyebrow uppercase text-accent-cyan mb-2">Project</h2>
          <p className="text-xl font-bold text-white mb-6">
            {initialData ? "Edit project" : "Add project"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              className="w-full rounded-lg border border-hairline-strong bg-brand-navy/40 px-4 py-3 text-sm text-white placeholder:text-white/40 transition focus:border-accent-cyan focus:outline-none focus:ring-1 focus:ring-accent-cyan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              placeholder="Description"
              className="w-full rounded-lg border border-hairline-strong bg-brand-navy/40 px-4 py-3 text-sm text-white placeholder:text-white/40 transition focus:border-accent-cyan focus:outline-none focus:ring-1 focus:ring-accent-cyan"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Link (e.g. GitHub or live demo)"
              className="w-full rounded-lg border border-hairline-strong bg-brand-navy/40 px-4 py-3 text-sm text-white placeholder:text-white/40 transition focus:border-accent-cyan focus:outline-none focus:ring-1 focus:ring-accent-cyan"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
            />

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border border-hairline-strong bg-surface-glass px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:border-accent-cyan hover:text-accent-cyan"
              >
                {imageFile || preview ? "Change image" : "Upload image"}
              </button>
              {preview && <img src={preview} alt="Preview" className="h-12 w-12 rounded-lg border border-hairline-strong object-cover" />}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-bold uppercase tracking-wide text-brand-navy shadow-brand-glow transition hover:bg-accent-hover disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand-navy border-t-transparent" />
                  Saving…
                </>
              ) : initialData ? (
                "Update project"
              ) : (
                "Create project"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
```

(Leave all `useState`, `useEffect`, `handleFileChange`, `handleSubmit` logic at the top of the component intact.)

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Visual verification**

Run dev server, log in as admin (or trigger via existing flow), open a project modal — backdrop blurs the page, modal is dark glass with subtle ambient glow, fields have hairline borders that turn cyan on focus, submit button is yellow primary.

- [ ] **Step 4: Commit (requires user authorization)**

```bash
git add src/components/ProjectModal.tsx
git commit -m "feat(project-modal): Aurora Glass shell and inputs"
```

---

## Task 17: Redesign ResumeModal

**Files:**
- Modify: `src/components/ResumeModal.tsx`

- [ ] **Step 1: Read the current file**

Run: read `src/components/ResumeModal.tsx` and identify (a) the modal wrapper (`fixed inset-0`), (b) the inner card surface, (c) the close button, (d) inputs/buttons.

- [ ] **Step 2: Apply the same shell pattern as Task 16**

Wrap the modal contents in this shell (preserving all behavior, state, refs, and event handlers):

- Outer wrapper: `fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-md`
- Card: `relative w-full max-w-lg overflow-hidden rounded-2xl border border-hairline-strong bg-brand-navy shadow-glass-lift`
- Inside the card, add the same ambient glow div (radial-gradient cyan + yellow) as a `pointer-events-none absolute inset-0` decoration
- Wrap actual content in `relative z-10 p-6 sm:p-7`
- Close button: same glass icon-button pattern as Task 16
- Eyebrow + heading: replace the existing modal title with the same `<h2>` eyebrow + `<p>` heading pair (e.g. eyebrow `Resume`, heading `Upload resume` / `Replace resume`)
- All inputs: use the same input style as Task 16
- Primary button: yellow primary as Task 16
- Secondary buttons (e.g., cancel): glass secondary as Task 16

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 4: Visual verification**

Run dev server, log in as admin, open the upload-resume modal — same shell + form styling as ProjectModal.

- [ ] **Step 5: Commit (requires user authorization)**

```bash
git add src/components/ResumeModal.tsx
git commit -m "feat(resume-modal): Aurora Glass shell and inputs"
```

---

## Task 18: Redesign SocialModal

**Files:**
- Modify: `src/components/SocialModal.tsx`

- [ ] **Step 1: Read the current file**

Run: read `src/components/SocialModal.tsx` and identify the modal wrapper, card, close button, and form fields.

- [ ] **Step 2: Apply the same shell + form pattern as Task 16**

- Outer / card / ambient glow / close button: identical to Task 16 patterns
- Eyebrow + heading: `Social link` / `Edit social` or `Add social`
- All text inputs: same style as Task 16
- Submit button: yellow primary

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 4: Visual verification**

Run dev server, log in as admin, scroll to Contact, click Add Social — modal renders with same shell + form style.

- [ ] **Step 5: Commit (requires user authorization)**

```bash
git add src/components/SocialModal.tsx
git commit -m "feat(social-modal): Aurora Glass shell and inputs"
```

---

## Task 19: Redesign ToolModal

**Files:**
- Modify: `src/components/ToolModal.tsx`

- [ ] **Step 1: Read the current file**

Run: read `src/components/ToolModal.tsx`. Note any category select dropdown — it must continue to use `TOOL_CATEGORY_OPTIONS` from `src/config/toolCategories.ts` (which now contains the 5 new categories from Task 6).

- [ ] **Step 2: Apply the shell + form pattern as Task 16**

- Outer / card / ambient glow / close button: identical to Task 16
- Eyebrow + heading: `Tool` / `Edit tool` or `Add tool`
- Text inputs: same style as Task 16
- Category `<select>`: use the same border + bg + cyan focus pattern as inputs:

```tsx
className="w-full rounded-lg border border-hairline-strong bg-brand-navy/40 px-4 py-3 text-sm text-white transition focus:border-accent-cyan focus:outline-none focus:ring-1 focus:ring-accent-cyan"
```

For `<option>` elements, set `style={{ background: "#0a0f29", color: "white" }}` so dropdown options remain readable in browsers that respect option styling. Keep the `value` and `label` mapping consuming `TOOL_CATEGORY_OPTIONS` as before.

- Submit button: yellow primary

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 4: Visual verification**

Run dev server, log in as admin, scroll to Tools, click Add tool — modal renders with same shell. The category dropdown shows the new 5 categories (Languages, Frameworks, Data, DevOps, AI Workflow).

- [ ] **Step 5: Commit (requires user authorization)**

```bash
git add src/components/ToolModal.tsx
git commit -m "feat(tool-modal): Aurora Glass shell and inputs"
```

---

## Task 20: Redesign GetInTouchModal

**Files:**
- Modify: `src/components/GetInTouchModal.tsx`

- [ ] **Step 1: Read the current file**

Run: read `src/components/GetInTouchModal.tsx`. Note that this modal embeds `<ContactMessageForm>` (already restyled in Task 15).

- [ ] **Step 2: Apply the shell pattern as Task 16**

- Outer / card / ambient glow / close button: identical to Task 16
- Heading: eyebrow `Contact` + `Let's build something.` (mirroring the Contact section)
- The embedded `<ContactMessageForm>` will inherit Task 15 styling automatically

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 4: Visual verification**

Run dev server on mobile viewport (or use the mobile "Start a project" button in the navbar) — modal opens with Aurora Glass shell wrapping the contact form.

- [ ] **Step 5: Commit (requires user authorization)**

```bash
git add src/components/GetInTouchModal.tsx
git commit -m "feat(get-in-touch-modal): Aurora Glass shell"
```

---

## Task 21: Final QA — type-check, build, visual pass

**Files:** none modified; verification only.

- [ ] **Step 1: Full type-check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: Build succeeds. Note any new warnings (image optimization warnings are OK; Tailwind purge warnings are OK; React or TS errors are not).

- [ ] **Step 3: Manual visual QA in browser**

Run: `npm run dev`, open http://localhost:3000

Walk through every section in order and verify:
- **Hero:** pulsing cyan dot eyebrow, headline with yellow gradient on "Faster.", two CTAs (yellow + glass), stack chip line. Aurora drifts.
- **About:** eyebrow + heading + 2 paragraphs (left), 3 numbered glass principle cards (right). Cards lift with cyan edge glow on hover.
- **How I ship:** eyebrow `Process`, 3 numbered glass step cards in a row.
- **Projects:** featured card on top (if a project is featured), grid of glass project cards below. Hover shows cyan edge glow + view-project CTA overlay.
- **Tools:** glass cards per category. "AI Workflow" category appears (may be empty until tools are recategorized via admin UI).
- **Contact:** eyebrow + heading; left has socials + email/phone with cyan icons; right has form in glass card.
- **Footer:** glass-edge top border, ambient halo, socials in glass tiles.
- **Navbar:** glass background with hairline border on scroll, cyan underline on active item, "Process" item appears.
- **Mobile (resize to 375px):** every section stacks cleanly, mobile drawer opens with glass treatment, Start-a-project button works in navbar.

Trigger every modal:
- ProjectModal: log in (set localStorage `admin-token` or via `/login` form), click Add project — Aurora Glass shell + form render.
- ToolModal: click Add tool — Aurora Glass shell + form render; category dropdown shows 5 categories.
- SocialModal: click Add social — Aurora Glass shell + form render.
- ResumeModal: click Upload resume — Aurora Glass shell + form render.
- GetInTouchModal: on mobile, tap the navbar "Start a project" button — Aurora Glass shell + contact form render.

- [ ] **Step 4: Reduced-motion check**

In OS settings (or via DevTools `Rendering > Emulate CSS media feature prefers-reduced-motion: reduce`), reload the page and confirm aurora drift and pulsing dots are frozen but content remains readable.

- [ ] **Step 5: Note known follow-ups for the user**

Surface this list to the user in chat (do not commit a doc):
1. **Tool category migration:** existing tool documents in MongoDB use the old categories (`frontend`, `backend`, etc). They'll display under title-cased raw names until each is re-categorized via Admin → Tools → Edit. After a few are recategorized, the "AI Workflow" category will populate as Claude Code / Cursor / Copilot / ChatGPT entries get added.
2. **Resume nav anchor:** the `resume` nav link was removed. The `<ResumeSection>` still renders inside Projects. If the user wants a dedicated resume anchor in the new nav, add it back to `navigation.ts` and ensure `<ResumeSection>` exposes an `id="resume"` element.
3. **About image:** `about-image.png` import was removed. If the user wants a portrait, drop it into a separate decoration or add it back inside a `<GlassCard>` wrapper.
4. **Landing image:** `landing-image.png` import was removed. The aurora backdrop replaces it.

- [ ] **Step 6: No commit needed for this task** (verification only)

---

## Self-review checklist (run before declaring plan complete)

- [x] Spec coverage: every section in the spec maps to one or more tasks
  - Visual language → Tasks 1, 2
  - Primitives → Tasks 3, 4, 5
  - Landing rewrite → Task 7
  - About rewrite → Task 8
  - How I ship (new) → Task 9
  - Projects refresh → Task 10
  - Tools restructure → Tasks 6 (config) + 11 (visuals)
  - Contact rewrite → Task 12
  - Modal full redesign (5 modals) → Tasks 16–20
  - Navbar polish → Task 13
  - Footer polish → Task 14
  - ContactMessageForm polish → Task 15
  - Final QA → Task 21
- [x] No placeholder language (TBD, TODO, "fill in")
- [x] Type consistency: `AuroraBackdrop` `tint` prop values (`yellow-cyan`, `cyan-violet`, `violet-yellow`) match across all section usages
- [x] Tool category names (`languages`, `frameworks`, `data`, `devops`, `ai-workflow`) consistent between `toolCategories.ts` and the ToolModal description in Task 19
- [x] Nav `process` anchor matches the `id="process"` on `<HowIShip>` section
- [x] No reference to removed images (`landing-image.png`, `about-image.png`) in the new code
