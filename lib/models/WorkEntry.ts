import { Schema, models, model } from "mongoose";
import { WORK_ENTRY_STATUSES } from "../worklog/types";

const WorkEntrySchema = new Schema(
  {
    ref: { type: Number, required: true, unique: true },
    project: { type: Schema.Types.ObjectId, ref: "WorkProject", required: true },
    title: { type: String, required: true, trim: true },
    summary: { type: String },
    status: { type: String, enum: WORK_ENTRY_STATUSES, default: "done" },
    blockedReason: { type: String },
    tags: { type: [String], default: [] },
    minutesSpent: { type: Number },
    branch: { type: String },
    prUrl: { type: String },
    session: { type: Schema.Types.ObjectId, ref: "WorkSession" },
    source: { type: String, default: "claude" },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

WorkEntrySchema.index({ project: 1, createdAt: -1 });
WorkEntrySchema.index({ status: 1, createdAt: -1 });

// Re-logging the same title within one session updates rather than duplicating.
// `$type: "objectId"` and not `$exists: true`: an explicit `session: null` satisfies
// `$exists`, which would collide every session-less entry sharing a title.
WorkEntrySchema.index(
  { session: 1, title: 1 },
  { unique: true, partialFilterExpression: { session: { $type: "objectId" } } }
);

const WorkEntry = models.WorkEntry || model("WorkEntry", WorkEntrySchema);

export default WorkEntry;
