import { listWorkEntries } from "./entries";
import { listWorkProjects } from "./projects";
import { getSessionStatus } from "./sessions";
import { listAttachments } from "./attachmentQueries";
import { listWorkGroups } from "./groups";

/**
 * Everything the dashboard needs for its first paint, in one round trip.
 *
 * The dashboard previously issued four requests and re-issued all four whenever a
 * filter changed — including projects and sessions, which no filter affects. Against
 * serverless functions that read as lag: the card highlights instantly (local state)
 * while its content waits on the network.
 *
 * Now the client fetches this once for its first paint. Entries come back as the first
 * page plus `entryTotal`; each filter change and Load more asks `/api/worklog/entries`,
 * and the report comes from `/api/worklog/report`, so nothing older than the first page
 * is silently missing.
 */
export async function getDashboard(entryLimit = 300) {
  const [projects, entryPage, sessions, attachments, groups] = await Promise.all([
    listWorkProjects(),
    listWorkEntries({ limit: entryLimit }),
    getSessionStatus(),
    listAttachments({ limit: 200 }),
    listWorkGroups(),
  ]);

  return { projects, entries: entryPage.entries, entryTotal: entryPage.total, sessions, attachments, groups };
}
