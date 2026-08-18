/**
 * Static content for the "Atelier — The Build Log" single-page portfolio design.
 * Marketing copy, the typed-terminal script, process pipeline, and the canonical
 * résumé record live here. DB-backed sections (projects, tools, socials, résumé PDF)
 * are fetched at runtime; the values below are presentation copy and graceful fallbacks.
 */
import type { CaseStudy, Project } from "../types/portfolio";

/** Atelier palette (kept in sync with the `atelier` tokens in tailwind.config.js). */
export const ATELIER = {
  ink: "#0A0A0B",
  surface: "#121214",
  paper: "#F2EFE8",
  muted: "#A39F96",
  faint: "#6E6A62",
  gold: "#E0A53D",
  goldDeep: "#C9952E",
  green: "#7FB996",
} as const;

/** Dot accent cycle used across work cards, stack groups, etc. */
export const DOT_CYCLE = [ATELIER.gold, ATELIER.green, ATELIER.muted] as const;

/* ----------------------------------------------------------------- NAV */
export const atelierNavLinks = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "process", label: "Process" },
  { id: "resume", label: "Résumé" },
  { id: "contact", label: "Contact" },
] as const;

/* ---------------------------------------------------------------- HERO */
export type TermSegment = { t: string; c?: string };

export const heroContent = {
  eyebrow: 'Derem Joshua Rivera — "DJ"',
  headlineLines: ["Full-stack", "developer &"] as const,
  headlineAccent: "system builder.",
  intro:
    "I bring ideas to life through thoughtful design and seamless development — crafting responsive, user-centered applications across the front-end and back-end.",
  primaryCta: "Get in touch →",
  secondaryCta: "View selected work",
  terminalTitle: "~/dj/stack.ts",
  chips: ["TypeScript", "REST APIs", "CI/CD", "Responsive"],
  scrollCue: "SCROLL TO ENTER THE WORK ↓",
  locale: "PH / REMOTE",
} as const;

/** Typed-terminal script — segments carry optional token colors. */
export const terminalScript: TermSegment[][] = [
  [{ t: "$ ", c: ATELIER.green }, { t: "whoami" }],
  [{ t: "Derem Joshua Rivera · full-stack", c: ATELIER.paper }],
  [],
  [{ t: "const ", c: ATELIER.gold }, { t: "stack", c: ATELIER.paper }, { t: " = {" }],
  [
    { t: "  frontend: [" },
    { t: "'Vue'", c: ATELIER.green },
    { t: ", " },
    { t: "'React'", c: ATELIER.green },
    { t: ", " },
    { t: "'Next'", c: ATELIER.green },
    { t: "]," },
  ],
  [
    { t: "  backend:  [" },
    { t: "'Laravel'", c: ATELIER.green },
    { t: ", " },
    { t: "'Node'", c: ATELIER.green },
    { t: "]," },
  ],
  [
    { t: "  data:     [" },
    { t: "'MySQL'", c: ATELIER.green },
    { t: ", " },
    { t: "'MongoDB'", c: ATELIER.green },
    { t: "]," },
  ],
  [
    { t: "  cloud:    [" },
    { t: "'AWS'", c: ATELIER.green },
    { t: ", " },
    { t: "'Vercel'", c: ATELIER.green },
    { t: "]," },
  ],
  [{ t: "};" }],
  [{ t: "// ready to build →", c: ATELIER.faint }],
];

/* ------------------------------------------------------------- MARQUEE */
export const marqueeItems = [
  "Laravel",
  "Vue",
  "React",
  "Next.js",
  "Node",
  "MongoDB",
  "MySQL",
  "AWS",
  "Tailwind",
  "Express",
  "Git",
  "PHP",
] as const;

/* --------------------------------------------------------------- WORK */
export const workContent = {
  eyebrow: "02 — SELECTED WORK",
  heading: "The build log",
} as const;

