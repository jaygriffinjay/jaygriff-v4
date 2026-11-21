import { afterEach, describe, expect, it, vi } from "vitest";

async function loadSiteUrl() {
  vi.resetModules();
  vi.doMock("@/lib/goatboat", () => ({ getContentByPath: vi.fn() }));
  return (await import("@/lib/page-meta")).siteUrl;
}

afterEach(() => vi.doUnmock("@/lib/goatboat"));

describe("site url", () => {
  // Checks: production always uses the real domain, even if Vercel reports its own address.
  // Expected: "https://jaygriff.com".
  it("is jaygriff.com in production", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "jaygriff-v4.vercel.app");
    expect(await loadSiteUrl()).toBe("https://jaygriff.com");
  });

  // Checks: a preview links to the project's production address Vercel reports.
  // Expected: "https://jaygriff-v4.vercel.app".
  it("uses Vercel's address on a preview", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "jaygriff-v4.vercel.app");
    expect(await loadSiteUrl()).toBe("https://jaygriff-v4.vercel.app");
  });

  // Checks: with no Vercel variables, links point at the dev server.
  // Expected: "http://localhost:3000".
  it("is the dev server locally", async () => {
    expect(await loadSiteUrl()).toBe("http://localhost:3000");
  });
});

describe("robots.txt", () => {
  async function loadRobots() {
    vi.resetModules();
    vi.stubEnv("VERCEL_ENV", "production");
    vi.doMock("@/lib/goatboat", () => ({ getContentByPath: vi.fn() }));
    return (await import("@/app/robots")).default();
  }

  // Checks: every crawler is allowed everywhere.
  // Expected: one rule, for "*", allowing "/".
  it("allows everything", async () => {
    expect((await loadRobots()).rules).toEqual({ userAgent: "*", allow: "/" });
  });

  // Checks: it points crawlers at the sitemap on the real domain.
  // Expected: "https://jaygriff.com/sitemap.xml".
  it("points at the sitemap", async () => {
    expect((await loadRobots()).sitemap).toBe("https://jaygriff.com/sitemap.xml");
  });
});

describe("page titles", () => {
  // Checks: a title made from a path's last segment.
  // Expected: "/projects/my-cool-page" gives "My cool page".
  it("turns a slug into a title", async () => {
    vi.resetModules();
    vi.doMock("@/lib/goatboat", () => ({ getContentByPath: vi.fn() }));
    const { titleFromPath } = await import("@/lib/page-meta");
    expect(titleFromPath("/projects/my-cool-page")).toBe("My cool page");
  });
});
