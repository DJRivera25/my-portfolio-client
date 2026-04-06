import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Resume from "@/lib/models/Resume";
import { isAuthorizedAdmin, unauthorizedResponse } from "@/lib/auth";

export async function GET() {
  await dbConnect();
  const resumes = await Resume.find();
  return NextResponse.json(resumes);
}

export async function POST(request: Request) {
  if (!isAuthorizedAdmin(request)) return unauthorizedResponse();
  await dbConnect();
  const data = await request.json();
  const resume = await Resume.create(data);
  return NextResponse.json(resume, { status: 201 });
}

export async function PUT(request: Request) {
  if (!isAuthorizedAdmin(request)) return unauthorizedResponse();
  await dbConnect();
  const { id, ...update } = await request.json();
  const updated = await Resume.findByIdAndUpdate(id, update, { new: true });
  if (!updated) {
    return NextResponse.json({ message: "Resume not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  if (!isAuthorizedAdmin(request)) return unauthorizedResponse();
  await dbConnect();
  const { id } = await request.json();
  const deleted = await Resume.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ message: "Resume not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Resume deleted successfully" });
}
