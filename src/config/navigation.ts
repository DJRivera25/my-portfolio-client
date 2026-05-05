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