/* -------------------------------------------------------------- ABOUT */
export const aboutContent = {
  eyebrow: "01 — ABOUT",
  headingTop: "Engineering background.",
  headingAccent: "Builder's",
  headingTail: " instinct.",
  paragraphs: [
    "I’m Derem Joshua Rivera, a Full Stack Web Developer who transforms ideas into engaging digital solutions. With roots in engineering and a strong drive to innovate, I transitioned into web development to merge my technical expertise with a passion for building creative, user-centered experiences.",
    "I specialize in building intuitive, responsive applications that serve both users and business goals. From designing seamless front-end interfaces with Vue.js to developing powerful back-end systems using Laravel, I thrive in every stage of the development process.",
  ],
  photo: "/atelier/about-image.png",
  photoCaption: "THE PERSON BEHIND THE WORK",
  photoTag: "est. engineering → web",
  facts: [
    { k: "FOCUS", v: "Full-stack web" },
    { k: "STACK", v: "MERN · Laravel/Vue · Next.js · Inertia" },
    { k: "BASED", v: "Philippines · Remote" },
  ],
} as const;

/* -------------------------------------------------------------- STACK */
export const stackContent = {
  eyebrow: "03 — THE STACK",
  headingTop: "Tools of the ",
  headingAccent: "trade",
  subhead:
    "The technologies I reach for across the stack — chosen for fit, not fashion, and used in production.",
} as const;

export type StackGroup = {
  label: string;
  dot: string;
  items: { name: string; icon: string; tag: string }[];
};

/** The four stacks I build with — curated group cards for the Stack section. */
export const stackGroups: StackGroup[] = [
  {
    label: "MERN STACK",
    dot: ATELIER.gold,
    items: [
      { name: "MongoDB", icon: "/atelier/logos/mongodb.png", tag: "Document database" },
      { name: "Express", icon: "/atelier/logos/express.png", tag: "Node web framework" },
      { name: "React", icon: "/atelier/logos/react.png", tag: "UI library" },
      { name: "Node.js", icon: "/atelier/logos/nodejs.png", tag: "JS runtime" },
    ],
  },
  {
    label: "LARAVEL + VUE",
    dot: ATELIER.green,
    items: [
      { name: "Laravel", icon: "/atelier/logos/laravel.png", tag: "PHP framework" },
      { name: "Vue.js", icon: "/atelier/logos/vue.png", tag: "SPA framework" },
      { name: "PHP", icon: "/atelier/logos/php.png", tag: "Server language" },
      { name: "MySQL", icon: "/atelier/logos/mysql.png", tag: "Relational database" },
    ],
  },
  {
    label: "NEXT.JS",
    dot: ATELIER.muted,
    items: [
      { name: "Next.js", icon: "/atelier/logos/nextjs.png", tag: "React framework" },
      { name: "React", icon: "/atelier/logos/react.png", tag: "UI library" },
      { name: "TypeScript", icon: "/atelier/logos/javascript.png", tag: "Typed JavaScript" },
      { name: "Tailwind", icon: "/atelier/logos/tailwind.png", tag: "Utility CSS" },
    ],
  },
  {
    label: "INERTIA.JS",
    dot: ATELIER.gold,
    items: [
      { name: "Inertia.js", icon: "", tag: "The modern monolith" },
      { name: "Laravel", icon: "/atelier/logos/laravel.png", tag: "PHP backend" },
      { name: "Vue.js", icon: "/atelier/logos/vue.png", tag: "SPA frontend" },
    ],
  },
];

/* ------------------------------------------------------------ PROCESS */
export const processContent = {
  eyebrow: "04 — HOW I SHIP",
  headingTop: "From idea to ",
  headingAccent: "shipped",
  subhead:
    "A professional build pipeline — transparent and iterative. You stay in the loop from the first call to the final deploy, with working software at every step.",
} as const;

export type ProcessStage = {
  no: string;
  title: string;
  time: string;
  deliver: string;
  desc: string;
  log: { t: string; done: boolean };
};

export const processStages: ProcessStage[] = [
  {
    no: "01",
    title: "Discover & scope",
    time: "DAY 1–3",
    deliver: "Proposal, scope doc & timeline",
    desc: "A kickoff call to lock goals, scope and constraints — written down and agreed before any code.",
    log: { t: "→ scoping goals & requirements", done: false },
  },
  {
    no: "02",
    title: "Design the system",
    time: "WEEK 1",
    deliver: "Wireframes + UI on a shared system",
    desc: "Wireframes, then high-fidelity UI on a shared design system. We align on look and flow first.",
    log: { t: "→ designing UI on a shared system", done: false },
  },
  {
    no: "03",
    title: "Build in increments",
    time: "WEEKS 2–6",
    deliver: "Working app, updated each sprint",
    desc: "Front-end and back-end shipped in small, tested slices. You see working software every few days.",
    log: { t: "→ building features in tested slices", done: false },
  },
  {
    no: "04",
    title: "Ship to production",
    time: "LAUNCH",
    deliver: "Live site on your domain",
    desc: "Deploy through CI/CD with domain, SSL and monitoring. Fast, stable and observable from day one.",
    log: { t: "✓ deployed to production via CI/CD", done: true },
  },
  {
    no: "05",
    title: "Support & iterate",
    time: "ONGOING",
    deliver: "Docs, training & a support window",
    desc: "Handover docs, training and ongoing iteration. I stay on until it runs itself — then keep improving it.",
    log: { t: "✓ handover, docs & ongoing support", done: true },
  },
];

