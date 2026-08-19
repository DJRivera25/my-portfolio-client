import { NextResponse } from "next/server";
import { isAuthorizedAdmin, unauthorizedResponse } from "@/lib/auth";
import { getDashboard } from "@/lib/worklog/dashboard";

export const runtime = "nodejs";

/**
 * One request for the whole dashboard. The client filters and aggregates in memory
 * from this payload, so changing a project or status filter costs no network at all.
 */
export async function GET(req: Request) {
  if (!isAuthorizedAdmin(req)) return unauthorizedResponse();
  return NextResponse.json(await getDashboard());
}
