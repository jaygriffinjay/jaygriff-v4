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

2. **Use `@apply` for plain Tailwind utilities; write regular CSS when you need more control.** Mix freely in one rule. In plain CSS, prefer theme variables (`var(--color-primary)`, `var(--text-sm)`) over hard-coded values.

3. **Every class gets a comment** explaining what element or role it styles.

4. **One CSS module per `.tsx` file, named after it.** `header.tsx` → `header.module.css`, `Container.tsx` → `Container.module.css`. Never import another file's module.
   - **Same-file helpers share the file's module.** A small, unexported component that exists only to break up the main component's JSX (e.g. a `Row` used inside a `Table`) uses the module of the file it lives in.
   - **If a helper gets exported or reused elsewhere, move it to its own file with its own module.**
   - **Shared styles across components:** extract a component or put the value in the theme (`globals.css`), never share a module.

5. **One CSS module per route file.** `page.tsx` → `page.module.css`, `layout.tsx` → `layout.module.css`, `not-found.tsx` → `not-found.module.css`, all co-located in the same route folder. Pages never share a module, even if their styles currently match.

## Never fight another component's styles

Two single-class rules setting the same property on one element tie, and whichever CSS chunk loads last wins. That order changes between page loads, so the page flickers between the two. Don't fix it with `:where()`, nesting or `!important`; don't set the property twice.

- **Typography is the exception: modules override it.** `typography.module.css` sits in `@layer components`, and unlayered CSS beats any layer, so a class passed to a typography component (`Title`, `H2`, `Paragraph`, …) always wins, whatever the load order. For a one-off look (a blue heading on one page, a different font on one title), set it in the page's own module. Only add to `typography.tsx` when a style is reused across the site.
- **Keep shared components' own modules out of layers** unless they're meant to be overridden the same way; two unlayered modules still tie.
- **`PageBody` owns the vertical margin between a page's blocks.** A block directly inside it never sets its own `mt-*`/`mb-*`/`my-*`. For extra room, use padding (`pt-8`), which adds to the flow margin instead of replacing it.

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
