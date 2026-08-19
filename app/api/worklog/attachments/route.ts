import { NextResponse } from "next/server";
import { isAuthorizedAdmin, unauthorizedResponse } from "@/lib/auth";
import { attachLink, listAttachments } from "@/lib/worklog/attachmentQueries";

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!isAuthorizedAdmin(req)) return unauthorizedResponse();

  const params = new URL(req.url).searchParams;
  const entryRef = Number(params.get("entryRef"));

  return NextResponse.json(
    await listAttachments({
      project: params.get("project") ?? undefined,
      entryRef: Number.isInteger(entryRef) ? entryRef : undefined,
    })
  );
}

export async function POST(req: Request) {
  if (!isAuthorizedAdmin(req)) return unauthorizedResponse();

  const body = await req.json();
  if (!body?.project || !body?.url) {
    return NextResponse.json({ message: "project and url are required" }, { status: 400 });
  }

  try {
    const attachment = await attachLink(body);
    return NextResponse.json(attachment, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: (err as Error).message }, { status: 400 });
  }
}
