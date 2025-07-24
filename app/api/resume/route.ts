import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Resume from "@/lib/models/Resume";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  await dbConnect();
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.startsWith("multipart/form-data")) {
    return NextResponse.json({ message: "Invalid content type" }, { status: 400 });
  }
  const formData = await req.formData();
  const file = formData.get("resume");
  if (!file || typeof file === "string") {
    return NextResponse.json({ message: "Resume file is required" }, { status: 400 });
  }
  // Now file is a File
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const upload = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "resumes",
          resource_type: "raw",
          format: "pdf",
          public_id: "Derem-Joshua-Rivera-Resume.pdf",
          allowed_formats: ["pdf"],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(buffer);
  });
  const resume = await Resume.create({ url: upload.secure_url });
  return NextResponse.json(resume, { status: 201 });
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.startsWith("multipart/form-data")) {
    return NextResponse.json({ message: "Invalid content type" }, { status: 400 });
  }
  const formData = await req.formData();
  const id = formData.get("id");
  const file = formData.get("resume");
  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }
  const resume = await Resume.findById(id);
  if (!resume) {
    return NextResponse.json({ message: "Resume not found" }, { status: 404 });
  }
  if (file && typeof file !== "string") {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const upload = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "resumes",
            resource_type: "raw",
            format: "pdf",
            public_id: "Derem-Joshua-Rivera-Resume.pdf",
            allowed_formats: ["pdf"],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });
    resume.url = upload.secure_url;
  }
  const updated = await resume.save();
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const { id } = await req.json();
  const deleted = await Resume.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ message: "Resume not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Resume deleted successfully" });
}
