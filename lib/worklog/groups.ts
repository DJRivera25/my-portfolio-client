import dbConnect from "../db";
import WorkEntry from "../models/WorkEntry";
import WorkProject from "../models/WorkProject";
import { OPEN_STATUSES, type WorkGroupSummary } from "./types";
import { projectMatchKey } from "./slug";

/**
 * Groups are labels on entries, not their own collection. There is nothing to store
 * about a group beyond its name and what belongs to it, so a registry would only add
 * an upsert to keep in sync with the entries that already carry the label.
 */
export async function listWorkGroups(project?: string): Promise<WorkGroupSummary[]> {
  await dbConnect();

  const match: Record<string, unknown> = { groupKey: { $nin: [null, ""] } };

  if (project) {
    const doc = await WorkProject.findOne({ matchKey: projectMatchKey(project) }).select("_id");
    if (!doc) return [];
    match.project = doc._id;
  }

  const rows = await WorkEntry.aggregate([
    { $match: match },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: { project: "$project", groupKey: "$groupKey" },
        // The most recent spelling wins for display, matching how projects behave.
        group: { $first: "$group" },
        total: { $sum: 1 },
        open: { $sum: { $cond: [{ $in: ["$status", [...OPEN_STATUSES]] }, 1, 0] } },
        blocked: { $sum: { $cond: [{ $eq: ["$status", "blocked"] }, 1, 0] } },
        minutesSpent: { $sum: { $ifNull: ["$minutesSpent", 0] } },
        lastActivityAt: { $max: "$createdAt" },
      },
    },
    {
      $lookup: {
        from: "workprojects",
        localField: "_id.project",
        foreignField: "_id",
        as: "projectDoc",
      },
    },
    { $sort: { lastActivityAt: -1 } },
  ]);

  return rows.map((row: Record<string, unknown>): WorkGroupSummary => {
    const id = row._id as { groupKey: string };
    const projectDoc = (Array.isArray(row.projectDoc) ? row.projectDoc[0] : null) as
      | { name?: string; slug?: string }
      | null;
    const last = row.lastActivityAt;
    return {
      key: String(id.groupKey),
      name: String(row.group ?? id.groupKey),
      project:
        projectDoc?.name && projectDoc?.slug
          ? { name: projectDoc.name, slug: projectDoc.slug }
          : null,
      total: Number(row.total ?? 0),
      open: Number(row.open ?? 0),
      blocked: Number(row.blocked ?? 0),
      minutesSpent: Number(row.minutesSpent ?? 0),
      lastActivityAt: last instanceof Date ? last.toISOString() : null,
    };
  });
}
