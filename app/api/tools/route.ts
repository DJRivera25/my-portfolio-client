import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Tool from "@/lib/models/Tool";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function GET() {
  await dbConnect();
  const tools = await Tool.find();
  return NextResponse.json(tools);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.startsWith("multipart/form-data")) {
    return NextResponse.json({ message: "Invalid content type" }, { status: 400 });
  }
  const formData = await req.formData();
  const name = formData.get("name");
  const category = formData.get("category");
  const file = formData.get("icon");
  if (!name || !category || !file || typeof file === "string") {
    return NextResponse.json({ message: "All fields including icon are required" }, { status: 400 });
  }
  // Now file is a File
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
  const tool = await Tool.create({ name: String(name), category: String(category), icon: upload.secure_url });
  return NextResponse.json(tool, { status: 201 });
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.startsWith("multipart/form-data")) {
    return NextResponse.json({ message: "Invalid content type" }, { status: 400 });
  }
  const formData = await req.formData();
  const id = formData.get("id");
  const name = formData.get("name");
  const category = formData.get("category");
  const file = formData.get("icon");
  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }
  const tool = await Tool.findById(id);
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
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const { id } = await req.json();
  const deleted = await Tool.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ message: "Tool not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Tool deleted successfully" });
}
