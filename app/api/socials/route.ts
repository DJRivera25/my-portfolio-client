import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Social from "@/lib/models/Social";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function GET() {
  await dbConnect();
  const socials = await Social.find();
  return NextResponse.json(socials);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.startsWith("multipart/form-data")) {
    return NextResponse.json({ message: "Invalid content type" }, { status: 400 });
  }
  const formData = await req.formData();
  const platform = formData.get("platform");
  const url = formData.get("url");
  const file = formData.get("icon");
  if (!platform || !url || !file || typeof file === "string") {
    return NextResponse.json({ message: "All fields including icon are required" }, { status: 400 });
  }
  // Now file is a File
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const upload = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "socials",
          resource_type: "image",
          allowed_formats: ["jpg", "jpeg", "png", "webp"],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(buffer);
  });
  const social = await Social.create({ platform: String(platform), url: String(url), icon: upload.secure_url });
  return NextResponse.json(social, { status: 201 });
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.startsWith("multipart/form-data")) {
    return NextResponse.json({ message: "Invalid content type" }, { status: 400 });
  }
  const formData = await req.formData();
  const id = formData.get("id");
  const platform = formData.get("platform");
  const url = formData.get("url");
  const file = formData.get("icon");
  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }
  const social = await Social.findById(id);
  if (!social) {
    return NextResponse.json({ message: "Social not found" }, { status: 404 });
  }
  if (platform) social.platform = String(platform);
  if (url) social.url = String(url);
  if (file && typeof file !== "string") {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const upload = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "socials",
            resource_type: "image",
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });
    social.icon = upload.secure_url;
  }
  const updated = await social.save();
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const { id } = await req.json();
  const deleted = await Social.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ message: "Social not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Social deleted successfully" });
}
