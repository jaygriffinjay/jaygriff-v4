import { H1, Paragraph } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { currentPath, getCurrentPage, titleFromPath } from "@/lib/page-meta";
import { cn } from "@/lib/utils";
import styles from "./page-header.module.css";

/** The current page's heading and intro, from its goatboat row. */
export async function PageHeader({ className }: { className?: string }) {
  const page = await getCurrentPage();
  const title = page?.item.title ?? titleFromPath(await currentPath());
  const intro = page?.item.intro ?? page?.item.description;

  return (
    <header className={cn(styles.header, className)}>
      <H1 className={styles.title}>{title}</H1>
      {intro && <Paragraph className={styles.intro}>{intro}</Paragraph>}
      <Separator className={styles.separator} />
    </header>
  );
}
