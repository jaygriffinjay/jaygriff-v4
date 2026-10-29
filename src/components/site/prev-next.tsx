import { getCurrentPage } from "@/lib/page-meta";
import { cn } from "@/lib/utils";
import { StepLink, StepLinks } from "./step-links";
import styles from "./prev-next.module.css";

/** Links to the current page's previous and next siblings in goatboat. */
export async function PrevNext({ className }: { className?: string }) {
  const page = await getCurrentPage();
  const prev = page?.prev;
  const next = page?.next;
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
