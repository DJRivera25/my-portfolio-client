import mongoose, { Schema, models, model } from "mongoose";

const ToolSchema = new Schema(
  {
    name: { type: String, required: true },
    icon: { type: String },
    description: { type: String },
    category: { type: String },
  },
  { timestamps: true }
);

const Tool = models.Tool || model("Tool", ToolSchema);

export default Tool;
