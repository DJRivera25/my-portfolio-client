import { NextResponse } from "next/server";
import { isAuthorizedAdmin, unauthorizedResponse } from "@/lib/auth";
import {
  deleteWorkEntries,
  listWorkEntries,
  logWork,
  setWorkEntryGroup,
  updateWorkEntryStatus,
} from "@/lib/worklog/entries";
import { parseSince } from "@/lib/worklog/since";
import {
  WORK_ENTRY_STATUSES,
  type WorkEntryStatus,
} from "@/lib/worklog/types";

export const runtime = "nodejs";

function asStatus(value: string | null): WorkEntryStatus | undefined {
  return WORK_ENTRY_STATUSES.includes(value as WorkEntryStatus)
    ? (value as WorkEntryStatus)
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

  if ("group" in (body ?? {})) {
    const updated = await setWorkEntryGroup([ref], body.group || null);
    if (!updated.length) return NextResponse.json({ message: "Entry not found" }, { status: 404 });
    return NextResponse.json(updated[0]);
  }

  const status = asStatus(body?.status ?? null);
  if (!status) {
    return NextResponse.json({ message: "A valid status is required" }, { status: 400 });
  }

  const updated = await updateWorkEntryStatus(ref, status, body?.blockedReason);
  if (!updated) return NextResponse.json({ message: "Entry not found" }, { status: 404 });
  return NextResponse.json(updated);
}

/**
 * Admin-only, and deliberately absent from the MCP surface: Claude can record and
 * correct work, but removing history is the owner's decision.
 */
export async function DELETE(req: Request) {
  if (!isAuthorizedAdmin(req)) return unauthorizedResponse();

  const body = await req.json();
  const refs: number[] = Array.isArray(body?.refs)
    ? body.refs.map(Number).filter(Number.isInteger)
    : [];

  if (!refs.length) {
    return NextResponse.json({ message: "refs must be a non-empty array" }, { status: 400 });
  }

  const deleted = await deleteWorkEntries(refs);
  return NextResponse.json({ deleted });
}
