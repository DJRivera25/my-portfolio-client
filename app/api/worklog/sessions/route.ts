import { NextResponse } from "next/server";
import { isAuthorizedAdmin, unauthorizedResponse } from "@/lib/auth";
import { getSessionStatus } from "@/lib/worklog/sessions";

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!isAuthorizedAdmin(req)) return unauthorizedResponse();

  const sessionId = new URL(req.url).searchParams.get("sessionId") ?? undefined;
  return NextResponse.json(await getSessionStatus(sessionId));
}
