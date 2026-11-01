// goatboat: a0a72e77-6647-43f9-8f6e-9c960b7992e0
import { H2, Paragraph } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { CodeBlock } from "@/components/code-block/CodeBlock";
import {
  asciiTree,
  banners,
  blockCharts,
  boxDiagram,
  boxTable,
  commentDiagram,
  fileTree,
  gitGraph,
  sequenceDiagram,
  stateDiagram,
  wideCharTable,
  wideDiagram,
} from "./samples";

export default function AsciiArtPage() {
  return (
    <PageLayout>
      <PageHeader intro="Every drawing below should line up exactly: no gaps in the box lines, joints where the lines meet." />

      <H2>File tree, box-drawing characters</H2>
      <CodeBlock files={[fileTree]} />

      <H2>File tree, plain ASCII</H2>
      <CodeBlock files={[asciiTree]} />

      <H2>Architecture diagram</H2>
      <CodeBlock files={[boxDiagram]} />

      <H2>State diagram with diagonals</H2>
      <CodeBlock files={[stateDiagram]} />

      <H2>Sequence diagram</H2>
      <CodeBlock files={[sequenceDiagram]} />

      <H2>Double-line table</H2>
      <CodeBlock files={[boxTable]} />

      <H2>Git graph</H2>
      <CodeBlock files={[gitGraph]} />

      <H2>Block-letter banner and cowsay</H2>
      <CodeBlock files={[banners]} />

      <H2>Sparklines and bars</H2>
      <CodeBlock files={[blockCharts]} />

      <H2>Diagram in a highlighted comment</H2>
      <CodeBlock files={[commentDiagram]} />

      <H2>Wider than the block</H2>
      <CodeBlock files={[wideDiagram]} />

      <H2>CJK and emoji in a table</H2>
      <Paragraph>
        Lines up only if the font draws these characters at exactly two columns, which most don't. Expect this one to drift.
      </Paragraph>
      <CodeBlock files={[wideCharTable]} />
    </PageLayout>
  );
}
