import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn", () => {
  // Checks: a later Tailwind class wins over a conflicting earlier one.
  // Expected: "p-4".
  it("keeps the later of two conflicting classes", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  // Checks: falsy values are dropped.
  // Expected: "a c".
  it("drops falsy values", () => {
    expect(cn("a", false, undefined, null, "c")).toBe("a c");
  });

  // Checks: an object adds the classes whose value is true.
  // Expected: "px-2 hidden".
  it("adds classes from an object", () => {
    expect(cn("px-2", { hidden: true, block: false })).toBe("px-2 hidden");
  });
});
