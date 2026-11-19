// goatboat: b455ec91-16d1-41f1-a222-a7097ea66c25
import { NotesTable, type NotesRow } from "@/components/site/notes-table";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { listNotes } from "@/lib/goatboat";

/** Every note as one table to search, filter and sort. Any page under a notes path counts, with or without a project or section. */
export default async function NotesPage() {
  const rows: NotesRow[] = (await listNotes()).map((note) => ({
    path: note.path,
    title: note.title,
    description: note.description,
    tags: (note.tags ?? []).join(" "),
    code: note.source === "approute",
    project: note.project?.title ?? "",
    projectSlug: note.project?.slug ?? "",
    section: note.section?.title ?? "",
    publishedAt: note.publishedAt ?? "",
    updatedAt: note.updatedAt,
  }));

  return (
    <PageLayout hideRelated hideToc>
      <PageHeader />
      <NotesTable rows={rows} />
    </PageLayout>
  );
}
