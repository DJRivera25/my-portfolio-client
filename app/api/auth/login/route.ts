import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const allowedEmail = process.env.ADMIN_EMAIL;
  const allowedPassword = process.env.ADMIN_PASSWORD;

  if (!allowedEmail || !allowedPassword) {
    return NextResponse.json({ message: "Server misconfiguration" }, { status: 500 });
  }

  if (email === allowedEmail && password === allowedPassword) {
    const response = NextResponse.json({
      user: {
        email,
        role: "admin",
      },
      token: "admin-static-token",
    });
    // Set a secure cookie for authentication
    response.cookies.set("token", "admin-static-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return response;
  } else {
    return NextResponse.json({ message: "Unauthorized access" }, { status: 403 });
  }
}
