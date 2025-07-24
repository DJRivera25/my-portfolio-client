import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const allowedEmail = process.env.ADMIN_EMAIL;
  const allowedPassword = process.env.ADMIN_PASSWORD;

  if (!allowedEmail || !allowedPassword) {
    return NextResponse.json({ message: "Server misconfiguration" }, { status: 500 });
  }

  if (email === allowedEmail && password === allowedPassword) {
    return NextResponse.json({
      user: {
        email,
        role: "admin",
      },
      token: "admin-static-token",
    });
  } else {
    return NextResponse.json({ message: "Unauthorized access" }, { status: 403 });
  }
}
