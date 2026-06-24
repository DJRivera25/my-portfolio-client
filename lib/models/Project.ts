import mongoose, { Schema, models, model } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: String, required: true },
    featured: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    year: { type: Number },
    role: { type: String },
    mobileImage: { type: String },
    // Case-study fields ("The Build Log" presentation)
    tagline: { type: String },
    kind: { type: String },
    problem: { type: String },
    solution: { type: String },
    highlights: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Project = models.Project || model("Project", ProjectSchema);

export default Project;
