import { z } from "zod";
import { groupKey } from "./slug";
import { parseSince, parseUntil } from "./since";
import { OPEN_STATUSES, WORK_ENTRY_STATUSES, type WorkEntryStatus } from "./types";

export type EntryStatusFilter = WorkEntryStatus | "open";

export type EntryQueryInput = {
  projectId?: unknown;
  sessionId?: unknown;
  group?: string;
  status?: EntryStatusFilter;
  text?: string;
  waitingOn?: string;
  since?: Date;
  until?: Date;
};

export type EntryListParams = {
  project?: string;
  group?: string;
  status?: EntryStatusFilter;
  text?: string;
  waitingOn?: string;
  since?: Date;
  until?: Date;
  offset: number;
  limit: number;
};

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function entryQueryFrom(input: EntryQueryInput): Record<string, unknown> {
  const query: Record<string, unknown> = {};

  if (input.projectId !== undefined) query.project = input.projectId;
  if (input.sessionId !== undefined) query.session = input.sessionId;
  if (input.group?.trim()) query.groupKey = groupKey(input.group);

  if (input.status === "open") query.status = { $in: [...OPEN_STATUSES] };
  else if (input.status) query.status = input.status;

  const text = input.text?.trim();
  if (text) {
    const re = { $regex: escapeRegex(text), $options: "i" };
    query.$or = [{ title: re }, { summary: re }];
  }

  const waitingOn = input.waitingOn?.trim();
  if (waitingOn) query.waitingOn = { $regex: escapeRegex(waitingOn), $options: "i" };

  if (input.since || input.until) {
    query.createdAt = {
      ...(input.since ? { $gte: input.since } : {}),
      ...(input.until ? { $lt: input.until } : {}),
    };
  }

  return query;
}

const text = z.string().trim().optional();

const paramsSchema = z.object({
  project: text,
  group: text,
  status: z.enum([...WORK_ENTRY_STATUSES, "open"]).optional(),
  text,
  waitingOn: text,
  since: text,
  until: text,
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(500).default(300),
});

export function parseEntryQuery(
  params: URLSearchParams,
  now: Date = new Date()
): { value: EntryListParams } | { error: string } {
  const raw: Record<string, string> = {};
  for (const [key, val] of params) if (val.trim() !== "") raw[key] = val;

  const parsed = paramsSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") };

  const { since, until, ...rest } = parsed.data;
  const value: EntryListParams = { offset: rest.offset, limit: rest.limit };
  if (rest.project) value.project = rest.project;
  if (rest.group) value.group = rest.group;
  if (rest.status) value.status = rest.status;
  if (rest.text) value.text = rest.text;
  if (rest.waitingOn) value.waitingOn = rest.waitingOn;
  const sinceDate = parseSince(since, now);
  if (sinceDate) value.since = sinceDate;
  const untilDate = parseUntil(until, now);
  if (untilDate) value.until = untilDate;
  return { value };
}
