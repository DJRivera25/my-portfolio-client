import fs from "node:fs";
import path from "node:path";
import os from "node:os";

export const TIMEOUT_MS = 4000;
export const MAX_BRIEFING_LINES = 40;

const SCHEME = /^[a-z][a-z0-9+.-]*:\/\//i;
const SCP_STYLE = /^(?:[^@/\s]+@)?([^:/\s]+):(.+)$/;

// Duplicated from lib/worklog/repo.ts (the hook cannot import TS) — keep the two in step.
export function normaliseRepoUrl(input) {
  if (!input) return null;
  let rest = String(input).trim().split(/[?#]/)[0];
  if (!rest) return null;

  let host;
  let urlPath;

  if (SCHEME.test(rest)) {
    rest = rest.replace(SCHEME, "");
    const slash = rest.indexOf("/");
    const authority = slash === -1 ? rest : rest.slice(0, slash);
    urlPath = slash === -1 ? "" : rest.slice(slash + 1);
    host = authority.slice(authority.lastIndexOf("@") + 1).replace(/:\d*$/, "");
  } else {
    const scp = SCP_STYLE.exec(rest);
    if (scp) {
      host = scp[1];
      urlPath = scp[2];
    } else {
      const slash = rest.indexOf("/");
      if (slash === -1) return null;
      host = rest.slice(0, slash);
      urlPath = rest.slice(slash + 1);
    }
  }

  host = host.toLowerCase();
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(host)) return null;

  const segments = urlPath
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.toLowerCase());
  if (segments.length < 2 || segments.some((segment) => segment.includes("@"))) return null;
  segments[segments.length - 1] = segments[segments.length - 1].replace(/\.git$/, "");
  if (!segments[segments.length - 1]) return null;

  return [host, ...segments].join("/");
}

function baseName(p) {
  return p.replace(/[\\/]+$/, "").split(/[\\/]/).pop() ?? "";
}

export function mainCheckoutName(gitCommonDir) {
  if (!gitCommonDir) return null;
  const trimmed = gitCommonDir.trim().replace(/[\\/]+$/, "");
  const base = baseName(trimmed);
  if (base === ".git") {
    const parent = baseName(trimmed.slice(0, trimmed.length - base.length));
    return parent || null;
  }
  return base.replace(/\.git$/, "") || null;
}

export function projectLookup({ remoteUrl, commonDir }) {
  const repo = normaliseRepoUrl(remoteUrl);
  if (repo) return { repo };
  const project = mainCheckoutName(commonDir);
  return project ? { project } : null;
}

export function capLines(text, max) {
  const lines = text.split("\n");
  if (lines.length <= max) return text;
  const kept = lines.slice(0, max - 1);
  kept.push(`…and ${lines.length - kept.length} more lines`);
  return kept.join("\n");
}

export function briefingFrom(reply) {
  if (reply === null) return "Worklog unreachable: no cross-session check this time.";
  if (reply.startsWith("No worklog project matches")) return reply;
  if (/^No entries/i.test(reply)) return null;
  return [
    "Open worklog items for this project:",
    capLines(reply.trimEnd(), MAX_BRIEFING_LINES - 3),
    "Use list_work / work_report for detail. Log work as it completes, and attach the",
    "commit sha and any published artifact URL to the entry.",
  ].join("\n");
}

export function parseHookInput(raw) {
  try {
    const parsed = JSON.parse(raw);
    const out = {};
    if (typeof parsed?.session_id === "string") out.sessionId = parsed.session_id;
    if (typeof parsed?.cwd === "string") out.cwd = parsed.cwd;
    return out;
  } catch {
    return {};
  }
}

export function readServerConfig({
  configPath = path.join(os.homedir(), ".claude.json"),
  urlOverride = process.env.WORKLOG_HOOK_URL_OVERRIDE,
} = {}) {
  const raw = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const server = raw?.mcpServers?.worklog;
  if (!server?.url) return null;
  const auth = server.headers?.Authorization ?? server.headers?.authorization;
  if (!auth) return null;
  return { url: urlOverride || server.url, auth };
}

export async function callTool(cfg, name, args, timeoutMs = TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(cfg.url, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: cfg.auth,
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: { name, arguments: args },
      }),
    });
    if (!res.ok) return null;
    const body = await res.text();
    // Streamable HTTP answers as SSE; the payload is the first `data:` line.
    const line = body.split("\n").find((l) => l.startsWith("data: "));
    const parsed = JSON.parse(line ? line.slice(6) : body);
    if (parsed?.error || parsed?.result?.isError) return null;
    return parsed?.result?.content?.[0]?.text ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
