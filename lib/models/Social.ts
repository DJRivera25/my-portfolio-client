import mongoose, { Schema, models, model } from "mongoose";

const SocialSchema = new Schema(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String },
  },
  { timestamps: true }
);

const Social = models.Social || model("Social", SocialSchema);

export default Social;
