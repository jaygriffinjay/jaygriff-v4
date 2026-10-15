import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { LibraryClient } from "./library-client";

export default function LibraryPage() {
  return (
    <PageLayout>
      <LibraryClient header={<PageHeader />} />
    </PageLayout>
  );
}
