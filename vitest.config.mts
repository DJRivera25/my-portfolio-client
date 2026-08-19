import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
  resolve: {
    // import.meta.dirname, not __dirname — this file is ESM (.mts).
    alias: { "@": import.meta.dirname },
  },
});
