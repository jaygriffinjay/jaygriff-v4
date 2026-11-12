// goatboat: 3d27e657-5cce-4fd2-a85b-6cddd5e268dc
import { H2, Muted } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { PageTabs } from "@/components/site/page-tabs";
import { CodeBlock } from "@/components/code-block/CodeBlock";
import { longLineSample, sampleProject, sampleSnippet } from "./sample-files";

const command = "npm run dev:local";
const shortSnippet = `const goat = "captain";\nconsole.log(goat);`;

// A line of code exactly `width` characters long, so a block's width is easy to read off
const lineOf = (width: number) => {
  const start = `const w${width} = "`;
  return start + "x".repeat(Math.max(0, width - start.length - 2)) + `";`;
};
const widths = [20, 40, 60, 80, 100, 140, 200];
const linesOf = (count: number) =>
  Array.from({ length: count }, (_, i) => `const line${i + 1} = ${i + 1};`).join("\n");
const heights = [1, 3, 10, 30];
const shortThenLong = `npm install\n${lineOf(120)}\nnpm run build`;

const basics = (
  <>
    <H2>Single snippet</H2>
    <CodeBlock code={sampleSnippet.content} language="typescript" />

    <H2>Single file with a path</H2>
    <CodeBlock files={[sampleSnippet]} />

    <H2>Multiple files (tabs on mobile, explorer on desktop)</H2>
    <CodeBlock files={sampleProject} />

    <H2>Long line (try wrap)</H2>
    <CodeBlock files={[longLineSample]} />
  </>
);

const variants = (
  <>
    <H2>No header</H2>
    <Muted>No language bar. Copy (and wrap, when a line overflows) float in the top-right corner on hover.</Muted>
    <CodeBlock code={sampleSnippet.content} language="typescript" header={false} />

    <H2>No line numbers</H2>
    <Muted>The header stays; the gutter goes and the code gets ordinary left padding.</Muted>
    <CodeBlock code={sampleSnippet.content} language="typescript" lineNumbers={false} />

    <H2>No header, no line numbers</H2>
    <Muted>Just the code on its dark background.</Muted>
    <CodeBlock code={sampleSnippet.content} language="typescript" header={false} lineNumbers={false} />

    <H2>Fit to content</H2>
    <Muted>As wide as the longest line instead of the whole column, with the header and numbers.</Muted>
    <CodeBlock code={shortSnippet} language="typescript" fit />

    <H2>Fit, bare: a one-line command</H2>
    <Muted>Fit with no header and no numbers, the way a terminal command would sit in a note.</Muted>
    <CodeBlock code={command} language="bash" fit header={false} lineNumbers={false} />

    <H2>Fit, bare: a few short lines</H2>
    <CodeBlock code={shortSnippet} language="typescript" fit header={false} lineNumbers={false} />

    <H2>Fit with a line too long for the column</H2>
    <Muted>Should grow to the column's width and then scroll (or wrap) like any other block.</Muted>
    <CodeBlock files={[longLineSample]} fit />

    <H2>Fit, bare, long line</H2>
    <CodeBlock files={[longLineSample]} fit header={false} lineNumbers={false} />
  </>
);

const sizes = (
  <>
    <Muted>
      Blocks of set widths and lengths, to watch while resizing the window: where each fitted block stops growing,
      when the wrap button appears, and how the buttons sit over a scrolling line.
    </Muted>

    <H2>Widths, fitted, with header</H2>
    {widths.map((width) => (
      <CodeBlock key={width} code={lineOf(width)} language="typescript" fit />
    ))}

    <H2>Widths, fitted, bare</H2>
    {widths.map((width) => (
      <CodeBlock key={width} code={lineOf(width)} language="typescript" fit header={false} lineNumbers={false} />
    ))}

    <H2>Widths, full column</H2>
    {widths.map((width) => (
      <CodeBlock key={width} code={lineOf(width)} language="typescript" />
    ))}

    <H2>Lengths, fitted, bare</H2>
    {heights.map((count) => (
      <CodeBlock key={count} code={linesOf(count)} language="typescript" fit header={false} lineNumbers={false} />
    ))}

    <H2>Lengths, full column</H2>
    {heights.map((count) => (
      <CodeBlock key={count} code={linesOf(count)} language="typescript" />
    ))}

    <H2>Short first line, long middle line</H2>
    <Muted>The floating buttons sit over the first line, which here is short; the long line below it scrolls.</Muted>
    <CodeBlock code={shortThenLong} language="bash" fit header={false} lineNumbers={false} />
    <CodeBlock code={shortThenLong} language="bash" header={false} />
  </>
);

export default function CodeBlocksPage() {
  return (
    <PageLayout>
      <PageHeader />
      <PageTabs
        tabs={[
          { id: "basics", label: "Basics", children: basics },
          { id: "variants", label: "Variants", children: variants },
          { id: "sizes", label: "Sizes", children: sizes },
        ]}
      />
    </PageLayout>
  );
}
