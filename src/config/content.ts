/**
 * Marketing copy — hybrid positioning (fullstack). Edit here to update multiple sections.
 */
export const heroContent = {
  headline: "Fullstack engineer building products end to end.",
  subhead:
    "APIs, databases, and interfaces that stay maintainable as you scale—shipping reliable features with clear ownership across the stack.",
  primaryCta: "Get in touch",
  secondaryAbout: "About me",
  secondaryWork: "View work",
  /** Mobile teaser cards */
  teaserAbout:
    "I care about architecture, DX, and delivery—turning ambiguous requirements into shippable software with measurable outcomes.",
  teaserWork:
    "From data modeling and services to polished UI, here’s a snapshot of projects and the problems they solve.",
} as const;

export const aboutContent = {
  heading: "About me",
  paragraphs: [
    "I’m Derem Joshua Rivera—a fullstack engineer who enjoys owning features from database to UI. My background in engineering helps me reason about systems: constraints, trade‑offs, and what “done” should mean for users and the team maintaining the code.",
    "I build intuitive, responsive applications with modern stacks (including Laravel/Vue and React/Next.js patterns) and focus on APIs that are predictable, testable, and easy to extend. Performance, accessibility, and clear boundaries between layers matter to me.",
    "I collaborate closely on requirements, propose pragmatic architecture, and document enough that the next developer can move fast. Outside of work I value family, faith, music, and using my skills to serve others.",
  ],
} as const;

export const projectsSectionContent = {
  heading: "Projects",
  subhead: "Selected work—context, stack, and what shipped.",
  empty: "No projects to show yet. Check back soon—or reach out if you’d like to see private work.",
  error: "Couldn’t load projects. Refresh the page or try again shortly.",
} as const;

export const resumeSectionContent = {
  heading: "Resume",
  subhead: "Experience and impact at a glance.",
  viewDownload: "Open PDF",
  noResume: "Resume will appear here once uploaded.",
  iframeTitle: "Resume PDF preview",
} as const;

export const toolsSectionContent = {
  heading: "Tools & technologies",
  subhead: "Stack I use across backend, frontend, and shipping.",
  empty: "No tools listed yet.",
} as const;

export const contactSectionContent = {
  heading: "Get in touch",
  subhead:
    "Hiring, collaboration, or a product idea—send a note. I typically reply within a few business days.",
  formTitle: "Send a message",
  followLabel: "Connect",
} as const;

export const footerContent = {
  tagline: "Fullstack engineer · APIs, data, and UI",
  rights: "All rights reserved.",
} as const;
