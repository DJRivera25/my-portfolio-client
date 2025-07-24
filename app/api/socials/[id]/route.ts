import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Social from "@/lib/models/Social";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await dbConnect();
  try {
    const social = await Social.findById(params.id);
    if (!social) {
      return NextResponse.json({ message: "Social not found" }, { status: 404 });
    }
    return NextResponse.json(social);
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
    const platform = formData.get("platform");
    const url = formData.get("url");
    const file = formData.get("icon");
    const social = await Social.findById(params.id);
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
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await dbConnect();
  try {
    const deleted = await Social.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ message: "Social not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Social deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
