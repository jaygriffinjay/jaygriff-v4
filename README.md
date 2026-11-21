# Bootstrap Fullstack Webapp

An opinionated Next.js starter. Clone it, delete what you don't need, start building.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS v4** — configured in `globals.css`, no `tailwind.config.js`
- **shadcn/ui** (Base UI) — components live in `src/components/ui/`; add more with `npx shadcn add <component>`
- **Typography components** — `src/components/typography/` replaces raw `<h1>`, `<p>`, etc.
- **One theme** — a single dark-toned palette in `globals.css`; no light/dark modes
- **react-hook-form + zod**, **recharts**, **sonner**, **lucide-react**

## Project Structure

```
src/
  app/          # Layout, globals.css (theme tokens), fonts
  components/
    site/       # Site header, nav strip (edit routes.ts), page layout, aside pieces
    typography/ # Text components
    ui/         # shadcn components
.github/        # Copilot instructions and UI skill
```

## Scripts

```bash
npm run dev    # Start the development server
npm run build  # Build for production
npm run start  # Serve the production build
npm run lint   # Run ESLint
```
