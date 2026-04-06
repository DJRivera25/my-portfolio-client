/** Site-wide constants (SEO, contact, brand). */

export const siteConfig = {
  name: "Derem Joshua Rivera",
  shortName: "DJR",
  title: "Derem Joshua Rivera | Fullstack Engineer",
  description:
    "Fullstack engineer building reliable web products—APIs, data layers, and polished UIs. Portfolio, projects, and resume.",
  ogUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://my-portfolio-client-one.vercel.app",
  contact: {
    email: "djrrivera25@gmail.com",
    phone: "+63 933 851 8806",
    phoneHref: "tel:+639338518806",
  },
} as const;
