import { ChildPages } from "@/components/site/child-pages";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { pageMetadata } from "@/lib/page-meta";

const path = "/tests";

export const generateMetadata = () => pageMetadata(path);

export default function TestsPage() {
  return (
    <PageLayout>
      <PageHeader path={path} />
      <ChildPages path={path} />
    </PageLayout>
  );
}
