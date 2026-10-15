import { Paragraph } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";

export default function ActionCheckPage() {
  return (
    <PageLayout>
      <PageHeader />
      <Paragraph>
        This page exists to check that pushing a new route makes the GitHub Action register it in goatboat.
      </Paragraph>
    </PageLayout>
  );
}
