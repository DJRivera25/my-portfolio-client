import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Message from "@/lib/models/Message";

export async function GET() {
  await dbConnect();
  const messages = await Message.find();
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  await dbConnect();
  const data = await request.json();
  // Map 'message' to 'content' for model compatibility
  const { name, email, message, subject, ...rest } = data;
  if (!name || !email || !message) {
    return NextResponse.json({ message: "Name, email, and message are required." }, { status: 400 });
  }
  const messageDoc = await Message.create({
    name,
    email,
    content: message, // Map to required field
    ...rest,
  });
  return NextResponse.json(messageDoc, { status: 201 });
}

export async function PUT(request: Request) {
  await dbConnect();
  const { id, ...update } = await request.json();
  const updated = await Message.findByIdAndUpdate(id, update, { new: true });
  if (!updated) {
    return NextResponse.json({ message: "Message not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  await dbConnect();
  const { id } = await request.json();
  const deleted = await Message.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ message: "Message not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Message deleted successfully" });
}
