import { ChildPages } from "@/components/site/child-pages";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";

export default function TestsPage() {
  return (
    <PageLayout>
      <PageHeader />
      <ChildPages />
    </PageLayout>
  );
}
