import NextLink from "next/link";
import { Paragraph } from "@/components/typography";
import { getPage, isVisible } from "@/lib/page-meta";
import { cn } from "@/lib/utils";
import styles from "./child-pages.module.css";

type ChildPagesProps = { path: string; className?: string };

/** Links to a page's children in goatboat, in sibling order. */
export async function ChildPages({ path, className }: ChildPagesProps) {
  const page = await getPage(path);
  const children = page?.children.filter(isVisible) ?? [];
  if (!children.length) return null;

  return (
    <ul className={cn(styles.list, className)}>
      {children.map((child) => (
        <li key={child.id}>
          <NextLink href={child.path} className={styles.link}>
            {child.title}
          </NextLink>
          {child.description && <Paragraph className={styles.description}>{child.description}</Paragraph>}
        </li>
      ))}
    </ul>
  );
}
