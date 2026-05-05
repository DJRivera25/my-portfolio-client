import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Project from "@/lib/models/Project";
import { uploadImageToPortfolio } from "@/lib/cloudinary";
import { isAuthorizedAdmin, unauthorizedResponse } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  await dbConnect();
  const projects = await Project.find();
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  if (!isAuthorizedAdmin(req)) return unauthorizedResponse();
  await dbConnect();
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.startsWith("multipart/form-data")) {
    return NextResponse.json({ message: "Invalid content type" }, { status: 400 });
  }
  const formData = await req.formData();
  const file = formData.get("image");
  const mobileFile = formData.get("mobileImage");
  const title = formData.get("title");
  const description = formData.get("description");
  const link = formData.get("link");
  if (!file || !title || !description || !link) {
    return NextResponse.json({ message: "Title, description, link, and image are required" }, { status: 400 });
  }

  const upload = await uploadImageToPortfolio(Buffer.from(await (file as Blob).arrayBuffer()));

  let mobileUrl: string | undefined;
  if (mobileFile && mobileFile instanceof Blob && mobileFile.size > 0) {
    const mobileUpload = await uploadImageToPortfolio(Buffer.from(await mobileFile.arrayBuffer()));
    mobileUrl = mobileUpload.secure_url;
  }

  const tagsRaw = formData.get("tags");
  const tags = parseTags(tagsRaw);
  const yearRaw = formData.get("year");
  const year = yearRaw ? Number(yearRaw) : undefined;
  const role = formData.get("role");

  const project = await Project.create({
    title: String(title),
    description: String(description),
    link: String(link),
    image: upload.secure_url,
    mobileImage: mobileUrl,
    tags,
    year: Number.isFinite(year) ? year : undefined,
    role: role ? String(role) : undefined,
  });
  return NextResponse.json(project, { status: 201 });
}

function parseTags(raw: FormDataEntryValue | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(String(raw));
    if (Array.isArray(parsed)) {
      return parsed.map((t) => String(t).trim()).filter(Boolean).slice(0, 12);
    }
  } catch {
    /* fall through */
  }
  return String(raw)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 12);
}

export async function PUT(request: Request) {
  if (!isAuthorizedAdmin(request)) return unauthorizedResponse();
  await dbConnect();
  const { id, ...update } = await request.json();
  const updated = await Project.findByIdAndUpdate(id, update, { new: true });
  if (!updated) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  if (!isAuthorizedAdmin(request)) return unauthorizedResponse();
  await dbConnect();
  const { id } = await request.json();
  const deleted = await Project.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Project deleted successfully" });
}
