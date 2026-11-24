import { afterEach, describe, expect, it, vi } from "vitest";
import { isAuthorizedMcp, mcpClientFor } from "./auth";

const req = (token?: string) =>
  new Request("https://example.test/api/mcp", {
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });

afterEach(() => vi.unstubAllEnvs());

describe("mcpClientFor", () => {
  it("names Claude Code for MCP_TOKEN and claude.ai for MCP_CLAUDE_AI_TOKEN", () => {
    vi.stubEnv("MCP_TOKEN", "fixture-code-aaaa");
    vi.stubEnv("MCP_CLAUDE_AI_TOKEN", "fixture-web-bbbbbb");
    expect(mcpClientFor(req("fixture-code-aaaa"))).toBe("claude-code");
    expect(mcpClientFor(req("fixture-web-bbbbbb"))).toBe("claude-ai");
  });
  it("denies a wrong token of either length", () => {
    vi.stubEnv("MCP_TOKEN", "fixture-code-aaaa");
    expect(mcpClientFor(req("fixture-code-aaab"))).toBeNull();
    expect(mcpClientFor(req("short"))).toBeNull();
  });
  it("denies everything when both are unset", () => {
    vi.stubEnv("MCP_TOKEN", "");
    vi.stubEnv("MCP_CLAUDE_AI_TOKEN", "");
    expect(mcpClientFor(req("anything"))).toBeNull();
    expect(mcpClientFor(req())).toBeNull();
  });
  it("keeps isAuthorizedMcp true for either client", () => {
    vi.stubEnv("MCP_TOKEN", "fixture-code-aaaa");
    vi.stubEnv("MCP_CLAUDE_AI_TOKEN", "fixture-web-bbbbbb");
    expect(isAuthorizedMcp(req("fixture-web-bbbbbb"))).toBe(true);
  });
});
