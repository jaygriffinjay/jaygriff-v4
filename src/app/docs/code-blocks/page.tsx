import { H1, H2, Paragraph } from "@/components/typography";
import { PageLayout } from "@/components/site/page-layout";
import { CodeBlock } from "@/components/code-block/CodeBlock";
import { longLineSample, sampleProject, sampleSnippet } from "./sample-files";
import styles from "./page.module.css";

export default function CodeBlocksPage() {
  return (
    <PageLayout>
      <H1 className={styles.title}>Code blocks</H1>
      <Paragraph className={styles.intro}>
        Shiki with the VS Code Dark+ theme, highlighted on the server. Copy always copies the raw
        file contents.
      </Paragraph>

      <H2 className={styles.heading}>Single snippet</H2>
      <CodeBlock code={sampleSnippet.content} language="typescript" />

      <H2 className={styles.heading}>Single file with a path</H2>
      <CodeBlock files={[sampleSnippet]} />

      <H2 className={styles.heading}>Multiple files (tabs on mobile, explorer on desktop)</H2>
      <CodeBlock files={sampleProject} />

      <H2 className={styles.heading}>Long line (try wrap)</H2>
      <CodeBlock files={[longLineSample]} />
    </PageLayout>
  );
}
