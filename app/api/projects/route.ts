import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Project from "@/lib/models/Project";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function GET() {
  await dbConnect();
  const projects = await Project.find();
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  await dbConnect();
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.startsWith("multipart/form-data")) {
    return NextResponse.json({ message: "Invalid content type" }, { status: 400 });
  }
  const formData = await req.formData();
  const file = formData.get("image");
  const title = formData.get("title");
  const description = formData.get("description");
  const link = formData.get("link");
  if (!file || !title || !description || !link) {
    return NextResponse.json({ message: "All fields including image are required" }, { status: 400 });
  }
  // @ts-ignore
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const upload = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "portfolio",
          resource_type: "image",
          transformation: [{ width: 800, crop: "limit" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(buffer);
  });
  const project = await Project.create({
    title: String(title),
    description: String(description),
    link: String(link),
    image: upload.secure_url,
  });
  return NextResponse.json(project, { status: 201 });
}

export async function PUT(request: Request) {
  await dbConnect();
  const { id, ...update } = await request.json();
  const updated = await Project.findByIdAndUpdate(id, update, { new: true });
  if (!updated) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  await dbConnect();
  const { id } = await request.json();
  const deleted = await Project.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Project deleted successfully" });
}
