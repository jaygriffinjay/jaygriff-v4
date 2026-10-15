import { cn } from "@/lib/utils";
import { Breadcrumbs, getCrumbs } from "./breadcrumbs";
import { ReportCrumbs } from "./mobile-menu";
import { SiteNav } from "./nav";
import styles from "./page-layout.module.css";

interface PageLayoutProps {
  children: React.ReactNode;
  /** Page-specific side column; right of the content on desktop, below it on mobile. */
  aside?: React.ReactNode;
  /** Hide the breadcrumb trail, e.g. on pages with no place in the tree. */
  hideBreadcrumbs?: boolean;
  className?: string;
}

export async function PageLayout({ children, aside, hideBreadcrumbs, className }: PageLayoutProps) {
  const crumbs = hideBreadcrumbs ? [] : await getCrumbs();

  return (
    <div className={cn(styles.columns, aside && styles.columnsWithAside, className)}>
      <div className={styles.panel}>
        <ReportCrumbs crumbs={crumbs} />
        <div className={styles.desktopNav}>
          <SiteNav />
          {!hideBreadcrumbs && <Breadcrumbs />}
        </div>
        <main className={styles.main}>
          {children}
        </main>
      </div>
      {aside && <div className={styles.aside}>{aside}</div>}
    </div>
  );
}
