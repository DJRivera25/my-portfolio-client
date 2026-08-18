export type WorkEntryStatus = "todo" | "in_progress" | "blocked" | "done";
export type WorkEntryVisibility = "private" | "public";
export type WorkProjectStatus = "active" | "paused" | "shipped" | "archived";

export interface WorkEntry {
  _id: string;
  ref: number;
  title: string;
  summary?: string | null;
  status: WorkEntryStatus;
  blockedReason?: string | null;
  tags?: string[];
  minutesSpent?: number | null;
  branch?: string | null;
  prUrl?: string | null;
  source?: string;
  visibility: WorkEntryVisibility;
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

/** The public feed shape — deliberately narrower than WorkEntry. */
export interface PublicEntry {
  ref: number;
  title: string;
  summary: string | null;
  tags: string[];
  createdAt: string;
  project: { name: string; slug: string } | null;
}
