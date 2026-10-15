import { H1, Paragraph } from "@/components/typography";
import { getPage, titleFromPath } from "@/lib/page-meta";
import { cn } from "@/lib/utils";
import styles from "./page-header.module.css";

type PageHeaderProps = { path: string; className?: string };

/** A code page's heading and intro, from its goatboat row. */
export async function PageHeader({ path, className }: PageHeaderProps) {
  const page = await getPage(path);
  const title = page?.item.title ?? titleFromPath(path);
  const description = page?.item.description;

  return (
    <header className={cn(styles.header, className)}>
      <H1 className={styles.title}>{title}</H1>
      {description && <Paragraph className={styles.intro}>{description}</Paragraph>}
    </header>
  );
}
