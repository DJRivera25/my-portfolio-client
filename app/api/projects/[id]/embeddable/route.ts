import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import dbConnect from "@/lib/db";
import Project from "@/lib/models/Project";
import { isEmbeddable } from "@/lib/embeddable";

export const runtime = "nodejs";

// Public, and each miss fetches the project's site — let the CDN answer repeat visits for a day.
const CACHE_CONTROL = "public, s-maxage=86400, stale-while-revalidate=604800";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }
  try {
    await dbConnect();
    const project = await Project.findById(id).select("link").lean<{ link?: string }>();
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }
    const embeddable = await isEmbeddable(project.link ?? "", req.nextUrl.origin);
    return NextResponse.json({ embeddable }, { headers: { "Cache-Control": CACHE_CONTROL } });
  } catch (err) {
    console.error("Embeddable check failed:", err);
    return NextResponse.json({ message: "Could not check the project" }, { status: 500 });
  }
}
