/**
 * Static presentation config for the worklog dashboard and the public Build Log.
 * Copy and status tokens live here so components stay free of hardcoded strings.
 */
import type { WorkEntryStatus, WorkProjectStatus } from "../types/worklog";

export const STATUS_META: Record<
  WorkEntryStatus,
  { label: string; color: string; dim: string }
> = {
  todo: { label: "Todo", color: "#A39F96", dim: "rgba(163,159,150,0.14)" },
  in_progress: { label: "In progress", color: "#E0A53D", dim: "rgba(224,165,61,0.14)" },
  blocked: { label: "Blocked", color: "#E07A5F", dim: "rgba(224,122,95,0.14)" },
  done: { label: "Done", color: "#7FB996", dim: "rgba(127,185,150,0.14)" },
};

export const STATUS_ORDER: WorkEntryStatus[] = ["todo", "in_progress", "blocked", "done"];

export const PROJECT_STATUS_LABEL: Record<WorkProjectStatus, string> = {
  active: "Active",
  paused: "Paused",
  shipped: "Shipped",
  archived: "Archived",
};

export const worklogContent = {
  eyebrow: "WORKLOG",
  heading: "The",
  headingAccent: " work log",
  subhead: "Written by Claude Code over MCP. Filter, re-status, and publish entries here.",
  emptyTitle: "Nothing logged yet",
  emptyBody:
    "Connect the MCP server and ask Claude to log some work. Entries will appear here as they land.",
  sessionsTitle: "Recent sessions",
  sessionsEmpty: "No sessions recorded yet.",
  reportTitle: "Report",
  projectsTitle: "Projects",
  filterAll: "All",
} as const;

export const REPORT_WINDOWS = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "All time", value: "" },
] as const;

/** Sign-in page copy. */
export const loginContent = {
  back: "Back to site",
  eyebrow: "ADMIN",
  heading: "Sign ",
  headingAccent: "in",
  subhead: "The worklog, inbox and content tools live behind here.",
  emailLabel: "Email",
  passwordLabel: "Password",
  submit: "Sign in",
  submitting: "Signing in…",
  success: "Signed in.",
  failure: "Could not sign in. Check your email and password.",
} as const;

/** Admin inbox copy. */
export const inboxContent = {
  eyebrow: "INBOX",
  heading: "Messages",
  headingAccent: " received",
  subhead: "Everything sent through the contact form on the site.",
  empty: "No messages yet.",
  emptyBody: "Anything sent through the site's contact form will land here.",
  error: "Could not load messages. Check that you are still signed in.",
  unreadLabel: "New",
} as const;

