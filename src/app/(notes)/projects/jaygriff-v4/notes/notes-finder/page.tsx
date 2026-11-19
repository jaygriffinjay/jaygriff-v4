// goatboat: 8228fe88-c534-48c1-9b4b-afddf3eeadef
import { NotesFinder, type Note } from "@/components/site/notes-finder";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { Paragraph } from "@/components/typography";
import { listNotes } from "@/lib/goatboat";

/** A try at a better /notes: recent notes first, one menu for sorting and filtering, and the details of a note on hover. */
export default async function NotesFinderPage() {
  const notes: Note[] = (await listNotes()).map((note) => ({
    path: note.path,
    title: note.title,
    description: note.description,
    tags: note.tags ?? [],
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
      <Paragraph>
        The same notes as /notes, with live data. Search, and open the menu to sort or filter.
      </Paragraph>
      <NotesFinder notes={notes} />
    </PageLayout>
  );
}
