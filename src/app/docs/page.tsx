// goatboat: b455ec91-16d1-41f1-a222-a7097ea66c25
import { DocsTable, type DocsRow } from "@/components/site/docs-table";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { allDocsPages, listAllDocs } from "@/lib/docs";

/** Every docs page and test across projects, as one table to search, filter and sort. */
export default async function DocsPage() {
  const rows: DocsRow[] = allDocsPages(await listAllDocs()).map((page) => ({
    path: page.path,
    title: page.title,
    description: page.description,
    code: page.source === "approute",
    project: page.project.title,
    section: page.section.title,
    publishedAt: page.publishedAt ?? "",
    updatedAt: page.updatedAt ?? "",
  }));

  return (
    <PageLayout hideRelated hideToc>
      <PageHeader />
      <DocsTable rows={rows} />
    </PageLayout>
  );
}
