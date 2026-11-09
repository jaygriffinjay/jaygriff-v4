import NextLink from "next/link";
import type { NotesNav } from "@/lib/goatboat";
import { NotesList } from "./notes-list";
import styles from "./notes-aside.module.css";

/** The project's notes as a left column beside the article, on full desktop. PageLayout places it; narrower screens use the notes button instead. */
export function NotesAside({ nav }: { nav: NotesNav }) {
  return (
    <aside className={styles.aside} aria-label="Project notes">
      <NextLink href={`/projects/${nav.project.slug}/notes`} className={styles.title}>
        {nav.project.title}
      </NextLink>
      <NotesList nav={nav} />
    </aside>
  );
}
