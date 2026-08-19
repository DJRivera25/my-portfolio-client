import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { isAuthorizedAdmin, unauthorizedResponse } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * Was unauthenticated with no size limit: anyone could push arbitrary files into the
 * Cloudinary account, at your cost, and non-image types were uploaded as `raw` with no
 * format restriction at all.
 */

// Vercel caps a serverless request body at 4.5MB, so anything larger fails at the
// platform anyway. Rejecting earlier gives a real message instead of an opaque 413.
const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) return unauthorizedResponse();

  const contentType = req.headers.get("content-type") || "";
  if (!contentType.startsWith("multipart/form-data")) {
    return NextResponse.json({ message: "Invalid content type" }, { status: 400 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ message: "File is required" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { message: `File too large. Maximum ${MAX_BYTES / 1024 / 1024}MB.` },
      { status: 413 }
    );
  }

  const isImage = file.type.startsWith("image/");
  if (!isImage && !file.type.startsWith("application/pdf")) {
    return NextResponse.json(
      { message: "Only images and PDFs are accepted" },
      { status: 415 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const upload = await new Promise<{ secure_url: string } | undefined>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "portfolio",
          resource_type: isImage ? "image" : "raw",
          allowed_formats: isImage ? ["jpg", "jpeg", "png", "webp"] : ["pdf"],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(buffer);
  });

  if (!upload) {
    return NextResponse.json({ message: "Upload failed" }, { status: 502 });
  }

  return NextResponse.json({ url: upload.secure_url }, { status: 201 });
}
