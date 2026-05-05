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
  },
  { timestamps: true }
);

const Project = models.Project || model("Project", ProjectSchema);

export default Project;
