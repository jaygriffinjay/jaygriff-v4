import { notesSequence, getCurrentNotes } from "@/lib/notes";
import { getCurrentPage } from "@/lib/page-meta";
import { cn } from "@/lib/utils";
import { StepLink, StepLinks } from "./step-links";
import styles from "./prev-next.module.css";

/** Notes pages step through their project's notes in nav order; other pages through their goatboat siblings. */
async function neighbours() {
  const notes = await getCurrentNotes();
  if (notes) {
    const pages = notesSequence(notes.nav);
    const i = pages.findIndex((p) => p.path === notes.item.path);
    if (i >= 0) return { prev: pages[i - 1], next: pages[i + 1] };
  }
  const page = await getCurrentPage();
  return { prev: page?.prev, next: page?.next };
}

/** Links to the current page's previous and next pages. */
export async function PrevNext({ className }: { className?: string }) {
  const { prev, next } = await neighbours();
  if (!prev && !next) return null;

  return (
    <nav aria-label="Previous and next" className={cn(styles.nav, className)}>
      <StepLinks>
        {prev && <StepLink direction="prev" href={prev.path} label="← Previous" title={prev.title} />}
        {next && <StepLink direction="next" href={next.path} label="Next →" title={next.title} />}
      </StepLinks>
    </nav>
  );
}
