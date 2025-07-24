import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Message from "@/lib/models/Message";

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await dbConnect();
  const { id } = params;
  const message = await Message.findByIdAndUpdate(id, { hasViewed: true }, { new: true });
  if (!message) {
    return NextResponse.json({ message: "Message not found" }, { status: 404 });
  }
  return NextResponse.json(message);
}

export async function GET() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function POST() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
