import { PageHeader } from "@/components/site/page-header";
import { LibraryClient } from "./library-client";

export default function LibraryPage() {
  return <LibraryClient header={<PageHeader />} />;
}
