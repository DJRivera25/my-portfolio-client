export type NavItem = { to: string; label: string };

/** Section ids must match element `id` attributes on the home page (Atelier redesign). */
export const navLinks: NavItem[] = [
  { to: "hero", label: "Home" },
  { to: "work", label: "Work" },
  { to: "about", label: "About" },
  { to: "stack", label: "Stack" },
  { to: "process", label: "Process" },
  { to: "contact", label: "Contact" },
];

export const NAV_SCROLL_OFFSET = -80;
