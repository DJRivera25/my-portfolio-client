import { NextResponse } from "next/server";
import { listPublicEntries } from "@/lib/worklog/entries";

export const runtime = "nodejs";

/**
 * The only unauthenticated worklog route. It has no filter parameters by design:
 * everything it can return is already constrained to visibility "public" and to the
 * allowlisted fields in toPublicEntry, so there is no query a caller could craft to
 * widen it.
 */
export async function GET(req: Request) {
  const limit = Number(new URL(req.url).searchParams.get("limit"));
  const entries = await listPublicEntries(Number.isFinite(limit) && limit > 0 ? limit : 12);
  return NextResponse.json(entries);
}
