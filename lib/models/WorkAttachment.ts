import { Schema, models, model } from "mongoose";
import { WORK_ATTACHMENT_KINDS } from "../worklog/types";

/**
 * A link hung off an entry or a project — a published Claude artifact, a PR, a deploy
 * preview, a spec. Stored separately from WorkEntry rather than as more url fields
 * because an entry routinely has several, and because media attachments will land here
 * later without reshaping the entry.
 */
const WorkAttachmentSchema = new Schema(
  {
    ref: { type: Number, required: true, unique: true },
    project: { type: Schema.Types.ObjectId, ref: "WorkProject", required: true },
    entry: { type: Schema.Types.ObjectId, ref: "WorkEntry" },
    kind: { type: String, enum: WORK_ATTACHMENT_KINDS, default: "link" },
    label: { type: String, required: true, trim: true },
    group: { type: String, trim: true },
    groupKey: { type: String, trim: true, lowercase: true },
    url: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

WorkAttachmentSchema.index({ project: 1, createdAt: -1 });
WorkAttachmentSchema.index({ entry: 1, createdAt: -1 });
WorkAttachmentSchema.index({ project: 1, groupKey: 1, createdAt: -1 });

// The same URL should not pile up on one entry when a step is re-run. Scoped to the
// entry rather than globally, because the same artifact can legitimately be attached
// to two different entries.
WorkAttachmentSchema.index(
  { entry: 1, url: 1 },
  { unique: true, partialFilterExpression: { entry: { $type: "objectId" } } }
);

const WorkAttachment = models.WorkAttachment || model("WorkAttachment", WorkAttachmentSchema);

export default WorkAttachment;
