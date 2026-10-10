import { cn } from "@/lib/utils";
import { SiteNav } from "./nav";
import styles from "./page-layout.module.css";

interface PageLayoutProps {
  children: React.ReactNode;
  /** Page-specific side column; right of the content on desktop, below it on mobile. */
  aside?: React.ReactNode;
  className?: string;
}

export function PageLayout({ children, aside, className }: PageLayoutProps) {
  return (
    <div className={cn(styles.columns, aside && styles.columnsWithAside, className)}>
      <div className={styles.panel}>
        <SiteNav />
        <main className={styles.main}>{children}</main>
      </div>
      {aside}
    </div>
  );
}
