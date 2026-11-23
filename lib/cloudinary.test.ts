import { describe, it, expect } from "vitest";
import { isPortfolioImageUrl } from "./cloudinary";

describe("isPortfolioImageUrl", () => {
  it("accepts an https Cloudinary delivery URL", () => {
    expect(isPortfolioImageUrl("https://res.cloudinary.com/demo/image/upload/v1/portfolio/shot.jpg")).toBe(true);
  });

  it.each([
    ["plain http", "http://res.cloudinary.com/demo/image/upload/v1/portfolio/shot.jpg"],
    ["the screenshot service's temporary URL", "https://iad.microlink.io/abc.jpeg"],
    ["a lookalike host", "https://res.cloudinary.com.evil.example/shot.jpg"],
    ["not a URL", "shot.jpg"],
    ["an empty string", ""],
  ])("rejects %s", (_label, value) => {
    expect(isPortfolioImageUrl(value)).toBe(false);
  });
});
