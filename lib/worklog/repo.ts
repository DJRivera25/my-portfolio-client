import { projectMatchKey } from "./slug";

const SCHEME = /^[a-z][a-z0-9+.-]*:\/\//i;
const SCP_STYLE = /^(?:[^@/\s]+@)?([^:/\s]+):(.+)$/;

// Duplicated in scripts/worklog-hooks/worklog-hook-lib.mjs (the hook cannot import TS) — keep the two in step.
export function normaliseRepoUrl(input: string | null | undefined): string | null {
  if (!input) return null;
  let rest = input.trim().split(/[?#]/)[0];
  if (!rest) return null;

  let host: string;
  let path: string;

  if (SCHEME.test(rest)) {
    rest = rest.replace(SCHEME, "");
    const slash = rest.indexOf("/");
    const authority = slash === -1 ? rest : rest.slice(0, slash);
    path = slash === -1 ? "" : rest.slice(slash + 1);
    host = authority.slice(authority.lastIndexOf("@") + 1).replace(/:\d*$/, "");
  } else {
    const scp = SCP_STYLE.exec(rest);
    if (scp) {
      host = scp[1];
      path = scp[2];
    } else {
      const slash = rest.indexOf("/");
      if (slash === -1) return null;
      host = rest.slice(0, slash);
      path = rest.slice(slash + 1);
    }
  }

  host = host.toLowerCase();
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(host)) return null;

  const segments = path
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.toLowerCase());
  if (segments.length < 2 || segments.some((segment) => segment.includes("@"))) return null;
  segments[segments.length - 1] = segments[segments.length - 1].replace(/\.git$/, "");
  if (!segments[segments.length - 1]) return null;

  return [host, ...segments].join("/");
}

export function storableRepo(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return "";
  const normalised = normaliseRepoUrl(trimmed);
  if (normalised) return normalised;
  return trimmed.includes("@") ? null : trimmed;
}

export function repoNameKey(normalised: string): string {
  const segments = normalised.split("/");
  return projectMatchKey(segments[segments.length - 1]);
}
