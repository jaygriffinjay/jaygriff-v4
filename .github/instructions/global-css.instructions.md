---
description: "Use when writing or editing any CSS in the project. Covers conventions shared by all CSS (comments, reuse, how @apply and utilities behave) and the rules for the global files: globals.css (theme tokens, base styles) and src/styles/ (shared utilities)."
applyTo: "**/*.css"
---

# CSS Convention

For CSS modules, `css-modules.instructions.md` adds module-specific rules on top of these.

## All CSS

1. **Every rule gets a comment** explaining its role. For a custom property in `:root`, say what it's for and where it's used.
2. **Check what exists first.** Reuse an existing token (`src/app/globals.css`) or shared utility (`src/styles/`) before adding a new one.
3. **`@apply` inlines a utility into the rule that applies it.** The result is ordinary unlayered CSS, so a module's own rules override it by normal specificity. That's why a page module can adjust `link` without a fight. Rules nested inside a utility (`&:hover`, `& code`) are copied in too.

## The global files only (`src/app/globals.css`, `src/styles/**`)

4. **Theme colours go in two places.** Define the value in `:root` as `--name`, then map it in the `@theme inline` block as `--color-name: var(--name)`. Without the mapping, utilities like `text-name` and `bg-name` don't exist.
5. **One shared utility per file in `src/styles/`**, declared with `@utility` and imported from `globals.css` (`link.css`, `focus.css`, `scrollbar.css`). Put a comment at the top saying how to use it and what it promises, so the file explains itself.
6. **No page- or component-specific styling in these files.** If only one place uses it, it goes in that place's module. Add to the global files only when two or more places need the same thing.
