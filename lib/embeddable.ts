const CHECK_TIMEOUT_MS = 6_000;

type CheckOptions = { fetch?: typeof fetch; timeoutMs?: number };

/** Whether a browser would let `embedderOrigin` show the site in an iframe, judged from its response headers. */
export function allowsFraming(headers: Headers, siteUrl: string, embedderOrigin: string): boolean {
  const site = new URL(siteUrl);
  const embedder = new URL(embedderOrigin);
  const ancestorLists = frameAncestorLists(headers.get("content-security-policy"));
  if (ancestorLists.length > 0) {
    return ancestorLists.every((sources) => sources.some((source) => sourceMatches(source, embedder, site)));
  }
  return xFrameOptionsAllows(headers.get("x-frame-options"), embedder, site);
}

export async function isEmbeddable(siteUrl: string, embedderOrigin: string, options: CheckOptions = {}) {
  const { fetch: fetchImpl = fetch, timeoutMs = CHECK_TIMEOUT_MS } = options;
  let link: URL;
  try {
    link = new URL(siteUrl);
  } catch {
    return false;
  }
  if (!loadableIn(link, embedderOrigin)) return false;

  try {
    const res = await fetchImpl(link.href, {
      redirect: "follow",
      headers: { accept: "text/html" },
      signal: AbortSignal.timeout(timeoutMs),
    });
    await res.body?.cancel().catch(() => {});
    const finalUrl = res.url || link.href;
    if (!res.ok || !loadableIn(new URL(finalUrl), embedderOrigin)) return false;
    return allowsFraming(res.headers, finalUrl, embedderOrigin);
  } catch {
    return false;
  }
}

// An https page cannot frame an http one: browsers block it as mixed content.
function loadableIn(url: URL, embedderOrigin: string) {
  if (url.protocol === "https:") return true;
  return url.protocol === "http:" && new URL(embedderOrigin).protocol === "http:";
}

function frameAncestorLists(csp: string | null): string[][] {
  if (!csp) return [];
  const lists: string[][] = [];
  for (const policy of csp.split(",")) {
    for (const directive of policy.split(";")) {
      const [name, ...sources] = directive.trim().split(/\s+/);
      if (name.toLowerCase() === "frame-ancestors") {
        lists.push(sources.filter(Boolean));
        break;
      }
    }
  }
  return lists;
}

function xFrameOptionsAllows(raw: string | null, embedder: URL, site: URL) {
  if (!raw) return true;
  const values = new Set(
    raw
      .split(",")
      .map((v) => v.trim().toLowerCase())
      .filter(Boolean),
  );
  if (values.size > 1) return ![...values].some((v) => v === "deny" || v === "sameorigin" || v === "allowall");
  const [only] = values;
  if (only === "deny") return false;
  if (only === "sameorigin") return embedder.origin === site.origin;
  return true;
}

const HOST_SOURCE = /^(?:([a-z][a-z0-9+.-]*):\/\/)?(\*|\*\.[^:/]+|[^:/*]+)(?::(\d+|\*))?(?:\/.*)?$/;

function sourceMatches(source: string, embedder: URL, site: URL) {
  const s = source.toLowerCase();
  if (s === "'self'") return embedder.origin === site.origin;
  if (s.startsWith("'")) return false;
  if (s === "*") return embedder.protocol === "https:" || embedder.protocol === "http:";
  if (/^[a-z][a-z0-9+.-]*:$/.test(s)) return schemeMatches(s, embedder.protocol);

  const host = HOST_SOURCE.exec(s);
  if (!host) return false;
  const [, scheme, hostPattern, port] = host;
  if (!schemeMatches(scheme ? `${scheme}:` : site.protocol, embedder.protocol)) return false;
  if (!hostMatches(hostPattern, embedder.hostname)) return false;
  if (port === "*") return true;
  return port ? port === (embedder.port || DEFAULT_PORT[embedder.protocol]) : embedder.port === "";
}

const DEFAULT_PORT: Record<string, string> = { "http:": "80", "https:": "443" };

function schemeMatches(sourceScheme: string, embedderScheme: string) {
  return sourceScheme === embedderScheme || (sourceScheme === "http:" && embedderScheme === "https:");
}

function hostMatches(pattern: string, hostname: string) {
  if (pattern === "*") return true;
  if (pattern.startsWith("*.")) return hostname.endsWith(pattern.slice(1));
  return pattern === hostname;
}
