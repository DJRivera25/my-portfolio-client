import { describe, it, expect, vi } from "vitest";
import { buildScreenshotRequest, captureScreenshot, ScreenshotError } from "./screenshot";

const SITE = "https://toolsaustralia.com.au";
const SHOT = "https://iad.microlink.io/abc.jpeg";

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

const image = (bytes: number[], contentType = "image/jpeg") =>
  new Response(new Uint8Array(bytes), { status: 200, headers: { "content-type": contentType } });

function fakeFetch(...responses: Array<Response | Error>) {
  const fn = vi.fn();
  for (const r of responses) {
    if (r instanceof Error) fn.mockRejectedValueOnce(r);
    else fn.mockResolvedValueOnce(r);
  }
  return fn as unknown as typeof fetch & ReturnType<typeof vi.fn>;
}

async function failureOf(promise: Promise<unknown>): Promise<ScreenshotError> {
  try {
    await promise;
  } catch (err) {
    if (err instanceof ScreenshotError) return err;
    throw err;
  }
  throw new Error("expected captureScreenshot to reject");
}

describe("buildScreenshotRequest", () => {
  it("asks the free endpoint for a 1440x900 non-retina JPEG of the site", () => {
    const { url, headers } = buildScreenshotRequest(SITE);
    const parsed = new URL(url);
    expect(parsed.origin).toBe("https://api.microlink.io");
    expect(parsed.searchParams.get("url")).toBe(SITE);
    expect(parsed.searchParams.get("screenshot")).toBe("true");
    expect(parsed.searchParams.get("screenshot.type")).toBe("jpeg");
    expect(parsed.searchParams.get("viewport.width")).toBe("1440");
    expect(parsed.searchParams.get("viewport.height")).toBe("900");
    expect(parsed.searchParams.get("viewport.deviceScaleFactor")).toBe("1");
    expect(headers).toEqual({});
  });

  it("sends a key to the keyed endpoint, which rejects keys on the free one", () => {
    const { url, headers } = buildScreenshotRequest(SITE, "test-key");
    expect(new URL(url).origin).toBe("https://pro.microlink.io");
    expect(headers).toEqual({ "x-api-key": "test-key" });
  });
});

describe("captureScreenshot", () => {
  it("returns the image bytes from the screenshot the service hands back", async () => {
    const fetchImpl = fakeFetch(
      json(200, { status: "success", data: { screenshot: { url: SHOT } } }),
      image([0xff, 0xd8, 0xff]),
    );
    const bytes = await captureScreenshot(SITE, { fetch: fetchImpl, apiKey: undefined });
    expect([...bytes]).toEqual([0xff, 0xd8, 0xff]);
    expect(fetchImpl.mock.calls[0][0]).toBe(buildScreenshotRequest(SITE).url);
    expect(fetchImpl.mock.calls[1][0]).toBe(SHOT);
  });

  it("reports the daily allowance as rate_limited", async () => {
    const fetchImpl = fakeFetch(json(429, { status: "fail", code: "ERATE", message: "limit" }));
    const err = await failureOf(captureScreenshot(SITE, { fetch: fetchImpl, apiKey: undefined }));
    expect(err.reason).toBe("rate_limited");
    expect(err.message).toMatch(/tomorrow/i);
  });

  it("reports a concurrent capture as rate_limited, with a retry-soon message", async () => {
    const fetchImpl = fakeFetch(json(429, { status: "fail", code: "ECONCURRENCY", message: "busy" }));
    const err = await failureOf(captureScreenshot(SITE, { fetch: fetchImpl, apiKey: undefined }));
    expect(err.reason).toBe("rate_limited");
    expect(err.message).toMatch(/moment/i);
  });

  it.each(["EBRWSRTIMEOUT", "ETIMEOUT", "EUNREACHABLE", "EPROXYNEEDED", "EINVALURL", "EFATAL"])(
    "treats %s as the site failing, not the service",
    async (code) => {
      const fetchImpl = fakeFetch(json(424, { status: "fail", code, message: "x" }));
      const err = await failureOf(captureScreenshot(SITE, { fetch: fetchImpl, apiKey: undefined }));
      expect(err.reason).toBe("site_failed");
    },
  );

  it("treats an unknown failure code as the service failing", async () => {
    const fetchImpl = fakeFetch(json(500, { status: "error", code: "EAUTH", message: "x" }));
    const err = await failureOf(captureScreenshot(SITE, { fetch: fetchImpl, apiKey: undefined }));
    expect(err.reason).toBe("provider_failed");
  });

  it("rejects a non-JSON reply", async () => {
    const fetchImpl = fakeFetch(new Response("<html>Bad gateway</html>", { status: 502 }));
    const err = await failureOf(captureScreenshot(SITE, { fetch: fetchImpl, apiKey: undefined }));
    expect(err.reason).toBe("provider_failed");
  });

  it("rejects a success reply that carries no screenshot", async () => {
    const fetchImpl = fakeFetch(json(200, { status: "success", data: {} }));
    const err = await failureOf(captureScreenshot(SITE, { fetch: fetchImpl, apiKey: undefined }));
    expect(err.reason).toBe("provider_failed");
  });

  it("refuses to download a screenshot from a non-https address", async () => {
    const fetchImpl = fakeFetch(
      json(200, { status: "success", data: { screenshot: { url: "http://169.254.169.254/latest" } } }),
    );
    const err = await failureOf(captureScreenshot(SITE, { fetch: fetchImpl, apiKey: undefined }));
    expect(err.reason).toBe("provider_failed");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("rejects a download that is not an image", async () => {
    const fetchImpl = fakeFetch(
      json(200, { status: "success", data: { screenshot: { url: SHOT } } }),
      image([1, 2, 3], "text/html"),
    );
    const err = await failureOf(captureScreenshot(SITE, { fetch: fetchImpl, apiKey: undefined }));
    expect(err.reason).toBe("provider_failed");
  });

  it("treats our own timeout as the site taking too long", async () => {
    const timeout = new DOMException("The operation was aborted due to timeout", "TimeoutError");
    const fetchImpl = fakeFetch(timeout as unknown as Error);
    const err = await failureOf(captureScreenshot(SITE, { fetch: fetchImpl, apiKey: undefined }));
    expect(err.reason).toBe("site_failed");
  });
});
