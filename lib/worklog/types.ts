/**
 * Shared worklog vocabulary. Deliberately free of mongoose and `@/lib/db` so the pure
 * layer (report/format/status/slug) stays unit-testable — `lib/db.ts` throws at module
 * scope when MONGODB_URI is unset, which would take any importing test with it.
 * The models import their enum values from here, so there is one source of truth.
 *
 * The worklog is entirely private: there is no visibility flag and no unauthenticated
 * route. Every read goes through isAuthorizedAdmin or isAuthorizedMcp.
 */

export const WORK_ENTRY_STATUSES = ["todo", "in_progress", "blocked", "done"] as const;
export const WORK_PROJECT_STATUSES = ["active", "paused", "shipped", "archived"] as const;
export const WORK_SESSION_STATUSES = ["active", "ended"] as const;

export type WorkEntryStatus = (typeof WORK_ENTRY_STATUSES)[number];
export type WorkProjectStatus = (typeof WORK_PROJECT_STATUSES)[number];
export type WorkSessionStatus = (typeof WORK_SESSION_STATUSES)[number];

export const OPEN_STATUSES: readonly WorkEntryStatus[] = ["todo", "in_progress", "blocked"];

export type ProjectRef = { name?: string | null; slug?: string | null } | null | undefined;

/** A WorkEntry as it arrives from `.lean()` or a populated query. */
export type WorkEntryLike = {
  ref: number;
  title: string;
  summary?: string | null;
  status: WorkEntryStatus;
  blockedReason?: string | null;
  tags?: string[] | null;
  minutesSpent?: number | null;
  branch?: string | null;
  commitSha?: string | null;
  commitMessage?: string | null;
  prUrl?: string | null;
  source?: string | null;
  completedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
  project?: ProjectRef | unknown;
  session?: unknown;
};

export type ReportProjectLine = {
  slug: string;
  name: string;
  total: number;
  done: number;
  open: number;
  minutesSpent: number;
};

export type ReportBlocker = {
  ref: number;
  title: string;
  project: string;
  reason: string | null;
};

export type ReportDigest = {
  total: number;
  since: string | null;
  minutesSpent: number;
  byStatus: Record<WorkEntryStatus, number>;
  byProject: ReportProjectLine[];
  blockers: ReportBlocker[];
};

export type WorkProjectSummary = {
  slug: string;
  name: string;
  description: string | null;
  repo: string | null;
  status: WorkProjectStatus;
  total: number;
  open: number;
  blocked: number;
  lastActivityAt: string | null;
};

export type WorkSessionSummary = {
  sessionId: string;
  status: WorkSessionStatus;
  project: { name: string; slug: string } | null;
  startedAt: string;
  lastActivityAt: string;
  endedAt: string | null;
  summary: string | null;
  entryCount: number;
};

export const WORK_ATTACHMENT_KINDS = [
  "artifact",
  "commit",
  "pr",
  "repo",
  "deploy",
  "doc",
  "image",
  "video",
  "link",
] as const;

export type WorkAttachmentKind = (typeof WORK_ATTACHMENT_KINDS)[number];

export type WorkAttachmentSummary = {
  ref: number;
  kind: WorkAttachmentKind;
  label: string;
  url: string;
  entryRef: number | null;
  project: { name: string; slug: string } | null;
  createdAt: string;
};
