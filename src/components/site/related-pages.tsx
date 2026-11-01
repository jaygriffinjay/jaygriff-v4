import NextLink from "next/link";
import { CapsLabel, Muted } from "@/components/typography";
import { getCurrentPage } from "@/lib/page-meta";
import { cn } from "@/lib/utils";
import styles from "./related-pages.module.css";

/** Pages that share tags, a project or a parent with the current page, from goatboat. */
export async function RelatedPages({ className }: { className?: string }) {
  const page = await getCurrentPage();
  const related = page?.related ?? [];
  if (!related.length) return null;

  return (
    <section aria-labelledby="related-heading" className={cn(styles.section, className)}>
      <h2 id="related-heading" className={styles.heading}>
        <CapsLabel>Related</CapsLabel>
      </h2>
      <ul className={styles.list}>
        {related.map((item) => (
          <li key={item.path}>
            <NextLink href={item.path} className={styles.link}>
              {item.title}
            </NextLink>
            {item.description && <Muted className={styles.description}>{item.description}</Muted>}
          </li>
        ))}
      </ul>
    </section>
  );
}
