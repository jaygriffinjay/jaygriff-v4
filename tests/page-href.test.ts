import { describe, expect, it } from "vitest";
import { pageHref } from "@/lib/page-href";

describe("pagination links", () => {
  // Checks: page 1 links to the bare path, so it isn't a second URL for the same page.
  // Expected: "/new", not "/new?page=1".
  it("links page 1 to the bare path", () => {
    expect(pageHref("/new", 1)).toBe("/new");
  });

  // Checks: later pages carry their number in the query.
  // Expected: "/new?page=3".
  it("adds the page number after page 1", () => {
    expect(pageHref("/new", 3)).toBe("/new?page=3");
  });
});
