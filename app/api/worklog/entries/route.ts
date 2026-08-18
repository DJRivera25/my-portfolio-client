import { NextResponse } from "next/server";
import { isAuthorizedAdmin, unauthorizedResponse } from "@/lib/auth";
import {
  listWorkEntries,
  logWork,
  setWorkEntryVisibility,
  updateWorkEntryStatus,
} from "@/lib/worklog/entries";
import { parseSince } from "@/lib/worklog/since";
import {
  WORK_ENTRY_STATUSES,
  WORK_ENTRY_VISIBILITIES,
  type WorkEntryStatus,
  type WorkEntryVisibility,
} from "@/lib/worklog/types";

export const runtime = "nodejs";

function asStatus(value: string | null): WorkEntryStatus | undefined {
  return WORK_ENTRY_STATUSES.includes(value as WorkEntryStatus)
    ? (value as WorkEntryStatus)
    : undefined;
}

function asVisibility(value: unknown): WorkEntryVisibility | undefined {
  return WORK_ENTRY_VISIBILITIES.includes(value as WorkEntryVisibility)
    ? (value as WorkEntryVisibility)
    : undefined;
}

export async function GET(req: Request) {
  if (!isAuthorizedAdmin(req)) return unauthorizedResponse();

  const params = new URL(req.url).searchParams;
  const limit = Number(params.get("limit"));

  const entries = await listWorkEntries({
    project: params.get("project") ?? undefined,
    status: asStatus(params.get("status")),
    since: parseSince(params.get("since")),
    limit: Number.isFinite(limit) && limit > 0 ? limit : undefined,
  });
  return NextResponse.json(entries);
}

export async function POST(req: Request) {
  if (!isAuthorizedAdmin(req)) return unauthorizedResponse();

  const body = await req.json();
  if (!body?.project || !body?.title) {
    return NextResponse.json({ message: "project and title are required" }, { status: 400 });
  }

  const entry = await logWork({ ...body, source: "web" });
  return NextResponse.json(entry, { status: 201 });
}

export async function PATCH(req: Request) {
  if (!isAuthorizedAdmin(req)) return unauthorizedResponse();

  const body = await req.json();
  const ref = Number(body?.ref);
  if (!Number.isInteger(ref)) {
    return NextResponse.json({ message: "ref is required" }, { status: 400 });
  }

  const visibility = asVisibility(body?.visibility);
  if (visibility) {
    const updated = await setWorkEntryVisibility(ref, visibility);
    if (!updated) return NextResponse.json({ message: "Entry not found" }, { status: 404 });
    return NextResponse.json(updated);
  }

  const status = asStatus(body?.status ?? null);
  if (!status) {
    return NextResponse.json({ message: "A valid status or visibility is required" }, { status: 400 });
  }

  const updated = await updateWorkEntryStatus(ref, status, body?.blockedReason);
  if (!updated) return NextResponse.json({ message: "Entry not found" }, { status: 404 });
  return NextResponse.json(updated);
}
