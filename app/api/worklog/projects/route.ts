import { NextResponse } from "next/server";
import { isAuthorizedAdmin, unauthorizedResponse } from "@/lib/auth";
import { listWorkProjects, setWorkProjectStatus } from "@/lib/worklog/projects";
import { WORK_PROJECT_STATUSES, type WorkProjectStatus } from "@/lib/worklog/types";

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!isAuthorizedAdmin(req)) return unauthorizedResponse();
  return NextResponse.json(await listWorkProjects());
}

export async function PATCH(req: Request) {
  if (!isAuthorizedAdmin(req)) return unauthorizedResponse();

  const body = await req.json();
  if (!body?.slug) {
    return NextResponse.json({ message: "slug is required" }, { status: 400 });
  }

  const status = WORK_PROJECT_STATUSES.includes(body.status as WorkProjectStatus)
    ? (body.status as WorkProjectStatus)
    : undefined;

  const project = await setWorkProjectStatus(body.slug, {
    status,
    name: body.name,
    description: body.description,
    repo: body.repo,
  });
  return NextResponse.json(project);
}
