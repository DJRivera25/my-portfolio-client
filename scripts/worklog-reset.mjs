/**
 * Drops every worklog collection and its indexes. Use to clear smoke-test data or to
 * rebuild indexes after a schema change — Mongoose does not drop a stale index on its
 * own, so a changed unique constraint needs this.
 *
 *   node --env-file=.env.local scripts/worklog-reset.mjs
 */
import mongoose from "mongoose";

const COLLECTIONS = ["workentries", "workprojects", "worksessions", "counters"];

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set.");
  process.exit(1);
}

await mongoose.connect(uri);
const db = mongoose.connection.db;
const existing = (await db.listCollections().toArray()).map((c) => c.name);

for (const name of COLLECTIONS) {
  if (existing.includes(name)) {
    await db.dropCollection(name);
    console.log(`dropped ${name}`);
  } else {
    console.log(`skipped ${name} (absent)`);
  }
}

await mongoose.disconnect();
console.log("done — indexes rebuild on next write");
