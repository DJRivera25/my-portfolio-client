import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

export async function GET() {
  await dbConnect();
  const users = await User.find();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  await dbConnect();
  const data = await request.json();
  const user = await User.create(data);
  return NextResponse.json(user, { status: 201 });
}

export async function PUT(request: Request) {
  await dbConnect();
  const { id, ...update } = await request.json();
  const updated = await User.findByIdAndUpdate(id, update, { new: true });
  if (!updated) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  await dbConnect();
  const { id } = await request.json();
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "User deleted successfully" });
}
