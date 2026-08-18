import dbConnect from "../db";
import WorkSession from "../models/WorkSession";
import WorkEntry from "../models/WorkEntry";
import type { WorkSessionStatus, WorkSessionSummary } from "./types";

function iso(value: unknown): string | null {
  return value instanceof Date ? value.toISOString() : null;
}

function project(value: unknown): { name: string; slug: string } | null {
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.name === "string" && typeof record.slug === "string") {
      return { name: record.name, slug: record.slug };
    }
  }
  return null;
}

export function toWorkSessionSummary(doc: Record<string, unknown>): WorkSessionSummary {
  return {
    sessionId: String(doc.sessionId),
    status: (doc.status as WorkSessionStatus) ?? "active",
    project: project(doc.project),
    startedAt: iso(doc.startedAt) ?? "",
    lastActivityAt: iso(doc.lastActivityAt) ?? "",
    endedAt: iso(doc.endedAt),
    summary: (doc.summary as string) ?? null,
    entryCount: Number(doc.entryCount ?? 0),
  };
}

/**
 * There is no `start_session` tool — logging work against a session id creates it.
 * Re-activates an ended session, because logging into it means it is not over.
 */
export async function touchSession(sessionId: string, projectId?: unknown) {
  await dbConnect();
  const set: Record<string, unknown> = { lastActivityAt: new Date(), status: "active" };
  if (projectId) set.project = projectId;

  return WorkSession.findOneAndUpdate(
    { sessionId },
    { $set: set, $setOnInsert: { startedAt: new Date() } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

/** Recount rather than increment, so the total cannot drift on upserts and retries. */
export async function syncSessionEntryCount(sessionId: unknown) {
  await dbConnect();
  const entryCount = await WorkEntry.countDocuments({ session: sessionId });
  await WorkSession.findByIdAndUpdate(sessionId, { $set: { entryCount } });
}

export async function endSession(sessionId: string, summary?: string) {
  await dbConnect();
  const set: Record<string, unknown> = { status: "ended", endedAt: new Date() };
  if (summary) set.summary = summary;

  const doc = await WorkSession.findOneAndUpdate({ sessionId }, { $set: set }, { new: true })
    .populate("project", "name slug")
    .lean();
  return doc ? toWorkSessionSummary(doc as Record<string, unknown>) : null;
}

export async function getSessionStatus(sessionId?: string): Promise<WorkSessionSummary[]> {
  await dbConnect();
  const query = sessionId ? { sessionId } : {};
  const rows = await WorkSession.find(query)
    .sort({ lastActivityAt: -1 })
    .limit(sessionId ? 1 : 10)
    .populate("project", "name slug")
    .lean();
  return rows.map((r: unknown) => toWorkSessionSummary(r as Record<string, unknown>));
}
