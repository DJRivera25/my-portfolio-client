import { Schema, models, model } from "mongoose";

const CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = models.Counter || model("Counter", CounterSchema);

/**
 * Short sequential ids. MCP hands ids to Claude as text and takes them back as
 * arguments — a 24-char ObjectId hex is easy to garble, `#42` is not.
 */
export async function nextSeq(name: string): Promise<number> {
  const doc = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean<{ seq: number }>();
  return doc?.seq ?? 1;
}

export default Counter;
