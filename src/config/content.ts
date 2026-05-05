/**
 * Marketing copy — Aurora Glass redesign. Edit here to update multiple sections.
 */
export const heroContent = {
  eyebrow: "Available — open to roles & projects",
  headline: "Ship more. Ship better.",
  headlinePunch: "Faster.",
  subhead:
    "Fullstack engineer. Civil engineering taught me to think in systems — web is where I ship them. eCommerce platforms, dashboards, and integrations taken from concept to production, designed to scale.",
  primaryCta: "Start a project",
  secondaryCta: "View work",
  stack: ["TypeScript", "React", "Next.js", "Node", "Laravel", "MongoDB"],
} as const;

export const aboutContent = {
  eyebrow: "About",
  heading: "Built for the long maintenance window.",
  paragraphs: [
    "I'm Derem Joshua Rivera — a fullstack engineer. I trained and licensed as a Civil Engineer before transitioning into web, and that background still shapes how I work: I think in systems — constraints, trade-offs, and what 'done' looks like for the people who'll maintain the work six months from now.",
    "In the last year I shipped a production eCommerce rewards platform end to end at VA4U / Tools Australia — admin dashboard, Stripe payments, Meta CAPI & Marketing API tracking, SendGrid + Klaviyo email automation, Hotjar insights — scaled to 20,000+ users and AUD 3,000–5,000 in daily revenue. I lean on a modern toolchain (including AI in the loop) to ship faster without giving up the boring qualities that make code last: clear boundaries, predictable APIs, accessible UI, and documentation the next person can actually use.",
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
  subhead: "Production work — context, stack, and what shipped.",
  empty: "No projects to show yet. Check back soon — or reach out if you'd like to see private work.",
  error: "Couldn't load projects. Refresh the page or try again shortly.",
} as const;

export const resumeSectionContent = {
  eyebrow: "Resume",
  heading: "Resume",
  subhead: "Experience and impact at a glance.",
  viewDownload: "Download PDF",
  noResumeFile: "PDF version not uploaded yet.",
} as const;

/** Resume content — kept verbatim with the source PDF so it stays canonical for hiring. */
export const resumeContent = {
  identity: {
    name: "Derem Joshua Rivera",
    title: "Full Stack Developer · Licensed Civil Engineer",
    location: "Blk 68 Lt 16 Franc St., North Fairview Subd., Quezon City",
  },
  summary:
    "Full Stack Developer with 1 year of experience delivering scalable, user-focused web applications. Combines the precision of a Licensed Civil Engineer with modern development skills in Vue, React, Next.js, Node.js, Express, and Laravel. Adept at taking projects from concept to deployment, managing workflows efficiently, and writing clean, maintainable code.",
  competencies: [
    {
      category: "Frontend Development",
      items: [
        "HTML5",
        "CSS3",
        "Bootstrap",
        "Tailwind CSS",
        "React.js",
        "Vue.js",
        "Next.js",
        "Responsive Web App Design",
        "Web Design",
        "Wireframing & Mockups (Figma)",
      ],
    },
    {
      category: "Backend Development",
      items: [
        "JavaScript (ES6+)",
        "TypeScript",
        "Node.js",
        "Express.js",
        "PHP",
        "Laravel",
        "REST API Development",
        "MongoDB",
        "MySQL",
      ],
    },
    {
      category: "Testing & API Tools",
      items: ["Postman", "Unit Testing", "Integration Testing"],
    },
    {
      category: "Cloud & Deployment Platforms",
      items: ["AWS", "GCP", "Vercel", "Render"],
    },
    {
      category: "Version Control & Collaboration",
      items: ["Git", "GitHub", "GitLab", "Trello"],
    },
    {
      category: "Project Management & Methodologies",
      items: ["Agile", "Scrum", "Waterfall", "SDLC"],
    },
    {
      category: "Third-Party API Integrations",
      items: ["Stripe", "Meta CAPI", "Meta Marketing API", "Klaviyo", "SendGrid", "Hotjar"],
    },
  ],
  experience: [
    {
      role: "Web Developer",
      company: "VA4U — Tools Australia",
      period: "September 2025 — Present",
      bullets: [
        "Designed and developed a full-stack eCommerce rewards and giveaway platform within 2 months, including a complete admin dashboard for analytics, user, and product management.",
        "Integrated third-party services: Stripe (payments), Meta CAPI & Marketing API (tracking), SendGrid & Klaviyo (email automation), and Hotjar (user behavior insights).",
        "Scaled platform to 20,000+ users, generating 50 daily conversions and AUD 3,000–5,000 in daily revenue.",
        "Improved SEO performance, increasing organic traffic and user acquisition.",
      ],
    },
  ],
} as const;

export const toolsSectionContent = {
  eyebrow: "Stack",
  heading: "Tools & technologies",
  subhead: "What I reach for across frontend, backend, data, deploy, and the integrations that actually ship revenue.",
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
  tagline: "Fullstack engineer with a Civil Engineer's discipline — shipping production web apps end to end.",
  rights: "All rights reserved.",
} as const;
