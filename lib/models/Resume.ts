import mongoose, { Schema, models, model } from "mongoose";

const ResumeSchema = new Schema(
  {
    url: { type: String, required: true },
    fileUrl: { type: String },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Resume = models.Resume || model("Resume", ResumeSchema);

export default Resume;
