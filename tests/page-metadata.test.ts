import { describe, expect, it, vi } from "vitest";
import type { Asset, ContentItem } from "@/lib/goatboat";

// The smallest row the metadata code reads; each test overrides what it's about
function row(fields: Partial<ContentItem> = {}): ContentItem {
  return {
    id: "c1",
    parentId: null,
    slug: "my-page",
    path: "/notes/my-page",
    type: "page",
    status: "published",
    title: "My page",
    description: "About my page",
    intro: null,
    body: null,
    toc: null,
    format: "md",
    componentKey: null,
    contentHash: null,
    authors: null,
    authorship: "human",
    authorshipNote: null,
    tags: null,
    projectId: null,
    publishedAt: null,
    revisedAt: null,
    sortOrder: 0,
    source: "db",
    file: null,
    missingSince: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    link: null,
    project: null,
    section: null,
    assets: [],
    ...fields,
  };
}

function asset(role: Asset["role"], url: string): Asset {
  return { id: 1, projectId: null, contentId: "c1", url, kind: "image", role, alt: null, width: null, height: null, sortOrder: 0, createdAt: "" };
}

// Loads page-meta in production, rendering `path`, with goatboat answering `item` (or nothing) for it
async function metadataFor(path: string, item: ContentItem | null) {
  vi.resetModules();
  vi.stubEnv("VERCEL_ENV", "production");
  vi.doMock("next/headers", () => ({ headers: async () => new Headers({ "x-pathname": path }) }));
  vi.doMock("@/lib/goatboat", () => ({
    getContentByPath: vi.fn(async () => (item ? { item, breadcrumbs: [], children: [] } : null)),
  }));
  return (await import("@/lib/page-meta")).currentPageMetadata();
}

async function loadIsVisible() {
  vi.resetModules();
  vi.doMock("@/lib/goatboat", () => ({ getContentByPath: vi.fn() }));
  return (await import("@/lib/page-meta")).isVisible;
}

describe("page metadata", () => {
  // Checks: a published page can be indexed.
  // Expected: no robots setting, so search engines use their default (index, follow).
  it("lets search engines index a published page", async () => {
    expect((await metadataFor("/notes/my-page", row())).robots).toBeUndefined();
  });

  // Checks: a draft that's rendered (only possible in local dev) is kept out of search results.
  // Expected: { index: false, follow: false }.
  it("keeps a draft out of search results", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const meta = await metadataFor("/notes/my-page", row({ status: "draft" }));
    expect(meta.robots).toEqual({ index: false, follow: false });
  });

  // Checks: the canonical URL is the page's own path, on the real domain.
  // Expected: canonical "/notes/my-page", resolved against https://jaygriff.com.
  it("gives each page its own canonical URL", async () => {
    const meta = await metadataFor("/notes/my-page", row());
    expect(new URL(String(meta.alternates?.canonical), meta.metadataBase!).href).toBe("https://jaygriff.com/notes/my-page");
  });

  // Checks: the title is the row's title followed by the site name.
  // Expected: "My page · Jay Griffin".
  it("titles a page from its row", async () => {
    expect((await metadataFor("/notes/my-page", row())).title).toBe("My page · Jay Griffin");
  });

  // Checks: a path with no row gets a title made from the path.
  // Expected: "/my-stack" gives "My stack · Jay Griffin".
  it("titles a code page with no row from its path", async () => {
    expect((await metadataFor("/my-stack", null)).title).toBe("My stack · Jay Griffin");
  });

  // Checks: an artifact's sharing image is its screenshot, since its hero is an html file.
  // Expected: the thumbnail's URL, not the hero's.
  it("shares an artifact's thumbnail", async () => {
    const item = row({
      type: "artifact",
      assets: [asset("hero", "https://assets.test/game.html"), asset("thumbnail", "https://assets.test/game.jpg")],
    });
    const meta = await metadataFor("/artifacts/game", item);
    expect(meta.openGraph?.images).toEqual([expect.objectContaining({ url: "https://assets.test/game.jpg" })]);
  });

  // Checks: any other page shares its hero image over its thumbnail.
  // Expected: the hero's URL.
  it("shares a page's hero image", async () => {
    const item = row({ assets: [asset("thumbnail", "https://assets.test/small.jpg"), asset("hero", "https://assets.test/big.jpg")] });
    const meta = await metadataFor("/notes/my-page", item);
    expect(meta.openGraph?.images).toEqual([expect.objectContaining({ url: "https://assets.test/big.jpg" })]);
  });
});

describe("page visibility", () => {
  // Checks: a published page shows everywhere.
  // Expected: true.
  it("shows a published page", async () => {
    expect((await loadIsVisible())({ status: "published" })).toBe(true);
  });

  // Checks: a draft never shows outside local dev (production and tests alike).
  // Expected: false.
  it("hides a draft in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    expect((await loadIsVisible())({ status: "draft" })).toBe(false);
  });

  // Checks: a private page never shows outside local dev.
  // Expected: false.
  it("hides a private page in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    expect((await loadIsVisible())({ status: "private" })).toBe(false);
  });

  // Checks: drafts show in local dev, so they can be previewed.
  // Expected: true.
  it("shows a draft in local dev", async () => {
    vi.stubEnv("NODE_ENV", "development");
    expect((await loadIsVisible())({ status: "draft" })).toBe(true);
  });
});
