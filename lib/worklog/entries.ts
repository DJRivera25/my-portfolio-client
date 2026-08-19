import dbConnect from "../db";
import WorkEntry from "../models/WorkEntry";
import WorkProject from "../models/WorkProject";
import { nextSeq } from "../models/Counter";
import { resolveWorkProject } from "./projects";
import { syncSessionEntryCount, touchSession } from "./sessions";
import { resolveCompletedAt } from "./status";
import { projectMatchKey } from "./slug";
import { aggregateReport } from "./report";
import type {
  ReportDigest,
  WorkEntryLike,
  WorkEntryStatus,
} from "./types";

const ENTRY_LIMIT_MAX = 500;
const PROJECT_FIELDS = "name slug";

export type LogWorkInput = {
  project: string;
  title: string;
  summary?: string;
  status?: WorkEntryStatus;
  tags?: string[];
  minutesSpent?: number;
  branch?: string;
  prUrl?: string;
  blockedReason?: string;
  sessionId?: string;
  source?: string;
};

export type ListWorkFilter = {
  project?: string;
  status?: WorkEntryStatus;
  since?: Date;
  limit?: number;
};

function fieldsFrom(input: LogWorkInput, status: WorkEntryStatus): Record<string, unknown> {
  const set: Record<string, unknown> = {
    title: input.title,
    status,
    source: input.source ?? "claude",
  };
  if (input.summary !== undefined) set.summary = input.summary;
  if (input.tags !== undefined) set.tags = input.tags;
  if (input.minutesSpent !== undefined) set.minutesSpent = input.minutesSpent;
  if (input.branch !== undefined) set.branch = input.branch;
  if (input.prUrl !== undefined) set.prUrl = input.prUrl;
  if (input.blockedReason !== undefined) set.blockedReason = input.blockedReason;
  return set;
}

/**
 * Records work. Re-logging the same title inside one session updates that entry rather
 * than adding a near-duplicate — Claude retries and re-runs, and without this the log
 * fills with noise. Enforced for real by the partial unique index on (session, title);
 * the read-then-write below is the cooperative path, the catch is the racing one.
 */
export async function logWork(input: LogWorkInput) {
  await dbConnect();

  const project = await resolveWorkProject(input.project);
  const session = input.sessionId ? await touchSession(input.sessionId, project._id) : null;

  const status = input.status ?? "done";
  const set = fieldsFrom(input, status);
  set.project = project._id;
  if (session) set.session = session._id;

  const existing = session
    ? await WorkEntry.findOne({ session: session._id, title: input.title })
    : null;

  const completedAt = resolveCompletedAt(existing?.status, status, new Date());
  if (completedAt !== undefined) set.completedAt = completedAt;

  let saved;
  if (existing) {
    saved = await WorkEntry.findByIdAndUpdate(existing._id, { $set: set }, { new: true });
  } else {
    try {
      saved = await WorkEntry.create({ ...set, ref: await nextSeq("workEntry") });
    } catch (err) {
      // Lost a race against a concurrent log of the same session+title.
      if ((err as { code?: number }).code !== 11000) throw err;
      saved = await WorkEntry.findOneAndUpdate(
        { session: session?._id, title: input.title },
        { $set: set },
        { new: true }
      );
    }
  }

  if (session) await syncSessionEntryCount(session._id);

  return WorkEntry.findById(saved?._id).populate("project", PROJECT_FIELDS).lean();
}

export async function listWorkEntries(filter: ListWorkFilter = {}) {
  await dbConnect();

  const query: Record<string, unknown> = {};
  if (filter.project) {
    const project = await WorkProject.findOne({
      matchKey: projectMatchKey(filter.project),
    }).select("_id");
    if (!project) return [];
    query.project = project._id;
  }
  if (filter.status) query.status = filter.status;
  if (filter.since) query.createdAt = { $gte: filter.since };

  return WorkEntry.find(query)
    .sort({ createdAt: -1 })
    .limit(Math.min(filter.limit ?? 25, ENTRY_LIMIT_MAX))
    .populate("project", PROJECT_FIELDS)
    .lean();
}

export async function updateWorkEntryStatus(
  ref: number,
  status: WorkEntryStatus,
  blockedReason?: string
) {
  await dbConnect();

  const existing = await WorkEntry.findOne({ ref });
  if (!existing) return null;

  const set: Record<string, unknown> = { status };
  const completedAt = resolveCompletedAt(existing.status, status, new Date());
  if (completedAt !== undefined) set.completedAt = completedAt;
  set.blockedReason = status === "blocked" ? blockedReason ?? existing.blockedReason ?? null : null;

  return WorkEntry.findOneAndUpdate({ ref }, { $set: set }, { new: true })
    .populate("project", PROJECT_FIELDS)
    .lean();
}

export async function buildReport(
  opts: { project?: string; since?: Date } = {}
): Promise<ReportDigest> {
  const entries = await listWorkEntries({
    project: opts.project,
    since: opts.since,
    limit: ENTRY_LIMIT_MAX,
  });
  return aggregateReport(entries as unknown as WorkEntryLike[], { since: opts.since });
}
