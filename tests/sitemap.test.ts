import { afterEach, describe, expect, it, vi } from "vitest";

import type { TreeNode } from "@/lib/goatboat";

// The tree goatboat serves: published pages, a draft, a private page, and test pages
//   /about  /posts  /posts/hello  /drafty (draft)  /secret (private)  /tests  /tests/spacing
const node = (path: string, status: TreeNode["status"] = "published"): TreeNode => ({
  id: path,
  parentId: null,
  path,
  type: "page",
  status,
  title: path,
});

const TREE = [
  node("/about"),
  node("/posts"),
  node("/posts/hello"),
  node("/drafty", "draft"),
  node("/secret", "private"),
  node("/tests"),
  node("/tests/spacing"),
];

async function sitemapFor(tree: TreeNode[] | Error) {
  vi.resetModules();
  vi.stubEnv("VERCEL_ENV", "production");
  vi.doMock("@/lib/goatboat", () => ({
    listTree: async () => {
      if (tree instanceof Error) throw tree;
      return tree;
    },
    getContentByPath: vi.fn(),
  }));
  const { default: sitemap } = await import("@/app/sitemap");
  return (await sitemap()).map((entry) => entry.url);
}

afterEach(() => vi.doUnmock("@/lib/goatboat"));

describe("sitemap", () => {
  // Checks: the home page is listed, first, even though it has no row in the tree.
  // Expected: the first URL is "https://jaygriff.com".
  it("starts with the home page", async () => {
    expect((await sitemapFor(TREE))[0]).toBe("https://jaygriff.com");
  });

  // Checks: every published page is listed.
  // Expected: /about, /posts and /posts/hello are all in the list.
  it("lists published pages", async () => {
    expect(await sitemapFor(TREE)).toEqual(
      expect.arrayContaining([
        "https://jaygriff.com/about",
        "https://jaygriff.com/posts",
        "https://jaygriff.com/posts/hello",
      ]),
    );
  });

  // Checks: drafts and private pages are left out.
  // Expected: neither /drafty nor /secret is in the list.
  it("leaves out drafts and private pages", async () => {
    const urls = await sitemapFor(TREE);
    expect(urls).not.toContain("https://jaygriff.com/drafty");
    expect(urls).not.toContain("https://jaygriff.com/secret");
  });

  // Checks: the test pages are left out even though they're published.
  // Expected: no URL starts with https://jaygriff.com/tests.
  it("leaves out the test pages", async () => {
    const urls = await sitemapFor(TREE);
    expect(urls.filter((url) => url.startsWith("https://jaygriff.com/tests"))).toEqual([]);
  });

  // Checks: the home page isn't listed twice when the tree has a row for "/".
  // Expected: exactly one entry is "https://jaygriff.com".
  it("lists the home page once", async () => {
    const urls = await sitemapFor([node("/"), ...TREE]);
    expect(urls.filter((url) => url === "https://jaygriff.com")).toHaveLength(1);
  });

  // Checks: the sitemap doesn't list itself or robots.txt.
  // Expected: no URL ends in /sitemap.xml or /robots.txt.
  it("doesn't list itself", async () => {
    const urls = await sitemapFor(TREE);
    expect(urls.filter((url) => /\/(sitemap\.xml|robots\.txt)$/.test(url))).toEqual([]);
  });

  // Checks: when goatboat can't be reached the sitemap still builds, with just the home page.
  // Expected: ["https://jaygriff.com"].
  it("falls back to the home page if goatboat is down", async () => {
    expect(await sitemapFor(new Error("goatboat is down"))).toEqual(["https://jaygriff.com"]);
  });
});
