// Screenshot provider adapter. The provider (Microlink) is named only here and in the
// MICROLINK_API_KEY env var, so swapping it touches this file alone.

const FREE_ENDPOINT = "https://api.microlink.io/";
// Keyed requests must use this host; the free one answers a key with EPRO.
const KEYED_ENDPOINT = "https://pro.microlink.io/";

// The free endpoint gives up navigating after 30s; leave room to download the image before
// the route's 60s maxDuration.
const CAPTURE_TIMEOUT_MS = 45_000;
const DOWNLOAD_TIMEOUT_MS = 10_000;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const SITE_FAILURES: Record<string, string> = {
  EBRWSRTIMEOUT: "The site took too long to load.",
  ETIMEOUT: "The site took too long to load.",
  EUNREACHABLE: "The site didn't respond.",
  EPROXYNEEDED: "The site blocks automated browsers.",
  EMAXREDIRECTS: "The site redirects too many times.",
  EFORBIDDENURL: "That address can't be captured.",
  EINVALURL: "That link isn't a valid web address.",
  EFATAL: "The site couldn't be loaded.",
};

export type ScreenshotFailure = "rate_limited" | "site_failed" | "provider_failed";

export class ScreenshotError extends Error {
  constructor(
    readonly reason: ScreenshotFailure,
    message: string,
  ) {
    super(message);
    this.name = "ScreenshotError";
  }
}

export function buildScreenshotRequest(
  siteUrl: string,
  apiKey?: string,
): { url: string; headers: Record<string, string> } {
  const endpoint = new URL(apiKey ? KEYED_ENDPOINT : FREE_ENDPOINT);
  endpoint.searchParams.set("url", siteUrl);
  endpoint.searchParams.set("screenshot", "true");
  endpoint.searchParams.set("meta", "false");
  endpoint.searchParams.set("screenshot.type", "jpeg");
  endpoint.searchParams.set("viewport.width", "1440");
  endpoint.searchParams.set("viewport.height", "900");
  endpoint.searchParams.set("viewport.deviceScaleFactor", "1");
  return { url: endpoint.toString(), headers: apiKey ? { "x-api-key": apiKey } : {} };
}

type CaptureOptions = { fetch?: typeof fetch; apiKey?: string };

export async function captureScreenshot(siteUrl: string, options: CaptureOptions = {}): Promise<Buffer> {
  const fetchImpl = options.fetch ?? fetch;
  const apiKey = "apiKey" in options ? options.apiKey : process.env.MICROLINK_API_KEY;
  const request = buildScreenshotRequest(siteUrl, apiKey || undefined);

  const res = await call(() =>
    fetchImpl(request.url, { headers: request.headers, signal: AbortSignal.timeout(CAPTURE_TIMEOUT_MS) }),
  );
  const body = await res.json().catch(() => null);
  if (!body || typeof body !== "object") {
    throw new ScreenshotError("provider_failed", "The screenshot service sent an unreadable reply.");
  }

  const code = typeof body.code === "string" ? body.code : "";
  if (res.status === 429 || code === "ERATE" || code === "ECONCURRENCY") {
    throw new ScreenshotError(
      "rate_limited",
      code === "ECONCURRENCY"
        ? "Another capture is still running. Try again in a moment."
        : "Today's screenshot allowance is used up. Upload an image instead, or try again tomorrow.",
    );
  }
  if (body.status !== "success") {
    const siteMessage = SITE_FAILURES[code];
    if (siteMessage) throw new ScreenshotError("site_failed", `${siteMessage} Upload an image instead.`);
    throw new ScreenshotError("provider_failed", "The screenshot service failed. Upload an image instead.");
  }

  const shotUrl: unknown = body.data?.screenshot?.url;
  if (typeof shotUrl !== "string" || !shotUrl.startsWith("https://")) {
    throw new ScreenshotError("provider_failed", "The screenshot service returned no image.");
  }

  const img = await call(() => fetchImpl(shotUrl, { signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS) }));
  if (!img.ok || !(img.headers.get("content-type") ?? "").startsWith("image/")) {
    throw new ScreenshotError("provider_failed", "The captured image couldn't be downloaded.");
  }
  const bytes = Buffer.from(await img.arrayBuffer());
  if (bytes.length === 0 || bytes.length > MAX_IMAGE_BYTES) {
    throw new ScreenshotError("provider_failed", "The captured image was empty or too large.");
  }
  return bytes;
}

async function call(send: () => Promise<Response>): Promise<Response> {
  try {
    return await send();
  } catch (err) {
    if (err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")) {
      throw new ScreenshotError("site_failed", "The site took too long to capture. Upload an image instead.");
    }
    throw new ScreenshotError("provider_failed", "Couldn't reach the screenshot service.");
  }
}
