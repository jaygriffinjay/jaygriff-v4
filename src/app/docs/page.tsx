// goatboat: b455ec91-16d1-41f1-a222-a7097ea66c25
import { ChildPages } from "@/components/site/child-pages";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";

export default function DocsPage() {
  return (
    <PageLayout hideRelated>
      <PageHeader />
      <ChildPages />
    </PageLayout>
  );
}