/* ------------------------------------------------------------- RÉSUMÉ */
export const resumeContent = {
  eyebrow: "05 — RÉSUMÉ",
  headingTop: "The full ",
  headingAccent: "record",
  downloadLabel: "Download PDF ↓",
  fallbackPdf: "/atelier/Derem-Joshua-Rivera-Resume.pdf",
  identity: {
    name: "Derem Joshua Rivera",
    title: "FULL STACK DEVELOPER · LICENSED CIVIL ENGINEER",
    contact: ["Quezon City, Philippines", "+63 933 851 8806", "djrrivera25@gmail.com"],
    site: "djrrivera.dev",
  },
  summary:
    "Full Stack Developer delivering scalable, user-focused web applications. Combines the precision of a Licensed Civil Engineer with modern development across Vue, React, Next.js, Node, Express and Laravel — taking projects from concept to deployment with clean, maintainable code.",
  experience: [
    {
      role: "Web Developer",
      company: "VA4U — Tools Australia",
      dates: "SEP 2025 — PRESENT",
      bullets: [
        "Designed and built a full-stack eCommerce rewards & giveaway platform in 2 months, including a complete admin dashboard for analytics, user and product management.",
        "Integrated Stripe (payments), Meta CAPI & Marketing API (tracking), SendGrid & Klaviyo (email automation), and Hotjar (behavior insights).",
        "Scaled the platform to 20,000+ users — 50 daily conversions and AUD 3,000–5,000 in daily revenue.",
        "Improved SEO performance, increasing organic traffic and user acquisition.",
      ],
    },
    {
      role: "Full Stack Developer",
      company: "Self-Employed — Freelance",
      dates: "MAR 2025 — PRESENT",
      bullets: [
        "Delivered 3 complete full-stack applications plus 1 long-term maintenance project — 100% client satisfaction.",
        "Migrated a Vue.js application to React.js, improving maintainability and feature velocity.",
        "Converted a WordPress site to Inertia.js, and turned Figma UI/UX into production code.",
      ],
    },
    {
      role: "Project Engineer",
      company: "Urban Development Corporation",
      dates: "AUG 2023 — APR 2025",
      bullets: [
        "Managed ₱50–60M budgets and cross-functional teams, delivering 3 large-scale builds 100% on schedule.",
        "Led end-to-end execution from blueprint to delivery — discipline now applied to software lifecycles.",
        "Streamlined workflows, accelerating timelines by 15%.",
      ],
    },
  ],
  education: [
    { course: "Full Stack Web Development", school: "Zuitt Coding Bootcamp", dates: "APR — JUN 2025" },
    {
      course: "BS Civil Engineering",
      school: "Technological Institute of the Philippines — QC",
      dates: "2018 — 2022",
    },
  ],
  skills: [
    { label: "Frontend", tags: ["HTML5", "CSS3", "Tailwind", "Bootstrap", "React", "Vue", "Next.js", "Figma"] },
    {
      label: "Backend",
      tags: ["JavaScript", "TypeScript", "Node.js", "Express", "PHP", "Laravel", "REST APIs", "MongoDB", "MySQL"],
    },
    { label: "Cloud & Deploy", tags: ["AWS", "GCP", "Vercel", "Render"] },
    { label: "Tooling", tags: ["Git", "GitHub", "GitLab", "Postman", "Trello", "Agile / Scrum"] },
    { label: "Integrations", tags: ["Stripe", "Meta CAPI", "Meta Marketing", "Klaviyo", "SendGrid", "Hotjar"] },
  ],
  certs: [
    { name: "Full Stack Web Development", org: "Zuitt Coding Bootcamp", meta: "Obtained Jun 2025" },
    {
      name: "Licensed Civil Engineer",
      org: "Professional Regulatory Commission",
      meta: "License 0197105 · Jun 2023 · 82.3%",
    },
  ],
  freelanceHeading: "SELECTED FREELANCE & PERSONAL PROJECTS",
  freelance: [
    {
      name: "Maximum88",
      url: "https://maximum88.com/",
      desc: "WordPress → Inertia.js + React conversion. Migrated every frontend component across the public pages and the admin pages.",
      stack: ["Inertia.js", "React"],
    },
    {
      name: "Gym Workout Tracker",
      url: "https://gym-workout-tracker-roan.vercel.app/",
      desc: "Personal app to track gym progress and macros, with social selfie sharing.",
      stack: ["Next.js", "Vercel", "Neon", "Drizzle"],
    },
    {
      name: "Ian & Yana — Wedding",
      url: "https://ian-yana-habambuhay-ang-pelikula.vercel.app/",
      desc: "Wedding site designed to the client's theme, with RSVP gated to the guest list.",
      stack: ["Next.js", "Vercel", "Neon", "Drizzle"],
    },
    {
      name: "Wedding Website",
      url: "https://wedding-one-pi-78.vercel.app/",
      desc: "My sister's wedding site, themed to the client, with RSVP gated to the guest list.",
      stack: ["Next.js", "Vercel", "MongoDB"],
    },
    {
      name: "Architectural Firm — Weave",
      url: "https://architectural-firm-weave-cp.vercel.app/",
      desc: "Marketing site with employee login and a self-service CMS so staff can relayout and update content without a developer.",
      stack: ["Next.js", "Vercel", "MongoDB"],
    },
    {
      name: "Naty's Handicraft",
      url: "https://natyshandicraft-app.vercel.app/",
      desc: "Philippine eCommerce for a growing Dapitan Arcade business — item recording, stocking, and inventory.",
      stack: ["Next.js", "Vercel", "MongoDB"],
    },
  ],
} as const;

