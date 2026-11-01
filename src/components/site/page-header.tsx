import { H1, Paragraph } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { currentPath, getCurrentPage, titleFromPath } from "@/lib/page-meta";
import { cn } from "@/lib/utils";
import styles from "./page-header.module.css";

/** The current page's heading and intro, from its goatboat row. A page can pass `intro` for when the row has none, or turn the separator off. */
export async function PageHeader({
  className,
  intro: fallbackIntro,
  separator = true,
}: {
  className?: string;
  intro?: string;
  separator?: boolean;
}) {
  const page = await getCurrentPage();
  const title = page?.item.title ?? titleFromPath(await currentPath());
  const intro = page?.item.intro ?? page?.item.description ?? fallbackIntro;

  return (
    <header className={cn(styles.header, className)}>
      <H1 className={styles.title}>{title}</H1>
      {intro && <Paragraph className={styles.intro}>{intro}</Paragraph>}
      {separator && <Separator className={styles.separator} />}
    </header>
  );
}
