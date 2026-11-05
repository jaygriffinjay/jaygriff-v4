---
description: "Use when writing or editing TSX components, pages, or layouts under src/. Covers styling conventions for JSX files."
applyTo: "src/**/*.tsx"
---

# TSX Styling Convention

Applies to **components, pages, and layouts under `src/`** — anything that defines UI.

**No inline Tailwind class strings in JSX.** All Tailwind classes live in a co-located `.module.css` file and are referenced via `styles.className`.

**Exception:** `src/components/ui/` (shadcn; restyle by editing its inline classes) keeps Tailwind classes inline.

## Rules

1. **Import the CSS module** named after the file: `import styles from "./header.module.css";` in `header.tsx`, `import styles from "./page.module.css";` in `page.tsx`.
2. **Use `className={styles.foo}`** on elements — never `className="bg-red-500 p-4"`.
3. **Use `cn()` to merge external `className` props:** `cn(styles.foo, className)` so callers can override. A caller's class must not set a property the component already sets (see "Never fight another component's styles" in `css-modules.instructions.md`); the exception is typography and `Container`, whose styles sit in a CSS layer so a caller's class always wins.
4. **Create the CSS module if it doesn't exist.** One per `.tsx` file (components and route files like `page.tsx`, `layout.tsx`, `not-found.tsx`), named after that file. Never import another file's module.
5. **Same-file helpers share the file's module.** Small unexported components defined in the same file use that file's `styles`. Once a helper is exported or reused, give it its own file and module.

## Example

```tsx
// header.tsx
import styles from "./header.module.css";
import { cn } from "@/lib/utils";

export function SiteHeader({ className }: { className?: string }) {
  return <header className={cn(styles.header, className)}>...</header>;
}
```
