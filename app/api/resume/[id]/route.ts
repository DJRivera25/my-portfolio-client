import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Resume from "@/lib/models/Resume";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await dbConnect();
  try {
    const resume = await Resume.findById(params.id);
    if (!resume) {
      return NextResponse.json({ message: "Resume not found" }, { status: 404 });
    }
    return NextResponse.json(resume);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await dbConnect();
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.startsWith("multipart/form-data")) {
      return NextResponse.json({ message: "Invalid content type" }, { status: 400 });
    }
    const formData = await req.formData();
    const file = formData.get("resume");
    const resume = await Resume.findById(params.id);
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
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await dbConnect();
  try {
    const deleted = await Resume.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ message: "Resume not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Resume deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
