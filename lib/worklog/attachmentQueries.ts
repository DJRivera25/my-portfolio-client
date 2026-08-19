import dbConnect from "../db";
import WorkAttachment from "../models/WorkAttachment";
import WorkEntry from "../models/WorkEntry";
import { nextSeq } from "../models/Counter";
import { resolveWorkProject } from "./projects";
import { detectAttachmentKind, deriveAttachmentLabel, isProbablyUrl } from "./attachments";
import { groupKey } from "./slug";
import type { WorkAttachmentKind, WorkAttachmentSummary } from "./types";

const PROJECT_FIELDS = "name slug";

export type AttachLinkInput = {
  project: string;
  url: string;
  label?: string;
  kind?: WorkAttachmentKind;
  entryRef?: number;
  group?: string;
};

function summarise(doc: Record<string, unknown>): WorkAttachmentSummary {
  const project = doc.project as { name?: string; slug?: string } | null;
  const entry = doc.entry as { ref?: number } | null;
  const created = doc.createdAt;
  return {
    ref: Number(doc.ref),
    kind: (doc.kind as WorkAttachmentKind) ?? "link",
    label: String(doc.label ?? ""),
    url: String(doc.url ?? ""),
    entryRef: entry && typeof entry.ref === "number" ? entry.ref : null,
    group: (doc.group as string) ?? null,
    project:
      project && typeof project.name === "string" && typeof project.slug === "string"
        ? { name: project.name, slug: project.slug }
        : null,
    createdAt: created instanceof Date ? created.toISOString() : String(created ?? ""),
  };
}

export async function attachLink(input: AttachLinkInput): Promise<WorkAttachmentSummary> {
  if (!isProbablyUrl(input.url)) {
    throw new Error("A http(s) URL is required");
  }
  await dbConnect();

  const project = await resolveWorkProject(input.project);
  const kind = input.kind ?? detectAttachmentKind(input.url);
  const label = input.label?.trim() || deriveAttachmentLabel(input.url, kind);

  const entry = input.entryRef
    ? await WorkEntry.findOne({ ref: input.entryRef }).select("_id group groupKey")
    : null;
  if (input.entryRef && !entry) {
    throw new Error(`No entry #${input.entryRef}`);
  }

  const set: Record<string, unknown> = { project: project._id, kind, label, url: input.url };
  if (entry) set.entry = entry._id;

  // An explicit group wins; otherwise inherit the entry's, so a file lands in the same
  // bucket as the work that produced it without the caller having to repeat itself.
  if (input.group) {
    set.group = input.group;
    set.groupKey = groupKey(input.group);
  } else if (entry?.group) {
    set.group = entry.group;
    set.groupKey = entry.groupKey;
  }

  // Re-attaching the same URL to the same entry updates rather than duplicating,
  // matching how log_work behaves when a step is re-run.
  const existing = entry
    ? await WorkAttachment.findOne({ entry: entry._id, url: input.url })
    : null;

  const saved = existing
    ? await WorkAttachment.findByIdAndUpdate(existing._id, { $set: set }, { new: true })
    : await WorkAttachment.create({ ...set, ref: await nextSeq("workAttachment") });

  const populated = await WorkAttachment.findById(saved?._id)
    .populate("project", PROJECT_FIELDS)
    .populate("entry", "ref")
    .lean();

  return summarise(populated as Record<string, unknown>);
}

export async function listAttachments(
  filter: { project?: string; entryRef?: number; group?: string; limit?: number } = {}
): Promise<WorkAttachmentSummary[]> {
  await dbConnect();

  const query: Record<string, unknown> = {};

  if (filter.group) query.groupKey = groupKey(filter.group);

  if (filter.entryRef !== undefined) {
    const entry = await WorkEntry.findOne({ ref: filter.entryRef }).select("_id");
    if (!entry) return [];
    query.entry = entry._id;
  }

  if (filter.project) {
    const { projectMatchKey } = await import("./slug");
    const WorkProject = (await import("../models/WorkProject")).default;
    const project = await WorkProject.findOne({
      matchKey: projectMatchKey(filter.project),
    }).select("_id");
    if (!project) return [];
    query.project = project._id;
  }

  const rows = await WorkAttachment.find(query)
    .sort({ createdAt: -1 })
    .limit(Math.min(filter.limit ?? 50, 200))
    .populate("project", PROJECT_FIELDS)
    .populate("entry", "ref")
    .lean();

  return rows.map((r: unknown) => summarise(r as Record<string, unknown>));
}
