// goatboat: c951b0bd-e6e5-4f52-a4aa-9f53d30024b0
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
