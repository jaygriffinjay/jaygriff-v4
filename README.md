# jaygriff.com

The source for my website, **[jaygriff.com](https://jaygriff.com)**, version 4.

The site is read-only: its pages come from goatboat, my content database and API, and the site renders them.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 and shadcn/ui.

The old versions are still up: [v0](https://v0.jaygriff.com), [v1](https://v1.jaygriff.com), [v2](https://v2.jaygriff.com) and [v3](https://v3.jaygriff.com).

## Running it

It needs a goatboat to read from: set `GOATBOAT_URL` and `GOATBOAT_READ_TOKEN`.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev    # Start the development server
npm run build  # Build for production
npm run lint   # Run ESLint
npm test       # Run the tests
```
