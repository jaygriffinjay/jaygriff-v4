// goatboat: 170522b6-3c45-434b-af48-9cc71d8fc51a
import { ChildPages } from "@/components/site/child-pages";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";

export default function TestsPage() {
  return (
    <PageLayout hideRelated>
      <PageHeader />
      <ChildPages />
    </PageLayout>
  );
}
