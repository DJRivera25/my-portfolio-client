import dbConnect from "../db";
import WorkEntry from "../models/WorkEntry";
import WorkProject from "../models/WorkProject";
import { nextSeq } from "../models/Counter";
import WorkSession from "../models/WorkSession";
import { findWorkProjectByRepo, resolveWorkProject } from "./projects";
import { syncSessionEntryCount, touchSession } from "./sessions";
import { resolveCompletedAt, resolveWaitingOn } from "./status";
import { groupKey, projectMatchKey } from "./slug";
import { entryQueryFrom, type EntryStatusFilter } from "./filters";
import { reportFromCounts } from "./report";
import type {
  ReportBlocker,
  ReportCountRow,
  ReportDigest,
  WorkEntryLike,
  WorkEntryPage,
  WorkEntryStatus,
} from "./types";

const ENTRY_LIMIT_MAX = 500;
const PROJECT_FIELDS = "name slug";
const BLOCKER_LIMIT = 50;

export type LogWorkInput = {
  project: string;
  title: string;
  summary?: string;
  status?: WorkEntryStatus;
  tags?: string[];
  group?: string;
  minutesSpent?: number;
  branch?: string;
  commitSha?: string;
  commitMessage?: string;
  prUrl?: string;
  blockedReason?: string;
  waitingOn?: string;
  sessionId?: string;
  source?: string;
};

export type ListWorkFilter = {
  project?: string;
  repo?: string;
  group?: string;
  status?: EntryStatusFilter;
  text?: string;
  waitingOn?: string;
  since?: Date;
  until?: Date;
  sessionId?: string;
  offset?: number;
  limit?: number;
};

const ENTRY_LIMIT_DEFAULT = 25;

async function projectIdForKey(key: string): Promise<unknown> {
  const project = await WorkProject.findOne({ matchKey: projectMatchKey(key) }).select("_id");
  return project?._id;
}

