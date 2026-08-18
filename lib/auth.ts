import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

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

/**
 * MCP auth for /api/mcp — a separate credential from ADMIN_API_TOKEN, because it lives
 * on whatever machine runs Claude Code and must be revocable without losing dashboard
 * access.
 *
 * Unlike isAuthorizedAdmin this has NO fallback value: an unset MCP_TOKEN denies every
 * request rather than accepting a guessable default.
 */
export function isAuthorizedMcp(req: NextRequest | Request): boolean {
  const token = getBearerToken(req);
  const expected = process.env.MCP_TOKEN;
  if (!token || !expected) return false;

  const supplied = Buffer.from(token);
  const secret = Buffer.from(expected);
  if (supplied.length !== secret.length) return false;
  return timingSafeEqual(supplied, secret);
}
