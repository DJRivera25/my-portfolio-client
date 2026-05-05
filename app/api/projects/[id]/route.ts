import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Project from "@/lib/models/Project";
import { uploadImageToPortfolio } from "@/lib/cloudinary";
import { isAuthorizedAdmin, unauthorizedResponse } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await dbConnect();
  try {
    const project = await Project.findById(params.id);
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  if (!isAuthorizedAdmin(req)) return unauthorizedResponse();
  const params = await props.params;
  await dbConnect();
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.startsWith("multipart/form-data")) {
      return NextResponse.json({ message: "Invalid content type" }, { status: 400 });
    }
    const formData = await req.formData();
    const project = await Project.findById(params.id);
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    const title = formData.get("title");
    const description = formData.get("description");
    const link = formData.get("link");
    const file = formData.get("image");
    const mobileFile = formData.get("mobileImage");
    const tagsRaw = formData.get("tags");
    const yearRaw = formData.get("year");
    const role = formData.get("role");

    if (title) project.title = String(title);
    if (description) project.description = String(description);
    if (link) project.link = String(link);
    if (role !== null) project.role = role ? String(role) : undefined;
    if (yearRaw !== null) {
      const year = Number(yearRaw);
      project.year = Number.isFinite(year) && yearRaw !== "" ? year : undefined;
    }
    if (tagsRaw !== null) {
      project.tags = parseTags(tagsRaw);
    }
    if (file && file instanceof Blob && file.size > 0) {
      const upload = await uploadImageToPortfolio(Buffer.from(await file.arrayBuffer()));
      project.image = upload.secure_url;
    }
    if (mobileFile && mobileFile instanceof Blob && mobileFile.size > 0) {
      const mobileUpload = await uploadImageToPortfolio(Buffer.from(await mobileFile.arrayBuffer()));
      project.mobileImage = mobileUpload.secure_url;
    }

    const updated = await project.save();
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

function parseTags(raw: FormDataEntryValue): string[] {
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

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  if (!isAuthorizedAdmin(req)) return unauthorizedResponse();
  const params = await props.params;
  await dbConnect();
  try {
    const project = await Project.findByIdAndDelete(params.id);
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Project deleted" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  if (!isAuthorizedAdmin(req)) return unauthorizedResponse();
  const params = await props.params;
  await dbConnect();
  try {
    await Project.updateMany({}, { $set: { featured: false } });
    const updated = await Project.findByIdAndUpdate(params.id, { featured: true }, { new: true });
    if (!updated) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
