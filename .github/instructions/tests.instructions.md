---
description: "Use when writing or editing tests. Covers the test setup and the conventions for how tests are written and commented."
applyTo: "**/*.test.ts"
---

# Tests

Vitest, in `tests/`, run with `npm test`. `tests/setup.ts` runs before each file: it sets test-only goatboat settings and makes any real network request fail, so tests never reach goatboat. A test that needs a response stubs `fetch` itself, or mocks `@/lib/goatboat`.

## Rules

1. **One test checks one thing.** One behaviour, usually one `expect`. Prefer several small tests over one test with many assertions.
2. **Keep tests readable.** Plain data and direct assertions. Describe fixtures with a short comment (a tree sketch works well).
3. **Every test has a comment above it** with two lines: `// Checks:` what it tests, and `// Expected:` the outcome with concrete values.
4. **Modules that read the environment at import** (like `siteUrl`) are loaded fresh in the test: `vi.resetModules()`, set the variable with `vi.stubEnv`, then `await import(...)`. Stubs are undone after each test.
