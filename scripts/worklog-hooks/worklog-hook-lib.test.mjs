import { test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { normaliseRepoUrl, mainCheckoutName, projectLookup, capLines, parseHookInput, callTool, readServerConfig,
  briefingFrom } from "./worklog-hook-lib.mjs";

// Mirrors lib/worklog/repo.test.ts — keep the two tables in step.
test("normaliseRepoUrl accepts the same address forms as the server", () => {
  const cases = [
    ["https://github.com/Owner/ToolsAustralia.git", "github.com/owner/toolsaustralia"],
    ["https://github.com/owner/toolsaustralia/", "github.com/owner/toolsaustralia"],
    ["git@github.com:Owner/ToolsAustralia.git", "github.com/owner/toolsaustralia"],
    ["ssh://git@github.com:22/owner/ToolsAustralia.git", "github.com/owner/toolsaustralia"],
    ["github.com/owner/toolsaustralia", "github.com/owner/toolsaustralia"],
    ["https://gitlab.com/g/sub/Repo.git", "gitlab.com/g/sub/repo"],
  ];
  for (const [input, expected] of cases) assert.equal(normaliseRepoUrl(input), expected, input);
});

test("normaliseRepoUrl never leaks credentials, including slashes in them", () => {
  const slashPassword = normaliseRepoUrl("https://user:pa.ss/word@github.com/owner/repo");
  assert.ok(slashPassword === null || slashPassword === "github.com/owner/repo");
  assert.ok(!(slashPassword ?? "").includes("pa.ss"));
  assert.ok(!(slashPassword ?? "").includes("word"));
  const noColon = normaliseRepoUrl("https://abc.de/fg@github.com/o/r");
  assert.ok(!(noColon ?? "").includes("fg"));
  assert.equal(noColon, null);
});

test("normaliseRepoUrl returns null for non-addresses and is idempotent", () => {
  for (const input of ["", null, undefined, "C:/Codes/ToolsAustralia", "just-a-name", "https://github.com/", "file:///srv/repo.git", "../relative/path", "a..b/owner/repo"]) {
    assert.equal(normaliseRepoUrl(input), null, String(input));
  }
  const once = normaliseRepoUrl("git@github.com:Owner/Repo.git");
  assert.equal(normaliseRepoUrl(once), once);
});

async function withServer(handler, run) {
  const server = http.createServer(handler);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const cfg = { url: `http://127.0.0.1:${server.address().port}/mcp`, auth: "Bearer fixture-token" };
  try {
    return await run(cfg);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
}

const reply = (res, payload, status = 200) => {
  res.writeHead(status, { "Content-Type": "text/event-stream" });
  res.end(`event: message\ndata: ${JSON.stringify(payload)}\n\n`);
};

test("callTool returns the text of a normal reply and sends the auth header", async () => {
  let seenAuth;
  await withServer((req, res) => {
    seenAuth = req.headers.authorization;
    reply(res, { jsonrpc: "2.0", id: 1, result: { content: [{ type: "text", text: "hello" }] } });
  }, async (cfg) => {
    assert.equal(await callTool(cfg, "list_work", {}), "hello");
  });
  assert.equal(seenAuth, "Bearer fixture-token");
});

test("callTool returns null for isError, a JSON-RPC error, and HTTP 500", async () => {
  const bodies = [
    [200, { jsonrpc: "2.0", id: 1, result: { isError: true, content: [{ type: "text", text: "boom" }] } }],
    [200, { jsonrpc: "2.0", id: 1, error: { code: -32000, message: "nope" } }],
    [500, { jsonrpc: "2.0", id: 1, result: { content: [{ type: "text", text: "x" }] } }],
  ];
  for (const [status, payload] of bodies) {
    await withServer((req, res) => reply(res, payload, status), async (cfg) => {
      assert.equal(await callTool(cfg, "list_work", {}), null);
    });
  }
});

test("callTool returns null when the server never answers", async () => {
  await withServer(() => {}, async (cfg) => {
    assert.equal(await callTool(cfg, "list_work", {}, 200), null);
  });
});

test("readServerConfig reads url and auth; urlOverride replaces only the url", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "worklog-hook-test-"));
  const configPath = path.join(dir, "config.json");
  fs.writeFileSync(configPath, JSON.stringify({
    mcpServers: { worklog: { url: "http://fixture.invalid/mcp", headers: { Authorization: "Bearer fixture-token" } } },
  }));
  try {
    assert.deepEqual(readServerConfig({ configPath, urlOverride: "" }),
      { url: "http://fixture.invalid/mcp", auth: "Bearer fixture-token" });
    assert.deepEqual(readServerConfig({ configPath, urlOverride: "http://127.0.0.1:9/mcp" }),
      { url: "http://127.0.0.1:9/mcp", auth: "Bearer fixture-token" });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("normaliseRepoUrl strips credentials and matches the server's rules", () => {
  const out = normaliseRepoUrl("https://someone:not-a-real-secret@github.com/Owner/Repo.git");
  assert.equal(out, "github.com/owner/repo");
  assert.ok(!out.includes("not-a-real-secret"));
  assert.equal(normaliseRepoUrl("git@github.com:Owner/ToolsAustralia.git"), "github.com/owner/toolsaustralia");
  assert.equal(normaliseRepoUrl("C:/Codes/ToolsAustralia"), null);
});

test("mainCheckoutName finds the main checkout from a worktree's common dir", () => {
  assert.equal(mainCheckoutName("C:/Codes/ToolsAustralia/.git"), "ToolsAustralia");
  assert.equal(mainCheckoutName("/srv/repos/app.git"), "app");
  assert.equal(mainCheckoutName(null), null);
});

test("projectLookup prefers the remote, then the main checkout name, else null", () => {
  assert.deepEqual(projectLookup({ remoteUrl: "git@github.com:o/ToolsAustralia.git", commonDir: "C:/Codes/ToolsAustralia/.git" }),
    { repo: "github.com/o/toolsaustralia" });
  assert.deepEqual(projectLookup({ remoteUrl: null, commonDir: "C:/Codes/ToolsAustralia/.git" }),
    { project: "ToolsAustralia" });
  assert.equal(projectLookup({ remoteUrl: null, commonDir: null }), null);
});

test("capLines keeps the budget and says what it cut", () => {
  const text = Array.from({ length: 45 }, (_, i) => `line ${i + 1}`).join("\n");
  const out = capLines(text, 40).split("\n");
  assert.equal(out.length, 40);
  assert.equal(out[39], "…and 6 more lines");
});

test("briefingFrom turns each server reply into the right output or silence", () => {
  assert.equal(briefingFrom(null), "Worklog unreachable: no cross-session check this time.");
  const noMatch = "No worklog project matches this repo — set it with `set_work_project_status` (repo).";
  assert.equal(briefingFrom(noMatch), noMatch);
  assert.equal(briefingFrom("No entries."), null);
  const out = briefingFrom("#1 open  Fix the thing\n");
  assert.equal(out.split("\n")[0], "Open worklog items for this project:");
  assert.ok(out.includes("#1 open  Fix the thing"));
});

test("briefingFrom caps a long reply at 40 lines and keeps the guidance lines", () => {
  const long = Array.from({ length: 60 }, (_, i) => `entry ${i + 1}`).join("\n");
  const lines = briefingFrom(long).split("\n");
  assert.ok(lines.length <= 40, String(lines.length));
  assert.match(lines[lines.length - 2], /^Use list_work/);
  assert.match(lines[lines.length - 1], /^commit sha/);
});

test("parseHookInput never throws", () => {
  assert.deepEqual(parseHookInput("not json"), {});
  assert.deepEqual(parseHookInput('{"session_id":"abc","cwd":"C:/x"}'), { sessionId: "abc", cwd: "C:/x" });
});
