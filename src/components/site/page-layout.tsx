import { cn } from "@/lib/utils";
import { requireVisible } from "@/lib/page-meta";
import { Breadcrumbs, getCrumbs } from "./breadcrumbs";
import { ReportCrumbs } from "./mobile-menu";
import { SiteNav } from "./nav";
import { PrevNext } from "./prev-next";
import { RelatedPages } from "./related-pages";
import styles from "./page-layout.module.css";

interface PageLayoutProps {
  children: React.ReactNode;
  /** Page-specific side column; right of the content on desktop, below it on mobile. */
  aside?: React.ReactNode;
  /** For pages with no place in the tree (the 404): no breadcrumbs, related pages or prev/next. */
  outsideTree?: boolean;
  /** Section index pages list their children instead, so they turn related pages off. */
  hideRelated?: boolean;
  className?: string;
}

export async function PageLayout({ children, aside, outsideTree, hideRelated, className }: PageLayoutProps) {
  // The 404 page renders at the requested path, so it must not check that path again
  if (!outsideTree) await requireVisible();
  const crumbs = outsideTree ? [] : await getCrumbs();

  return (
    <div className={cn(styles.columns, aside && styles.columnsWithAside, className)}>
      <div className={styles.panel}>
        <ReportCrumbs crumbs={crumbs} />
        <div className={styles.desktopNav}>
          <SiteNav />
          {!outsideTree && <Breadcrumbs />}
        </div>
        <main className={styles.main}>
          {children}
          {!outsideTree && !hideRelated && <RelatedPages />}
          {!outsideTree && <PrevNext />}
        </main>
      </div>
      {aside && <div className={styles.aside}>{aside}</div>}
    </div>
  );
}
