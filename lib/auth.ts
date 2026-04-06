import { NextRequest, NextResponse } from "next/server";

/**
 * Admin auth: login returns Bearer token (see app/api/auth/login).
 * Set ADMIN_API_TOKEN in production to a strong secret; must match token issued by login.
 */
export function getBearerToken(req: NextRequest | Request): string | null {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7).trim() || null;
}

export function isAuthorizedAdmin(req: NextRequest | Request): boolean {
  const token = getBearerToken(req);
  if (!token) return false;
  const expected = process.env.ADMIN_API_TOKEN || "admin-static-token";
  return token === expected;
}

export function unauthorizedResponse() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}
