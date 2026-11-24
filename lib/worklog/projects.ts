import dbConnect from "../db";
import WorkProject from "../models/WorkProject";
import { normaliseRepoUrl, repoNameKey, storableRepo } from "./repo";
import { deriveProjectName, projectMatchKey, slugifyProject } from "./slug";
import { OPEN_STATUSES, type WorkProjectStatus, type WorkProjectSummary } from "./types";

export type WorkProjectPatch = {
  name?: string;
  description?: string;
  repo?: string;
  status?: WorkProjectStatus;
};

/**
 * Upserts. A project exists the moment it is first logged against, so `log_work`
 * never fails for want of setup — the whole point of not making Claude register a
 * project before it can record anything.
 */
export async function resolveWorkProject(key: string, patch: WorkProjectPatch = {}) {
  await dbConnect();
  const slug = slugifyProject(key);
  const matchKey = projectMatchKey(key);
  if (!matchKey) throw new Error("A project key is required");

  const set: Record<string, unknown> = {};
  if (patch.name) set.name = patch.name;
  if (patch.description !== undefined) set.description = patch.description;
  if (patch.repo !== undefined) {
    const repo = storableRepo(patch.repo);
    if (repo !== null) set.repo = repo;
  }
  if (patch.status) set.status = patch.status;

  // `name` must appear in exactly one of $set / $setOnInsert — Mongo rejects a field
  // written by both. `slug` is insert-only so the first, most readable spelling wins:
  // logging "toolsaustralia" later must not rewrite a project already called
  // "tools-australia".
  const setOnInsert: Record<string, unknown> = { slug };
  if (!patch.name) setOnInsert.name = deriveProjectName(slug);

  return WorkProject.findOneAndUpdate(
    { matchKey },
    {
      ...(Object.keys(set).length ? { $set: set } : {}),
      $setOnInsert: setOnInsert,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

export async function findWorkProjectByRepo(
  repoUrl: string
): Promise<{ _id: unknown; name: string; slug: string } | null> {
  const normalised = normaliseRepoUrl(repoUrl);
  if (!normalised) return null;
  await dbConnect();

  const withRepo = await WorkProject.find({ repo: { $type: "string", $ne: "" } })
    .select("name slug repo")
    .lean();
  const exact = withRepo.find((p) => normaliseRepoUrl(String(p.repo)) === normalised);
  if (exact) return { _id: exact._id, name: exact.name as string, slug: exact.slug as string };

  const byName = await WorkProject.findOne({ matchKey: repoNameKey(normalised) }).select(
    "name slug repo"
  );
  if (!byName || byName.repo) return null;
  byName.repo = normalised;
  await byName.save();
  return { _id: byName._id, name: byName.name as string, slug: byName.slug as string };
}

export async function setWorkProjectStatus(key: string, patch: WorkProjectPatch) {
  return resolveWorkProject(key, patch);
}

export async function listWorkProjects(): Promise<WorkProjectSummary[]> {
  await dbConnect();

  const rows = await WorkProject.aggregate([
    {
      $lookup: {
        from: "workentries",
        let: { pid: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$project", "$$pid"] } } },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              open: { $sum: { $cond: [{ $in: ["$status", [...OPEN_STATUSES]] }, 1, 0] } },
              blocked: { $sum: { $cond: [{ $eq: ["$status", "blocked"] }, 1, 0] } },
              lastActivityAt: { $max: "$createdAt" },
            },
          },
        ],
        as: "stats",
      },
    },
    { $sort: { updatedAt: -1 } },
  ]);

  return rows.map((row: Record<string, unknown>): WorkProjectSummary => {
    const stats = (Array.isArray(row.stats) ? row.stats[0] : null) ?? {};
    const last = (stats as Record<string, unknown>).lastActivityAt;
    return {
      slug: String(row.slug),
      name: String(row.name),
      description: (row.description as string) ?? null,
      repo: (row.repo as string) ?? null,
      status: (row.status as WorkProjectStatus) ?? "active",
      total: Number((stats as Record<string, unknown>).total ?? 0),
      open: Number((stats as Record<string, unknown>).open ?? 0),
      blocked: Number((stats as Record<string, unknown>).blocked ?? 0),
      lastActivityAt: last instanceof Date ? last.toISOString() : null,
    };
  });
}
