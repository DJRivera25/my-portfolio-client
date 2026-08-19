export type WorkEntryStatus = "todo" | "in_progress" | "blocked" | "done";
export type WorkProjectStatus = "active" | "paused" | "shipped" | "archived";

export interface WorkEntry {
  _id: string;
  ref: number;
  title: string;
  summary?: string | null;
  status: WorkEntryStatus;
  blockedReason?: string | null;
  tags?: string[];
  group?: string | null;
  minutesSpent?: number | null;
  branch?: string | null;
  commitSha?: string | null;
  commitMessage?: string | null;
  prUrl?: string | null;
  source?: string;
  completedAt?: string | null;
  createdAt: string;
  project?: { _id: string; name: string; slug: string } | null;
}

export interface WorkProjectSummary {
  slug: string;
  name: string;
  description: string | null;
  repo: string | null;
  status: WorkProjectStatus;
  total: number;
  open: number;
  blocked: number;
  lastActivityAt: string | null;
}

export interface WorkSessionSummary {
  sessionId: string;
  status: "active" | "ended";
  project: { name: string; slug: string } | null;
  startedAt: string;
  lastActivityAt: string;
  endedAt: string | null;
  summary: string | null;
  entryCount: number;
}

export interface ReportDigest {
  total: number;
  since: string | null;
  minutesSpent: number;
  byStatus: Record<WorkEntryStatus, number>;
  byProject: Array<{
    slug: string;
    name: string;
    total: number;
    done: number;
    open: number;
    minutesSpent: number;
  }>;
  blockers: Array<{ ref: number; title: string; project: string; reason: string | null }>;
}

export type WorkAttachmentKind =
  | "artifact"
  | "commit"
  | "pr"
  | "repo"
  | "deploy"
  | "doc"
  | "image"
  | "video"
  | "link";

export interface WorkAttachmentSummary {
  ref: number;
  kind: WorkAttachmentKind;
  label: string;
  url: string;
  entryRef: number | null;
  group: string | null;
  project: { name: string; slug: string } | null;
  createdAt: string;
}

/** Everything the dashboard needs, in one response. */
export interface DashboardPayload {
  projects: WorkProjectSummary[];
  entries: WorkEntry[];
  sessions: WorkSessionSummary[];
  attachments: WorkAttachmentSummary[];
  groups: WorkGroupSummary[];
}

export interface WorkGroupSummary {
  key: string;
  name: string;
  project: { name: string; slug: string } | null;
  total: number;
  open: number;
  blocked: number;
  minutesSpent: number;
  lastActivityAt: string | null;
}
