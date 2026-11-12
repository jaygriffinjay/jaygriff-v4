// goatboat: bad8685d-7bed-4dd9-ad26-9ab1ffdc5e6d
import { Fragment } from "react";
import { InlineCode, Paragraph, H2 } from "@/components/typography";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";

const cases: { title: string; check: string; md: string }[] = [
  {
    title: "Simple",
    check: "The baseline: header weight, row rules, padding, and how it sits in the text column.",
    md: `
| Tool | Used for | Since |
| --- | --- | --- |
| Next.js | Every site and app | 2022 |
| Turso | Goatboat's database | 2025 |
| Vercel | Hosting | 2022 |
`,
  },
  {
    title: "Column alignment",
    check: "Left, centre and right alignment from the markdown colons. Numbers should line up on the right.",
    md: `
| Left | Centre | Right |
| :--- | :---: | ---: |
| apples | 3 | 1.50 |
| a much longer item name | 12 | 18.00 |
| kiwi | 100 | 1,250.75 |
`,
  },
  {
    title: "Many columns",
    check: "Wider than the column, so it must scroll sideways without bouncing, and without pushing the page wider.",
    md: `
| Id | Title | Status | Project | Section | Tags | Words | Created | Updated | Published | Source | Path |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | MVP slices | published | goatboat | roadmap | mvp, plan | 1,204 | 2026-10-01 | 2026-10-30 | 2026-10-02 | db | /projects/goatboat/notes/mvp |
| 2 | Blue tester | published | jaygriff-v4 | tests | color | 0 | 2026-09-12 | 2026-10-20 | 2026-09-12 | approute | /projects/jaygriff-v4/notes/blues |
| 3 | Dev sync | draft | goatboat | decisions | sync | 860 | 2026-10-11 | 2026-10-11 | — | db | /projects/goatboat/notes/dev-sync |
`,
  },
  {
    title: "Long unbreakable content",
    check: "URLs, paths and identifiers with no spaces. They should wrap or scroll, never overflow the page.",
    md: `
| Thing | Value |
| --- | --- |
| URL | https://goatboat-henna.vercel.app/api/notes/jaygriff-v4?include=description,intro,tags,toc,excerpt&status=published |
| Path | src/app/projects/jaygriff-v4/notes/components/library/library-client.module.css |
| Identifier | \`useJumpAfterCloseWithReducedMotionFallbackAndScrollRestoration\` |
| Hash | 3f2a9c4e8b7d6a5f1e0c9b8a7d6e5f4c3b2a1908f7e6d5c4b3a2918070605040 |
`,
  },
  {
    title: "Prose in cells",
    check: "Paragraph-length cells. Rows should top-align, lines should stay readable, and the first column shouldn't get crushed.",
    md: `
| Decision | Why |
| --- | --- |
| Migrations only | \`drizzle-kit push\` misreads SQLite check constraints and would rebuild every table, so every schema change goes through a generated migration that gets reviewed before it runs against the shared database. |
| Proposals for agent edits | Agents can read freely but every write lands as a proposal the owner approves, which keeps the live site safe while still letting an agent do the tedious parts like retitling or moving a batch of pages. |
| Read-only site | The site never touches the database; it reads through the API with one read token, so a bug on the site can't corrupt content. |
`,
  },
  {
    title: "Inline formatting",
    check: "Links, inline code, bold and italics inside cells: link hover blocks shouldn't get clipped, code chips shouldn't break the row height.",
    md: `
| Element | Example |
| --- | --- |
| Link | See the [MVP slices](/projects/goatboat/notes/mvp) and [my stack](/my-stack) |
| Code | Run \`npm run routes:stamp\` then \`npm run routes:sync\` |
| Emphasis | **Bold**, *italic*, and ***both*** in one cell |
| Mixed | **\`--hover\`** is [GitHub's emphasis blue](/projects/jaygriff-v4/notes/hover-borders), *not* \`--primary\` |
`,
  },
  {
    title: "Empty and ragged cells",
    check: "Blank cells and rows with fewer cells than the header. Row rules and height should stay even.",
    md: `
| A | B | C |
| --- | --- | --- |
| one |  | three |
|  |  |  |
| only one |
| x | y | z |
`,
  },
  {
    title: "One column",
    check: "A single-column table: does it stretch the full width, and does that look silly?",
    md: `
| Ideas |
| --- |
| Auto-assign sections to new code pages on sync |
| Hide \`format\` for code pages in the owner UI |
| Port license, thoughts and designs from v2 |
`,
  },
  {
    title: "Wide characters",
    check: "Emoji and CJK text, which are wider than Latin letters. Columns should still line up.",
    md: `
| Symbol | Name | Note |
| --- | --- | --- |
| 🐐 | Goat | The goat in goatboat |
| ⛵ | Sailboat | Goatboat's icon |
| 日本語 | Japanese | Three wide characters |
| ✅ / ❌ | Yes / no | Common in comparison tables |
`,
  },
  {
    title: "Many rows",
    check: "A long table: is it easy to follow a row across, or do the rows blur together?",
    md: `
| # | Page | Section | Words |
| ---: | --- | --- | ---: |
${Array.from({ length: 25 }, (_, i) => `| ${i + 1} | Example page ${i + 1} | ${["tests", "ideas", "roadmap", "decisions", "problems"][i % 5]} | ${(((i * 7919) % 2000) + 120).toLocaleString("en-US")} |`).join("\n")}
`,
  },
];

/** Markdown tables at their awkward edges, to catch layout bugs and ugly rendering. */
export default function TableStressPage() {
  return (
    <PageLayout>
      <PageHeader />
      <Paragraph>
        Every table here is real markdown run through the same renderer as notes and posts, so it's what a page
        would actually show. Each one says what to look for. Narrow the window too: most table bugs show up on a
        phone. Tables come from <InlineCode>components/ui/table.tsx</InlineCode>.
      </Paragraph>

      {cases.map(({ title, check, md }) => (
        <Fragment key={title}>
          <H2>{title}</H2>
          <Paragraph>{check}</Paragraph>
          <MarkdownRenderer source={md} />
        </Fragment>
      ))}
    </PageLayout>
  );
}
