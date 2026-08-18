import { Schema, models, model } from "mongoose";
import { WORK_PROJECT_STATUSES } from "../worklog/types";

const WorkProjectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Separator-free identity — see projectMatchKey. This, not slug, is what lookups use.
    matchKey: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    description: { type: String },
    repo: { type: String },
    status: { type: String, enum: WORK_PROJECT_STATUSES, default: "active" },
    // Optional link to the public portfolio case study, when the work is showcased.
    portfolioProject: { type: Schema.Types.ObjectId, ref: "Project" },
  },
  { timestamps: true }
);

const WorkProject = models.WorkProject || model("WorkProject", WorkProjectSchema);

export default WorkProject;
