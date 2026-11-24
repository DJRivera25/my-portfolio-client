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

export type McpClient = "claude-code" | "claude-ai";

function matchesSecret(token: string, expected: string | undefined): boolean {
  if (!expected) return false;
  const supplied = Buffer.from(token);
  const secret = Buffer.from(expected);
  if (supplied.length !== secret.length) return false;
  return timingSafeEqual(supplied, secret);
}

/**
 * MCP auth for /api/mcp — separate credentials from ADMIN_API_TOKEN, because they live on
 * whatever machine runs Claude Code (or in claude.ai) and must be revocable without losing
 * dashboard access.
 *
 * Unlike isAuthorizedAdmin there is NO fallback value: an unset MCP_TOKEN denies Claude Code
 * (and an unset MCP_CLAUDE_AI_TOKEN denies claude.ai); leave both unset to close /api/mcp.
 *
 * Returns which MCP client a request's bearer token belongs to, or null to deny. Both tokens
 * are always compared so timing does not reveal which one matched.
 */
export function mcpClientFor(req: NextRequest | Request): McpClient | null {
  const token = getBearerToken(req);
  if (!token) return null;
  const isCode = matchesSecret(token, process.env.MCP_TOKEN);
  const isClaudeAi = matchesSecret(token, process.env.MCP_CLAUDE_AI_TOKEN);
  if (isCode) return "claude-code";
  if (isClaudeAi) return "claude-ai";
  return null;
}

export function isAuthorizedMcp(req: NextRequest | Request): boolean {
  return mcpClientFor(req) !== null;
}
