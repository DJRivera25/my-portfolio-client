import { describe, it, expect, vi } from "vitest";
import { allowsFraming, isEmbeddable } from "./embeddable";

const SITE = "https://maximum88.com.au";
const PORTFOLIO = "https://my-portfolio-client-one.vercel.app";

const headers = (init: Record<string, string>) => new Headers(init);

function fakeFetch(...responses: Array<Response | Error>) {
  const fn = vi.fn();
  for (const r of responses) {
    if (r instanceof Error) fn.mockRejectedValueOnce(r);
    else fn.mockResolvedValueOnce(r);
  }
  return fn as unknown as typeof fetch & ReturnType<typeof vi.fn>;
}

function page(status: number, init: Record<string, string> = {}, finalUrl?: string) {
  const res = new Response("<html></html>", { status, headers: init });
  if (finalUrl) Object.defineProperty(res, "url", { value: finalUrl });
  return res;
}

describe("allowsFraming", () => {
  it("allows a site that sends no framing headers", () => {
    expect(allowsFraming(headers({}), SITE, PORTFOLIO)).toBe(true);
  });

  it("blocks X-Frame-Options DENY and SAMEORIGIN, in any case", () => {
    expect(allowsFraming(headers({ "x-frame-options": "DENY" }), SITE, PORTFOLIO)).toBe(false);
    expect(allowsFraming(headers({ "x-frame-options": " sameorigin " }), SITE, PORTFOLIO)).toBe(false);
  });

  it("ignores ALLOW-FROM on its own, as browsers do", () => {
    expect(allowsFraming(headers({ "x-frame-options": "ALLOW-FROM https://x.com" }), SITE, PORTFOLIO)).toBe(true);
  });

  it("blocks conflicting X-Frame-Options values that include deny", () => {
    expect(allowsFraming(headers({ "x-frame-options": "DENY, ALLOW-FROM https://x.com" }), SITE, PORTFOLIO)).toBe(
      false,
    );
  });

  it("blocks frame-ancestors 'none', 'self' and an empty list", () => {
    for (const csp of ["frame-ancestors 'none'", "frame-ancestors 'self'", "default-src 'self'; frame-ancestors"]) {
      expect(allowsFraming(headers({ "content-security-policy": csp }), SITE, PORTFOLIO)).toBe(false);
    }
  });

  it("allows frame-ancestors *, https: and a matching host", () => {
    for (const csp of [
      "frame-ancestors *",
      "frame-ancestors https:",
      `frame-ancestors 'self' ${PORTFOLIO}`,
      "frame-ancestors https://*.vercel.app",
      "Frame-Ancestors my-portfolio-client-one.vercel.app",
    ]) {
      expect(allowsFraming(headers({ "content-security-policy": csp }), SITE, PORTFOLIO)).toBe(true);
    }
  });

  it("blocks frame-ancestors that name other hosts or ports", () => {
    for (const csp of [
      "frame-ancestors https://other.example",
      "frame-ancestors https://*.other.vercel.app",
      `frame-ancestors ${PORTFOLIO}:8443`,
    ]) {
      expect(allowsFraming(headers({ "content-security-policy": csp }), SITE, PORTFOLIO)).toBe(false);
    }
  });

  it("lets frame-ancestors override X-Frame-Options", () => {
    const h = headers({ "content-security-policy": "frame-ancestors *", "x-frame-options": "DENY" });
    expect(allowsFraming(h, SITE, PORTFOLIO)).toBe(true);
  });

  it("still applies X-Frame-Options when the CSP has no frame-ancestors", () => {
    const h = headers({ "content-security-policy": "default-src 'self'", "x-frame-options": "DENY" });
    expect(allowsFraming(h, SITE, PORTFOLIO)).toBe(false);
  });

  it("requires every CSP policy to allow the portfolio", () => {
    const h = new Headers();
    h.append("content-security-policy", "frame-ancestors *");
    h.append("content-security-policy", "frame-ancestors 'none'");
    expect(allowsFraming(h, SITE, PORTFOLIO)).toBe(false);
  });

  it("ignores report-only policies", () => {
    const h = headers({ "content-security-policy-report-only": "frame-ancestors 'none'" });
    expect(allowsFraming(h, SITE, PORTFOLIO)).toBe(true);
  });
});

describe("isEmbeddable", () => {
  it("fetches the site and allows it when nothing blocks framing", async () => {
    const fetchImpl = fakeFetch(page(200));
    await expect(isEmbeddable(SITE, PORTFOLIO, { fetch: fetchImpl })).resolves.toBe(true);
    expect(fetchImpl).toHaveBeenCalledWith(SITE + "/", expect.objectContaining({ redirect: "follow" }));
  });

  it("is false when the site blocks framing", async () => {
    const fetchImpl = fakeFetch(page(200, { "x-frame-options": "SAMEORIGIN" }));
    await expect(isEmbeddable(SITE, PORTFOLIO, { fetch: fetchImpl })).resolves.toBe(false);
  });

  it("is false when the site answers with an error status", async () => {
    const fetchImpl = fakeFetch(page(403));
    await expect(isEmbeddable(SITE, PORTFOLIO, { fetch: fetchImpl })).resolves.toBe(false);
  });

  it("is false when the site cannot be reached or times out", async () => {
    const timeout = new DOMException("timed out", "TimeoutError");
    await expect(isEmbeddable(SITE, PORTFOLIO, { fetch: fakeFetch(timeout) })).resolves.toBe(false);
  });

  it("does not fetch links that are not web addresses", async () => {
    const fetchImpl = fakeFetch();
    for (const link of ["#", "", "javascript:alert(1)", "ftp://files.example"]) {
      await expect(isEmbeddable(link, PORTFOLIO, { fetch: fetchImpl })).resolves.toBe(false);
    }
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("refuses an http site on an https portfolio, which the browser would block as mixed content", async () => {
    const fetchImpl = fakeFetch();
    await expect(isEmbeddable("http://maximum88.com.au", PORTFOLIO, { fetch: fetchImpl })).resolves.toBe(false);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("allows an http site when the portfolio itself runs on http (local dev)", async () => {
    const fetchImpl = fakeFetch(page(200));
    await expect(isEmbeddable("http://maximum88.com.au", "http://localhost:3000", { fetch: fetchImpl })).resolves.toBe(
      true,
    );
  });

  it("refuses an https link that redirects to http", async () => {
    const fetchImpl = fakeFetch(page(200, {}, "http://maximum88.com.au/"));
    await expect(isEmbeddable(SITE, PORTFOLIO, { fetch: fetchImpl })).resolves.toBe(false);
  });
});
