import { CapsLabel } from "@/components/typography";
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
      <h2 className={styles.heading}>
        <CapsLabel>{title}</CapsLabel>
      </h2>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
