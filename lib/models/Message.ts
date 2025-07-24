import mongoose, { Schema, models, model } from "mongoose";

const MessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
    hasViewed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = models.Message || model("Message", MessageSchema);

export default Message;
