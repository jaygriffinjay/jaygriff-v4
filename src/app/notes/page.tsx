// goatboat: b455ec91-16d1-41f1-a222-a7097ea66c25
import { NotesTable, type NotesRow } from "@/components/site/notes-table";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { allNotesPages, listAllNotes } from "@/lib/notes";

/** Every notes page and test across projects, as one table to search, filter and sort. */
export default async function NotesPage() {
  const rows: NotesRow[] = allNotesPages(await listAllNotes()).map((page) => ({
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
      <NotesTable rows={rows} />
    </PageLayout>
  );
}
