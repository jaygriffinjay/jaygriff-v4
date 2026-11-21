// Runs before each test file: test-only goatboat settings, and no real network. Never touches goatboat.
import { beforeEach, vi } from "vitest";

process.env.GOATBOAT_URL = "http://goatboat.test";
process.env.GOATBOAT_READ_TOKEN = "test-read-token";
delete process.env.VERCEL_ENV;
delete process.env.VERCEL_PROJECT_PRODUCTION_URL;

// A test that needs a response stubs fetch itself; anything else fails loudly
beforeEach(() => {
  vi.stubGlobal("fetch", async (input: unknown) => {
    throw new Error(`Unexpected network request in a test: ${String(input)}`);
  });
});
