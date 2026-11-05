---
description: "Use when writing or editing code pages: the page.tsx files under src/app that goatboat tracks by an ID on their first line. Covers the ID line, stamping, headings in the contents list, and getting a new page into the notes."
applyTo: "src/app/**/page.tsx"
---

# Code Pages

Every `page.tsx` under `src/app` is a page goatboat knows about. goatboat identifies it by an ID on the file's **first line**, not by its path or contents, so a page can be moved or renamed without losing its identity.

## Rules

1. **Keep `// goatboat: <uuid>` as the first line,** above the imports. Never edit or delete it by hand on an existing page.
2. **A new page needs stamping.** Run `npm run routes:stamp` to add the ID. The pre-commit hook does this too, but run it yourself so the page works in dev.
3. **A copied page needs its ID line deleted first.** Two files with the same ID make the stamp refuse to run. Delete the first line of every copy, then stamp.
4. **Dynamic segments (`[slug]`) and private folders (`_folder`) aren't pages,** and route groups like `(site)` add nothing to the URL. None of them get an ID.
5. **Headings reach the contents list only as plain text.** The sync reads `H2` to `H6` whose children are plain JSX text. A heading built from data, a variable or a template string isn't listed, and a heading inside a closed tab can't be scrolled to.
6. **A page reaches goatboat when `main` is pushed.** A GitHub Action syncs everything under `src/app`. Until then it isn't in the database.
7. **A new page doesn't show in a project's notes until it has a project and a section.** After the sync, put it in one (for example Tests, or Components) and give it a description, by proposing the change through goatboat.
