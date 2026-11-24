import api from "./client";
import type {
  DashboardPayload,
  ReportDigest,
  WorkAttachmentSummary,
  WorkEntry,
  WorkEntryPage,
  WorkEntryStatus,
  WorkProjectSummary,
  WorkSessionSummary,
} from "../../types/worklog";

export type EntryFilter = {
  project?: string;
  group?: string;
  status?: WorkEntryStatus | "open";
  text?: string;
  waitingOn?: string;
  since?: string;
  until?: string;
  offset?: number;
  limit?: number;
};

export async function fetchWorkEntries(filter: EntryFilter = {}): Promise<WorkEntryPage> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filter)) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }

  const query = params.toString();
  const res = await api.get<WorkEntryPage>(`/api/worklog/entries${query ? `?${query}` : ""}`);
  return res.data;
}

export async function fetchWorkProjects(): Promise<WorkProjectSummary[]> {
  const res = await api.get<WorkProjectSummary[]>("/api/worklog/projects");
  return res.data;
}

export async function fetchWorkSessions(): Promise<WorkSessionSummary[]> {
  const res = await api.get<WorkSessionSummary[]>("/api/worklog/sessions");
  return res.data;
}

export async function fetchWorkReport(filter: { project?: string; since?: string } = {}) {
  const params = new URLSearchParams();
  if (filter.project) params.set("project", filter.project);
  if (filter.since) params.set("since", filter.since);

  const query = params.toString();
  const res = await api.get<ReportDigest>(`/api/worklog/report${query ? `?${query}` : ""}`);
  return res.data;
}

export async function updateEntryStatus(
  ref: number,
  status: WorkEntryStatus,
  blockedReason?: string
): Promise<WorkEntry> {
  const res = await api.patch<WorkEntry>("/api/worklog/entries", { ref, status, blockedReason });
  return res.data;
}

/**
 * One request for the dashboard's first paint: its unfiltered first page of entries plus
 * `entryTotal`. Filters, further pages and the report are fetched from the server.
 */
export async function fetchDashboard(): Promise<DashboardPayload> {
  const res = await api.get<DashboardPayload>("/api/worklog/dashboard");
  return res.data;
}

export async function attachLinkToWorklog(input: {
  project: string;
  url: string;
  label?: string;
  entryRef?: number;
}): Promise<WorkAttachmentSummary> {
  const res = await api.post<WorkAttachmentSummary>("/api/worklog/attachments", input);
  return res.data;
}
