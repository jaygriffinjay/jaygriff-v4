// goatboat: 02696b8c-41d6-44d6-a541-46f03549b5f3
import { Fragment } from "react";
import {
  Blockquote,
  Bold,
  CapsLabel,
  H2,
  H3,
  H4,
  H5,
  H6,
  Highlight,
  InlineCode,
  Italic,
  Lead,
  List,
  ListItem,
  Muted,
  Paragraph,
  Small,
  Strikethrough,
  Underline,
} from "@/components/typography";
import { CodeBlock } from "@/components/code-block/CodeBlock";
import type { CodeFile } from "@/components/code-block/types";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { QuestionList } from "@/components/site/question-list";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const fence = "```";

// Prefixes every line with "> ", so quotes can be nested by calling it again
const quote = (text: string) =>
  text
    .trim()
    .split("\n")
    .map((line) => (line ? `> ${line}` : ">"))
    .join("\n");

const deepest = `Level 3 paragraph with \`inline code\`.\n\n${fence}sh\necho "three quotes deep"\n${fence}`;
const middle = `Level 2 paragraph.\n\n${quote(deepest)}\n\nBack at level 2.`;
const outer = `Level 1 paragraph.\n\n${quote(middle)}\n\nBack at level 1.`;

const markdown = {
  quoteTypography: quote(`
### A heading inside a quote
Paragraph with **bold**, *italic*, ~~strike~~, \`inline code\`, and a [link](/about).

#### A smaller heading
A second paragraph straight after it.

- a list
- inside the quote
  - nested one level

1. an ordered list
2. also inside

---

###### The smallest heading
Last line of the quote.
`),

  quoteCode: quote(`
Before the code.

${fence}ts
const message = "a code block inside a blockquote";
console.log(message);
${fence}

After the code.

${fence}
a block with no language
${fence}
`),

  quoteDeep: quote(outer),

  quoteTable: quote(`
| Column A | Column B | Column C |
| --- | :---: | ---: |
| plain | \`code\` | **bold** |
| a longer cell that has to wrap onto another line inside the quote | 2 | 3 |
`),

  lists: `
1. First step
   - a nested bullet with \`code\`
   - another nested bullet
     1. a deep ordered item
     2. its sibling
        - the deepest bullet, with a [link](/about)

2. A loose item that has paragraphs.

   A second paragraph in the same item.

   ${fence}sh
   npm run dev
   ${fence}

   > A quote inside a list item.
   >
   > ${fence}ts
   > const nested = "code in a quote in a list";
   > ${fence}

3. A last item with a table:

   | a | b |
   | --- | --- |
   | 1 | 2 |
`,

  headings: `
## Heading, then code
${fence}ts
const afterHeading = true;
${fence}

### Heading, then a quote
> straight after a heading

#### Heading, then a table
| a | b |
| --- | --- |
| 1 | 2 |

##### Heading, then a list
- one
- two

###### Heading, then another heading
###### And another straight after
`,

  tasks: `
- [x] a finished item
- [ ] an open item
- [ ] an item with \`code\` and a [link](/about)
  - [x] a nested finished item
  - [ ] a nested open item

1. [x] an ordered task
2. [ ] another one
`,

  footnotes: `
This sentence has a footnote[^1] and another one[^second], in the middle of a paragraph.

[^1]: The first footnote.
[^second]: The second, with \`inline code\` and a [link](/about).
`,

  inline: `
Everything at once: **bold _italic ~~struck \`code\`~~_ inside**, then [a link with **bold** and \`code\` in it](/about), then ***both***.

[\`code inside a link\`](/about) and \`[a link inside code](/about)\` are different things.

A very long unbreakable string: ${"supercalifragilistic".repeat(8)} and a long inline code \`${"someVeryLongIdentifierName".repeat(6)}\` and a long URL https://example.com/${"a-very-long-path-segment/".repeat(6)}end.
`,

  links: `
## A heading with a [link](/about) and \`code\`

### [\`code in a link in a heading\`](/about)

A paragraph whose link wraps across more than one line, which is where hover blocks and rings tend to break: [this deliberately long link text should wrap onto a second line on most screens and keep its highlight on every line](/about).
`,

  images: `
A paragraph, then an image:

![A Paint drawing](/images/paint3.png)

> A quote with an image:
>
> ![A Paint drawing in a quote](/images/paint3.png)

- A list item with an image:

  ![A Paint drawing in a list](/images/paint3.png)

[![A linked portrait](/images/me2.jpg)](/about)
`,

  rules: `
A paragraph before a rule.

---

A paragraph after it.

- a list
- then a rule

---

> A quote
>
> ---
>
> with a rule inside it
`,

  codeBlocks: `
Two blocks back to back:

${fence}ts
const first = 1;
${fence}

${fence}ts
const second = 2;
${fence}

A block with no language, an empty one, and a one-line one:

${fence}
no language here
${fence}

${fence}ts
${fence}

${fence}json
{ "single": "line" }
${fence}

One very long line:

${fence}ts
const long = "${"x".repeat(220)}";
${fence}

Many lines:

${fence}ts
${Array.from({ length: 60 }, (_, i) => `const line${i + 1} = ${i + 1}; // line ${i + 1}`).join("\n")}
${fence}

Other languages:

${fence}css
.card { border: 1px solid var(--border); }
${fence}

${fence}diff
- const old = 1;
+ const next = 2;
${fence}

${fence}tsx
export const X = () => <div className="x">hi</div>;
${fence}
`,
};

const multiFile: CodeFile[] = [
  { path: "src/app/page.tsx", content: `export default function Page() {\n  return <h1>Hello</h1>;\n}` },
  { path: "src/app/layout.tsx", content: `export default function Layout({ children }) {\n  return <html><body>{children}</body></html>;\n}` },
  { path: "src/lib/utils.ts", content: `export const cn = (...parts: string[]) => parts.filter(Boolean).join(" ");` },
];

const cases: { title: string; check: string; content: React.ReactNode }[] = [
  {
    title: "Typography inside a blockquote",
    check: "Headings, lists and a rule inside a quote: spacing between blocks, the quote's italics reaching things that shouldn't be italic, the left rule's height.",
    content: <MarkdownRenderer source={markdown.quoteTypography} />,
  },
  {
    title: "Code blocks inside a blockquote",
    check: "A code block in a quote: its width against the quote's padding, whether the text goes italic, the gap before and after it.",
    content: <MarkdownRenderer source={markdown.quoteCode} />,
  },
  {
    title: "Blockquotes three deep",
    check: "Rules stacking up on the left, indent adding up, a code block at the bottom, the paragraph that follows each level.",
    content: <MarkdownRenderer source={markdown.quoteDeep} />,
  },
  {
    title: "A table inside a blockquote",
    check: "Does the table scroll or overflow the quote, and does it inherit the quote's italics?",
    content: <MarkdownRenderer source={markdown.quoteTable} />,
  },
  {
    title: "Nested and loose lists",
    check: "Four levels of nesting, paragraphs in a list item, a code block, a quote and a table inside items: indents, markers and gaps.",
    content: <MarkdownRenderer source={markdown.lists} />,
  },
  {
    title: "Headings followed by blocks",
    check: "The gap under each heading when a code block, quote, table, list or another heading comes straight after it.",
    content: <MarkdownRenderer source={markdown.headings} />,
  },
  {
    title: "Task lists",
    check: "The renderer doesn't map checkbox inputs, so see what a task list actually looks like: stray checkboxes, bullets next to them, alignment.",
    content: <MarkdownRenderer source={markdown.tasks} />,
  },
  {
    title: "Footnotes",
    check: "The renderer doesn't style the footnote section or its back-links, so see whether they appear and how they look.",
    content: <MarkdownRenderer source={markdown.footnotes} />,
  },
  {
    title: "Inline formatting, stacked",
    check: "Bold, italic, strike, code and links nested in each other, then long unbreakable strings: wrapping, overflow and chip backgrounds across line breaks.",
    content: <MarkdownRenderer source={markdown.inline} />,
  },
  {
    title: "Links in headings, code in links",
    check: "Link hover blocks on headings and across wrapped lines, and the difference between code inside a link and a link inside code.",
    content: <MarkdownRenderer source={markdown.links} />,
  },
  {
    title: "Images in other blocks",
    check: "A pixelated drawing in a quote, a list item and a link: does it stay inside its container and keep its aspect ratio?",
    content: <MarkdownRenderer source={markdown.images} />,
  },
  {
    title: "Horizontal rules",
    check: "A rule between paragraphs, after a list, and inside a quote: spacing above and below.",
    content: <MarkdownRenderer source={markdown.rules} />,
  },
  {
    title: "Code blocks, awkwardly",
    check: "Back-to-back blocks, none, an empty one, a very long line, 60 lines, and a few languages: gaps, scrolling, heights.",
    content: <MarkdownRenderer source={markdown.codeBlocks} />,
  },
  {
    title: "Every text component in one quote",
    check: "The typography components that markdown can't produce, together inside a blockquote: Lead, Muted, CapsLabel, Small, Highlight, Underline.",
    content: (
      <Blockquote>
        <H3>An H3 in a quote</H3>
        <Lead>A lead paragraph, muted and body size.</Lead>
        <Paragraph>
          A paragraph with <Bold>bold</Bold>, <Italic>italic</Italic>, <Underline>underline</Underline>,{" "}
          <Strikethrough>strike</Strikethrough>, <Highlight>a highlight</Highlight> and <InlineCode>code</InlineCode>.
        </Paragraph>
        <Muted>A muted line, small.</Muted>
        <CapsLabel>A caps label</CapsLabel>
        <Small>Small fine print at the end.</Small>
        <H4>H4</H4>
        <H5>H5</H5>
        <H6>H6</H6>
      </Blockquote>
    ),
  },
  {
    title: "A multi-file code block inside a quote and a list",
    check: "Tabs, the file explorer and the scroll areas inside narrower containers: do the tabs overflow, does the explorer still fit?",
    content: (
      <Fragment>
        <Blockquote>
          <Paragraph>A multi-file code block inside a quote:</Paragraph>
          <CodeBlock files={multiFile} />
        </Blockquote>
        <List>
          <ListItem>
            A multi-file code block inside a list item:
            <CodeBlock files={multiFile} />
          </ListItem>
        </List>
      </Fragment>
    ),
  },
  {
    title: "An accordion and a table inside a quote",
    check: "Interactive and table components in a quote: the accordion's chevrons and hover blocks, and the table's scroll against the quote's edge.",
    content: (
      <Blockquote>
        <QuestionList
          items={[
            { question: "A question inside a quote?", answer: <>An answer with <InlineCode>code</InlineCode> and more text.</> },
            { question: "A second one, long enough that it may wrap onto another line on a narrow screen?", answer: <>Short.</> },
          ]}
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Component</TableHead>
              <TableHead>Inside</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Table</TableCell>
              <TableCell>Blockquote</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Blockquote>
    ),
  },
  {
    title: "Wrapping inline backgrounds",
    check: "Highlight, underline and inline code that wrap across lines, which is where box decorations and padding usually break. Narrow the window.",
    content: (
      <Paragraph>
        <Highlight>
          a highlighted run of words long enough that it will have to wrap onto several lines on a phone and show how
          the background behaves at each break
        </Highlight>{" "}
        then <Underline>an underlined run that is also long enough to wrap across more than one line of text</Underline>{" "}
        then{" "}
        <InlineCode>an inline code run with spaces that is long enough to wrap across more than one line as well</InlineCode>.
      </Paragraph>
    ),
  },
];

/** Components nested inside each other, to hunt for spacing, overflow and inheritance bugs. */
export default function UiStressPage() {
  return (
    <PageLayout>
      <PageHeader intro="Components combined and nested at their awkward edges, to hunt for visual bugs. Narrow the window too: most of them show up on a phone." />
      <Paragraph>
        Most cases are real markdown through the same renderer as notes and posts, so they show what a page would. The
        rest are components that markdown can't produce. Each has a line on what to look for.
      </Paragraph>

      {cases.map(({ title, check, content }) => (
        <Fragment key={title}>
          <H2>{title}</H2>
          <Muted>{check}</Muted>
          {content}
        </Fragment>
      ))}
    </PageLayout>
  );
}
