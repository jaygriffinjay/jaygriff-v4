import NextLink from "next/link";
import { getCurrentPage } from "@/lib/page-meta";
import { cn } from "@/lib/utils";
import styles from "./prev-next.module.css";

/** Links to the current page's previous and next siblings in goatboat. */
export async function PrevNext({ className }: { className?: string }) {
  const page = await getCurrentPage();
  const prev = page?.prev;
  const next = page?.next;
  if (!prev && !next) return null;

  return (
    <nav aria-label="Previous and next" className={cn(styles.nav, className)}>
      {prev && (
        <NextLink href={prev.path} className={cn(styles.item, styles.prev)}>
          <span className={styles.label}>← Previous</span>
          <span className={styles.title}>{prev.title}</span>
        </NextLink>
      )}
      {next && (
        <NextLink href={next.path} className={cn(styles.item, styles.next)}>
          <span className={styles.label}>Next →</span>
          <span className={styles.title}>{next.title}</span>
        </NextLink>
      )}
    </nav>
  );
}
