You are an AI assistant helping build a modern full-stack web application. Follow these rules strictly.

## Stack

- **Framework**: Next.js 16 (App Router, Server Components by default)
- **Styling**: Tailwind CSS v4 (`@theme inline` config in globals.css)
- **Components**: shadcn/ui (Base UI, Rhea style) + custom typography components
- **Theming**: One theme, defined in `:root` in globals.css. The site is dark-toned (navy + blue), but there are no light/dark modes and no theme switcher.
- **Colors**: oklch color space, single palette of CSS variables in `:root`
- **Utilities**: `cn()` from `@/lib/utils` (clsx + tailwind-merge)

## Golden Rules

1. **Never invent — assemble.** Use existing components from `@/components/typography` and `@/components/ui/`. Inspect their exports and source files before creating anything new.
2. **No inline styling in JSX.** No `style={{}}` and no Tailwind class strings in `className`; styles live in a co-located CSS module (see `.github/instructions/`). Exception: shadcn files in `src/components/ui/` keep their Tailwind classes inline.
3. **Use `cn()` for all dynamic class logic.** Never concatenate class strings manually.
4. **All components accept `className`.** Callers override defaults by passing a class from their own CSS module.
5. **Server Components by default.** Only add `"use client"` when the component needs browser APIs, state, or event handlers.
6. **Use the typography system for text.** Use `<H1>`, `<Paragraph>`, `<Bold>`, etc. from `@/components/typography` instead of raw text tags.
7. **Links use `next/link` directly**, styled with a CSS module class. For a standard inline text link, `@apply link;` (utility in globals.css).
8. **Fonts are CSS variables, not Tailwind classes.** Set them in the CSS module with `font-family: var(--font-name);`. See `src/app/fonts.ts` for the available variables. Code (`pre`, `code`, `kbd`) already uses the mono font via `--font-mono`.
9. **Use theme colors.** Use semantic tokens (`text-foreground`, `bg-background`, `text-muted-foreground`, `bg-muted`, `text-primary`, `bg-primary`, `text-destructive`, etc.). There's only one theme, so never write mode-specific styles (`dark:` variants or light-mode overrides).
10. **Shadcn components use direct imports.** No barrel file — import from the specific path: `import { Button } from "@/components/ui/button"`.
11. **Restyle shadcn components in their own file.** To change how a shadcn component looks site-wide, edit its Tailwind classes directly in `src/components/ui/<name>.tsx`. Don't add global CSS overrides that target `[data-slot=...]`, and don't wrap it just to restyle. (Re-adding a component with `npx shadcn add --overwrite` will discard these edits.) Focusable components use `focus-visible:focus-ring` (utility in `src/styles/focus.css`) instead of shadcn's default halo.

## File Structure

```
src/
  app/              # Pages and layouts (App Router)
    fonts.ts        # Font definitions; source of truth for --font-* variables
    globals.css     # Tailwind config, theme variables, base styles
    layout.tsx      # Root layout (TooltipProvider, fonts, site shell)
  components/
    typography.tsx  # All text components (H1–H6, Paragraph, InlineCode, …) in one file
    typography.module.css  # The whole type scale, commented, in one place
    ui/             # shadcn components (direct imports, no barrel)
  lib/
    utils.ts        # cn() utility
```

## Workflow

- Don't run `tsc`, `next build`, or lint after routine edits. The dev server and editor already surface errors, and the user checks UI changes in the browser. Only run them when asked, before a commit or deploy, or after a large multi-file refactor where breakage is likely.

## Git

- Never add a `Co-authored-by` trailer (or any Copilot attribution) to commit messages.
