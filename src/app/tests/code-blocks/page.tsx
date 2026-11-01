// goatboat: 3d27e657-5cce-4fd2-a85b-6cddd5e268dc
import { H2 } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { CodeBlock } from "@/components/code-block/CodeBlock";
import { longLineSample, sampleProject, sampleSnippet } from "./sample-files";

export default function CodeBlocksPage() {
  return (
    <PageLayout>
      <PageHeader />

      <H2>Single snippet</H2>
      <CodeBlock code={sampleSnippet.content} language="typescript" />

      <H2>Single file with a path</H2>
      <CodeBlock files={[sampleSnippet]} />

      <H2>Multiple files (tabs on mobile, explorer on desktop)</H2>
      <CodeBlock files={sampleProject} />

      <H2>Long line (try wrap)</H2>
      <CodeBlock files={[longLineSample]} />
    </PageLayout>
  );
}
