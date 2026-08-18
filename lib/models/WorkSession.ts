import { Schema, models, model } from "mongoose";
import { WORK_SESSION_STATUSES } from "../worklog/types";

const WorkSessionSchema = new Schema(
  {
    // Claude Code's own session id, supplied by the caller — not generated here.
    sessionId: { type: String, required: true, unique: true },
    project: { type: Schema.Types.ObjectId, ref: "WorkProject" },
    status: { type: String, enum: WORK_SESSION_STATUSES, default: "active" },
    startedAt: { type: Date, default: Date.now },
    lastActivityAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    summary: { type: String },
    entryCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

WorkSessionSchema.index({ lastActivityAt: -1 });

const WorkSession = models.WorkSession || model("WorkSession", WorkSessionSchema);

export default WorkSession;
