import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { uploadImageToPortfolio } from "@/lib/cloudinary";
import { isAuthorizedAdmin, unauthorizedResponse } from "@/lib/auth";
import { captureScreenshot, ScreenshotError, type ScreenshotFailure } from "@/lib/screenshot";

export const runtime = "nodejs";
// A slow site takes ~30s to capture; the platform default would cut it off.
export const maxDuration = 60;

const CaptureSchema = z.object({ link: z.url({ protocol: /^https?$/ }) });

const STATUS_FOR: Record<ScreenshotFailure, number> = {
  rate_limited: 429,
  site_failed: 422,
  provider_failed: 502,
};

export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) return unauthorizedResponse();

  const parsed = CaptureSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "A valid http(s) link is required" }, { status: 400 });
  }

  try {
    const shot = await captureScreenshot(parsed.data.link);
    const upload = await uploadImageToPortfolio(shot);
    return NextResponse.json({ url: upload.secure_url }, { status: 201 });
  } catch (err) {
    if (err instanceof ScreenshotError) {
      return NextResponse.json({ message: err.message }, { status: STATUS_FOR[err.reason] });
    }
    console.error("Project screenshot upload failed:", err);
    return NextResponse.json({ message: "Upload failed" }, { status: 502 });
  }
}
