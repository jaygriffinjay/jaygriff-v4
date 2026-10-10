import { H2 } from "@/components/typography";
import { cn } from "@/lib/utils";
import styles from "./aside-section.module.css";

interface AsideSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

/** Titled section inside an `<Aside>`. */
export function AsideSection({ title, children, className }: AsideSectionProps) {
  return (
    <section className={cn(styles.section, className)}>
      <H2 className={styles.title}>{title}</H2>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