/* ------------------------------------------------------------ CONTACT */
export const contactContent = {
  eyebrow: "06 — CONTACT",
  availability: "AVAILABLE FOR NEW PROJECTS",
  headingTop: "Let’s build",
  headingTail: "something ",
  headingAccent: "good",
  paragraph:
    "Have a project in mind, a question, or just want to connect? I read every message and reply within a day.",
  formTitle: "DROP A LINE",
  replyNote: "Replies within 24h",
  success: {
    title: "Message noted.",
    body: "Thanks for reaching out — I’ll get back to you shortly.",
    again: "Send another",
  },
} as const;

/** Default social row (URLs overlaid from /api/socials by platform when available). */
export const defaultSocials: { platform: string; url: string }[] = [
  { platform: "Facebook", url: "#" },
  { platform: "Instagram", url: "#" },
  { platform: "LinkedIn", url: "#" },
  { platform: "GitHub", url: "https://github.com/DJRivera25" },
];

/* ------------------------------------------------------------- FOOTER */
export const footerContent = {
  name: "Derem Joshua Rivera — Full-Stack Developer",
  copyright: "© 2026 · BUILT FROM SCRATCH",
  backToTop: "BACK TO TOP ↑",
} as const;

/* ------------------------------------------------ PROJECT → CASE STUDY */

/**
 * Curated running order for "The Build Log" — strongest, most recent client work first.
 * Matched on title (trimmed, case-insensitive); projects not listed here keep their API
 * order and sort last, so a newly added project still shows up without a code change.
 */
export const PROJECT_DISPLAY_ORDER: readonly string[] = [
  "Tools Australia",
  "Maximum88",
  "Wedding Website",
  "Weave Collaboration Partners",
  "Pokemon Explorer",
  "E-commerce Full-Stack Website (Capstone Project – Zuitt Coding Bootcamp)",
  "ECommerce (Next.js) - In Progress",
  "Tiket Lakwatsero",
];

const orderKey = (title: string) => title.trim().toLowerCase();
const ORDER_INDEX = new Map(PROJECT_DISPLAY_ORDER.map((title, i) => [orderKey(title), i]));

