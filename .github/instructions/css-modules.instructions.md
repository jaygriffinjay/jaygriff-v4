---
description: "Use when writing or editing CSS module files. Covers Tailwind @apply conventions, @reference setup, and commenting standards."
applyTo: "**/*.module.css"
---

# CSS Module Convention

## Rules

1. **Start with `@reference`** to resolve Tailwind utilities:
   ```css
   @reference "../../app/globals.css";
   ```
   Adjust the relative path to point to `src/app/globals.css` from the module's location.

2. **Use `@apply` for all Tailwind classes** inside semantic class names.

3. **Every class gets a comment** explaining what element or role it styles.

4. **One CSS module per `.tsx` file, named after it.** `header.tsx` → `header.module.css`, `Container.tsx` → `Container.module.css`. Never import another file's module.
   - **Same-file helpers share the file's module.** A small, unexported component that exists only to break up the main component's JSX (e.g. a `Row` used inside a `Table`) uses the module of the file it lives in.
   - **If a helper gets exported or reused elsewhere, move it to its own file with its own module.**
   - **Shared styles across components:** extract a component or put the value in the theme (`globals.css`), never share a module.

5. **One CSS module per route file.** `page.tsx` → `page.module.css`, `layout.tsx` → `layout.module.css`, `not-found.tsx` → `not-found.module.css`, all co-located in the same route folder. Pages never share a module, even if their styles currently match.

## Example

```css
@reference "../../app/globals.css";

/* sticky bar across the top of the page */
.header {
  @apply border-border/40 bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md;
}

/* nav link with active state highlight */
.navButton {
  @apply text-base;
}
```
