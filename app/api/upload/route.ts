import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.startsWith("multipart/form-data")) {
    return NextResponse.json({ message: "Invalid content type" }, { status: 400 });
  }
  const formData = await req.formData();
  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ message: "File is required" }, { status: 400 });
  }
  // Now file is a File
  const resourceType = file.type.startsWith("image/") ? "image" : "raw";
  const allowedFormats = file.type.startsWith("image/") ? ["jpg", "jpeg", "png", "webp"] : undefined;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const upload = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "portfolio",
          resource_type: resourceType,
          allowed_formats: allowedFormats,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(buffer);
  });
  return NextResponse.json({ url: upload.secure_url }, { status: 201 });
}
