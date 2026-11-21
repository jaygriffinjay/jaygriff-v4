import { describe, expect, it, vi } from "vitest";

import { getContentByPath, listContent } from "@/lib/goatboat";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

// Stubs fetch with one response and returns the mock, to look at what was asked for
function respondWith(response: Response) {
  const mock = vi.fn(async () => response);
  vi.stubGlobal("fetch", mock);
  return mock;
}

describe("goatboat client", () => {
  // Checks: a request goes to goatboat's API with the read token.
  // Expected: the URL is http://goatboat.test/api/content?type=post and authorization is "Bearer test-read-token".
  it("sends the read token", async () => {
    const mock = respondWith(json({ data: [] }));
    await listContent({ type: "post" });
    const [url, init] = mock.mock.calls[0] as unknown as [URL, RequestInit];
    expect(url.href).toBe("http://goatboat.test/api/content?type=post");
    expect(init.headers).toEqual({ authorization: "Bearer test-read-token" });
  });

  // Checks: a query field left undefined isn't sent.
  // Expected: the query string is only "?type=post".
  it("leaves out undefined fields", async () => {
    const mock = respondWith(json({ data: [] }));
    await listContent({ type: "post", tag: undefined });
    const [url] = mock.mock.calls[0] as unknown as [URL];
    expect(url.search).toBe("?type=post");
  });

  // Checks: a list that goatboat doesn't have comes back empty, not as an error.
  // Expected: [] for a 404.
  it("returns an empty list on a 404", async () => {
    respondWith(json({}, 404));
    expect(await listContent()).toEqual([]);
  });

  // Checks: a page that doesn't exist comes back as null.
  // Expected: null for a 404.
  it("returns null for a missing page", async () => {
    respondWith(json({}, 404));
    expect(await getContentByPath("/nope")).toBeNull();
  });

  // Checks: a page that moved comes back as its redirect, not as a page.
  // Expected: { redirectTo: "/new-home" }.
  it("returns a redirect as it is", async () => {
    respondWith(json({ redirectTo: "/new-home" }));
    expect(await getContentByPath("/old-home")).toEqual({ redirectTo: "/new-home" });
  });

  // Checks: a server error is thrown with goatboat's own message.
  // Expected: rejects with "goatboat /api/content: boom".
  it("throws goatboat's error message", async () => {
    respondWith(json({ error: { message: "boom" } }, 500));
    await expect(listContent()).rejects.toThrow("goatboat /api/content: boom");
  });

  // Checks: a goatboat that can't be reached is reported with its address.
  // Expected: rejects with "Can't reach goatboat at http://goatboat.test".
  it("says where it couldn't connect", async () => {
    vi.stubGlobal("fetch", async () => {
      throw new TypeError("fetch failed");
    });
    await expect(listContent()).rejects.toThrow("Can't reach goatboat at http://goatboat.test");
  });

  // Checks: a missing read token is caught before any request is made.
  // Expected: rejects with "GOATBOAT_READ_TOKEN is not set".
  it("needs the read token", async () => {
    vi.stubEnv("GOATBOAT_READ_TOKEN", "");
    await expect(listContent()).rejects.toThrow("GOATBOAT_READ_TOKEN is not set");
  });
});
