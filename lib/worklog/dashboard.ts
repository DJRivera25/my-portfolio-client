import { listWorkEntries } from "./entries";
import { listWorkProjects } from "./projects";
import { getSessionStatus } from "./sessions";
import { listAttachments } from "./attachmentQueries";
import { listWorkGroups } from "./groups";

/**
 * Everything the dashboard needs, in one round trip.
 *
 * The dashboard previously issued four requests and re-issued all four whenever a
 * filter changed — including projects and sessions, which no filter affects. Against
 * serverless functions that read as lag: the card highlights instantly (local state)
 * while its content waits on the network.
 *
 * Now the client fetches this once and does its filtering and report aggregation in
 * memory, so changing a filter costs nothing. The per-resource routes remain for the
 * MCP adapter and for anything that wants one slice.
 */
export async function getDashboard(entryLimit = 300) {
  const [projects, entries, sessions, attachments, groups] = await Promise.all([
    listWorkProjects(),
    listWorkEntries({ limit: entryLimit }),
    getSessionStatus(),
    listAttachments({ limit: 200 }),
    listWorkGroups(),
  ]);

  return { projects, entries, sessions, attachments, groups };
}
