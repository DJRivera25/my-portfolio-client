import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Tool from "@/lib/models/Tool";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await dbConnect();
  try {
    const tool = await Tool.findById(params.id);
    if (!tool) {
      return NextResponse.json({ message: "Tool not found" }, { status: 404 });
    }
    return NextResponse.json(tool);
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
    const name = formData.get("name");
    const category = formData.get("category");
    const file = formData.get("icon");
    const tool = await Tool.findById(params.id);
    if (!tool) {
      return NextResponse.json({ message: "Tool not found" }, { status: 404 });
    }
    if (name) tool.name = String(name);
    if (category) tool.category = String(category);
    if (file && typeof file !== "string") {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const upload = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "tools",
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
      tool.icon = upload.secure_url;
    }
    const updated = await tool.save();
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await dbConnect();
  try {
    const deleted = await Tool.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ message: "Tool not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Tool deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
