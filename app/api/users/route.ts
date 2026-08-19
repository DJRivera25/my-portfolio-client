import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { isAuthorizedAdmin, unauthorizedResponse } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * Every method here was unauthenticated, and GET returned the full user document —
 * including `password`, which is stored in cleartext for the seeded admin row. That is
 * an admin credential readable by anyone who guessed the URL.
 *
 * Nothing in the app calls this endpoint, and login authenticates against ADMIN_EMAIL /
 * ADMIN_PASSWORD rather than this collection, so gating it breaks nothing.
 *
 * `.select("-password")` is belt to the auth braces: even an authorised caller has no
 * reason to receive a credential back.
 */

const SAFE_FIELDS = "-password";

export async function GET(req: Request) {
  if (!isAuthorizedAdmin(req)) return unauthorizedResponse();
  await dbConnect();
  const users = await User.find().select(SAFE_FIELDS);
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  if (!isAuthorizedAdmin(req)) return unauthorizedResponse();
  await dbConnect();
  const data = await req.json();
  const user = await User.create(data);
  const safe = await User.findById(user._id).select(SAFE_FIELDS);
  return NextResponse.json(safe, { status: 201 });
}

export async function PUT(req: Request) {
  if (!isAuthorizedAdmin(req)) return unauthorizedResponse();
  await dbConnect();
  const { id, ...update } = await req.json();
  const updated = await User.findByIdAndUpdate(id, update, { new: true }).select(SAFE_FIELDS);
  if (!updated) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  if (!isAuthorizedAdmin(req)) return unauthorizedResponse();
  await dbConnect();
  const { id } = await req.json();
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "User deleted successfully" });
}
