// goatboat: 0322d4be-659c-4b3f-b219-b8d2e754134f
import { Lead } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { ProjectEntry } from "@/components/site/project-entry";
import { listNotes, listProjects } from "@/lib/goatboat";
import { isVisible } from "@/lib/page-meta";
import styles from "./page.module.css";

/** My projects, in the order set in goatboat. Drafts show only in local dev. */
export default async function ProjectsPage() {
  const [all, notes] = await Promise.all([listProjects(), listNotes()]);
  const projects = all.filter(isVisible);
  // Counted from the notes themselves, so a note counts whether or not it sits in a section
  const noteCounts = new Map<string, number>();
  for (const note of notes) {
    if (note.project) noteCounts.set(note.project.slug, (noteCounts.get(note.project.slug) ?? 0) + 1);
  }

  return (
    <PageLayout hideRelated>
      <PageHeader />
      {projects.length ? (
        <ul className={styles.list}>
          {projects.map((project) => (
            <ProjectEntry key={project.id} project={project} notes={noteCounts.get(project.slug) ?? 0} />
          ))}
        </ul>
      ) : (
        <Lead className={styles.empty}>Nothing here yet.</Lead>
      )}
    </PageLayout>
  );
}
