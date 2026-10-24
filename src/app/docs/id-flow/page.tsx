// goatboat: 55a31e20-703c-498f-8ad7-403327bd7ad3
import { InlineCode, Paragraph } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";

export default function IdFlowPage() {
  return (
    <PageLayout>
      <PageHeader />
      <Paragraph>
        This page was created without a goatboat id. Committing it should stamp one on the first line of{" "}
        <InlineCode>page.tsx</InlineCode>, and the sync should create its row with that id.
      </Paragraph>
      <Paragraph>
        Move this folder afterwards: the row should follow it, and the old path should redirect here.
      </Paragraph>
    </PageLayout>
  );
}