function fieldsFrom(input: LogWorkInput, status: WorkEntryStatus): Record<string, unknown> {
  const set: Record<string, unknown> = {
    title: input.title,
    status,
    source: input.source ?? "claude",
  };
  if (input.summary !== undefined) set.summary = input.summary;
  if (input.tags !== undefined) set.tags = input.tags;
  if (input.group !== undefined) {
    set.group = input.group;
    set.groupKey = groupKey(input.group);
  }
  if (input.minutesSpent !== undefined) set.minutesSpent = input.minutesSpent;
  if (input.branch !== undefined) set.branch = input.branch;
  if (input.commitSha !== undefined) set.commitSha = input.commitSha;
  if (input.commitMessage !== undefined) set.commitMessage = input.commitMessage;
  if (input.prUrl !== undefined) set.prUrl = input.prUrl;
  if (input.blockedReason !== undefined) set.blockedReason = input.blockedReason;
  const waitingOn = resolveWaitingOn(status, input.waitingOn);
  if (waitingOn !== undefined) set.waitingOn = waitingOn;
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

export async function listWorkEntries(filter: ListWorkFilter = {}): Promise<WorkEntryPage> {
  await dbConnect();

  const offset = Math.max(0, Math.floor(filter.offset ?? 0));
  const limit = Math.min(
    Math.max(1, Math.floor(filter.limit ?? ENTRY_LIMIT_DEFAULT)),
    ENTRY_LIMIT_MAX
  );
  const empty = (unmatched: WorkEntryPage["unmatched"]): WorkEntryPage => ({
    entries: [],
    total: 0,
    offset,
    project: null,
    unmatched,
  });

  let projectId: unknown;
  let project: WorkEntryPage["project"] = null;
  if (filter.project) {
    const found = await WorkProject.findOne({
      matchKey: projectMatchKey(filter.project),
    }).select("_id name slug");
    if (!found) return empty({ kind: "project", value: filter.project });
    projectId = found._id;
    project = { name: found.name as string, slug: found.slug as string };
  } else if (filter.repo) {
    const found = await findWorkProjectByRepo(filter.repo);
    if (!found) return empty({ kind: "repo", value: filter.repo });
    projectId = found._id;
    project = { name: found.name, slug: found.slug };
  }

  let sessionRef: unknown;
  if (filter.sessionId) {
    const session = await WorkSession.findOne({ sessionId: filter.sessionId }).select("_id");
    if (!session) return empty({ kind: "session", value: filter.sessionId });
    sessionRef = session._id;
  }

  const query = entryQueryFrom({
    projectId,
    sessionId: sessionRef,
    group: filter.group,
    status: filter.status,
    text: filter.text,
    waitingOn: filter.waitingOn,
    since: filter.since,
    until: filter.until,
  });

  const [entries, total] = await Promise.all([
    WorkEntry.find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate("project", PROJECT_FIELDS)
      .lean(),
    WorkEntry.countDocuments(query),
  ]);

  return { entries: entries as unknown as WorkEntryLike[], total, offset, project, unmatched: null };
}

export async function updateWorkEntryStatus(
  ref: number,
  status: WorkEntryStatus,
  blockedReason?: string,
  waitingOn?: string
) {
  await dbConnect();

  const existing = await WorkEntry.findOne({ ref });
  if (!existing) return null;

  const set: Record<string, unknown> = { status };
  const completedAt = resolveCompletedAt(existing.status, status, new Date());
  if (completedAt !== undefined) set.completedAt = completedAt;
  set.blockedReason = status === "blocked" ? blockedReason ?? existing.blockedReason ?? null : null;
  const resolvedWaitingOn = resolveWaitingOn(status, waitingOn);
  if (resolvedWaitingOn !== undefined) set.waitingOn = resolvedWaitingOn;

  return WorkEntry.findOneAndUpdate({ ref }, { $set: set }, { new: true })
    .populate("project", PROJECT_FIELDS)
    .lean();
}

/**
 * Groups entries that already exist. Without this, grouping would only ever apply to
 * work logged after the feature landed — `log_work` cannot retrofit a label because its
 * de-duplication is scoped to a session, so re-logging an old title from a new session
 * creates a second entry instead of updating the first.
 */
export async function setWorkEntryGroup(refs: number[], group: string | null) {
  await dbConnect();
  if (!refs.length) return [];

  const set = group
    ? { group, groupKey: groupKey(group) }
    : { group: null, groupKey: null };

  await WorkEntry.updateMany({ ref: { $in: refs } }, { $set: set });

  return WorkEntry.find({ ref: { $in: refs } })
    .populate("project", PROJECT_FIELDS)
    .lean();
}

/**
 * Deletion is deliberately NOT exposed over MCP — only through the admin dashboard.
 * Claude should be able to record and correct work, but removing history is a decision
 * for the person who owns it.
 */
export async function deleteWorkEntries(refs: number[]) {
  await dbConnect();
  if (!refs.length) return 0;
  const result = await WorkEntry.deleteMany({ ref: { $in: refs } });
  return result.deletedCount ?? 0;
}

export async function buildReport(
  opts: { project?: string; since?: Date } = {}
): Promise<ReportDigest> {
  await dbConnect();

  let projectId: unknown;
  if (opts.project) {
    projectId = await projectIdForKey(opts.project);
    if (projectId === undefined) return reportFromCounts([], [], { since: opts.since });
  }

  const match = entryQueryFrom({ projectId, since: opts.since });

  const groups = await WorkEntry.aggregate<{
    _id: { project: unknown; status: WorkEntryStatus };
    count: number;
    minutesSpent: number;
  }>([
    { $match: match },
    {
      $group: {
        _id: { project: "$project", status: "$status" },
        count: { $sum: 1 },
        minutesSpent: { $sum: { $ifNull: ["$minutesSpent", 0] } },
      },
    },
  ]);

  const projectIds = [...new Set(groups.map((g) => String(g._id.project)))].filter(
    (id) => id !== "undefined" && id !== "null"
  );
  const projects = projectIds.length
    ? await WorkProject.find({ _id: { $in: projectIds } }).select(PROJECT_FIELDS).lean()
    : [];
  const byId = new Map(
    projects.map((p) => [String(p._id), { name: p.name as string, slug: p.slug as string }])
  );
  const unassigned = { name: "Unassigned", slug: "unassigned" };

  const rows: ReportCountRow[] = groups.map((g) => ({
    project: byId.get(String(g._id.project)) ?? unassigned,
    status: g._id.status,
    count: g.count,
    minutesSpent: g.minutesSpent,
  }));

  const blocked = (await WorkEntry.find({ ...match, status: "blocked" })
    .sort({ createdAt: -1 })
    .limit(BLOCKER_LIMIT)
    .populate("project", PROJECT_FIELDS)
    .lean()) as unknown as WorkEntryLike[];

  const blockers: ReportBlocker[] = blocked.map((e) => ({
    ref: e.ref,
    title: e.title,
    project: (e.project as { name?: string } | null | undefined)?.name ?? unassigned.name,
    reason: e.blockedReason ?? null,
    waitingOn: e.waitingOn ?? null,
  }));

  return reportFromCounts(rows, blockers, { since: opts.since });
}