export function sortProjectsForDisplay(projects: Project[]): Project[] {
  return [...projects]
    .map((project, i) => ({ project, i, rank: ORDER_INDEX.get(orderKey(project.title)) }))
    .sort((a, b) => {
      if (a.rank === undefined && b.rank === undefined) return a.i - b.i;
      if (a.rank === undefined) return 1;
      if (b.rank === undefined) return -1;
      return a.rank - b.rank;
    })
    .map((row) => row.project);
}

const truncate = (value: string, max = 120) =>
  value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value;

/** Map a DB Project into the presentation CaseStudy view-model, with graceful fallbacks. */
export function toCaseStudy(project: Project, index: number): CaseStudy {
  const stack = project.tags ?? [];
  return {
    id: project._id,
    no: String(index + 1).padStart(2, "0"),
    year: project.year ? String(project.year) : "",
    kind: (project.kind || stack[0] || "PROJECT").toUpperCase(),
    dot: DOT_CYCLE[index % DOT_CYCLE.length],
    title: project.title,
    tagline: project.tagline || truncate(project.description),
    image: project.image,
    stack,
    role: project.role || "Full-stack",
    problem: project.problem || project.description,
    solution: project.solution || "",
    highlights: project.highlights ?? [],
    link: project.link || "#",
    statusLabel: "LIVE PROJECT",
  };
}

/** Sample case studies shown when the projects API returns nothing. */
export const fallbackCaseStudies: CaseStudy[] = [
  {
    id: "fallback-tiket",
    no: "01",
    year: "2024",
    kind: "TRAVEL BOOKING PLATFORM",
    dot: ATELIER.gold,
    title: "Tiket Lakwatsero",
    tagline: "A travel & ticket booking platform — search routes, pick seats, and pay online.",
    image: "/atelier/tiket-lakwatsero.png",
    stack: ["Laravel", "Vue", "MySQL", "Tailwind"],
    role: "Full-stack — UI, front-end & API",
    problem:
      "Local travelers relied on phone-call reservations with no way to see seat availability or pay ahead, while operators tracked every trip by hand.",
    solution:
      "Built a booking flow with route & schedule search, a live seat map, online payment, and an operator dashboard to manage trips, seats, and bookings in real time.",
    highlights: ["Seat-level booking", "Online payments", "Operator dashboard"],
    link: "#",
    statusLabel: "LIVE PROJECT",
  },
  {
    id: "fallback-ecommerce",
    no: "02",
    year: "2023",
    kind: "E-COMMERCE",
    dot: ATELIER.green,
    title: "eCommerce Platform",
    tagline: "A complete storefront with cart, checkout, and an admin back office.",
    image: "/atelier/ecommerce.png",
    stack: ["Laravel", "Vue", "MySQL"],
    role: "Full-stack",
    problem:
      "A growing seller needed catalog, cart, and order management unified in one place instead of scattered across spreadsheets.",
    solution:
      "Delivered a product catalog, cart & checkout, and an admin panel for inventory, orders, and basic analytics — one system, end to end.",
    highlights: ["Catalog & cart", "Inventory admin", "Order tracking"],
    link: "#",
    statusLabel: "LIVE PROJECT",
  },
  {
    id: "fallback-cms",
    no: "03",
    year: "2024",
    kind: "CMS · THIS SITE",
    dot: ATELIER.muted,
    title: "Portfolio CMS",
    tagline: "The authenticated admin & REST API that powers this very portfolio.",
    image: "/atelier/mockup.png",
    stack: ["Next.js", "Node", "Express", "MongoDB"],
    role: "Full-stack",
    problem: "Keeping the portfolio current meant a redeploy for every new project, tool, or message.",
    solution:
      "Built a JWT-secured admin and REST API with CRUD for projects, tools, and socials, résumé uploads, and a contact-message inbox — every section editable live.",
    highlights: ["JWT auth", "REST API", "Live editing"],
    link: "#",
    statusLabel: "LIVE PROJECT",
  },
];

/* ------------------------------------------------ COMMAND PALETTE ITEMS */
export const paletteSections = [
  { k: "▸", label: "Selected Work", hint: "work", id: "work" },
  { k: "◆", label: "About", hint: "about", id: "about" },
  { k: "❖", label: "Stack", hint: "stack", id: "stack" },
  { k: "⟿", label: "How I Ship", hint: "process", id: "process" },
  { k: "▤", label: "Résumé", hint: "resume", id: "resume" },
  { k: "✦", label: "Contact", hint: "contact", id: "contact" },
] as const;
