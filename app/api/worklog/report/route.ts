import { NextResponse } from "next/server";
import { isAuthorizedAdmin, unauthorizedResponse } from "@/lib/auth";
import { buildReport } from "@/lib/worklog/entries";
import { parseSince } from "@/lib/worklog/since";

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!isAuthorizedAdmin(req)) return unauthorizedResponse();

  const params = new URL(req.url).searchParams;
  const digest = await buildReport({
    project: params.get("project") ?? undefined,
    since: parseSince(params.get("since")),
  });
  return NextResponse.json(digest);
}
