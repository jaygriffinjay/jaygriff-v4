import { cn } from "@/lib/utils";
import { getCurrentDocs } from "@/lib/docs";
import { getCurrentPage, requireVisible } from "@/lib/page-meta";
import { PageBody } from "@/components/layout/PageBody";
import { Breadcrumbs } from "./breadcrumbs";
import { DocsBar } from "./docs-bar";
import { SiteNav } from "./nav";
import { PageToc } from "./page-toc";
import { PrevNext } from "./prev-next";
import { RelatedPages } from "./related-pages";
import styles from "./page-layout.module.css";

interface PageLayoutProps {
  children: React.ReactNode;
  /** Page-specific side column: a sticky right rail on desktop. */
  aside?: React.ReactNode;
  /** Where the aside goes when the page is one column: above the article (a table of contents) or below it. */
  asideOnMobile?: "top" | "bottom";
  /** For pages with no place in the tree (the 404): no breadcrumbs, related pages or prev/next. */
  outsideTree?: boolean;
  /** Section index pages list their children instead, so they turn related pages off. */
  hideRelated?: boolean;
  /** Pages whose headings aren't worth navigating (a short bio) turn the automatic table of contents off. */
  hideToc?: boolean;
  className?: string;
}

// A page without its own aside gets a table of contents from the headings goatboat holds for it
const MIN_AUTO_TOC = 2;

export async function PageLayout({
  children,
  aside: ownAside,
  asideOnMobile: ownAsideOnMobile = "bottom",
  outsideTree,
  hideRelated,
  hideToc,
  className,
}: PageLayoutProps) {
  // The 404 page renders at the requested path, so it must not check that path again
  if (!outsideTree) await requireVisible();
  const item = outsideTree || ownAside || hideToc ? null : (await getCurrentPage())?.item;
  const autoToc = item?.toc && item.toc.length >= MIN_AUTO_TOC ? item : null;
  const aside = ownAside ?? (autoToc && <PageToc title={autoToc.title} entries={autoToc.toc!} />);
  const asideOnMobile = ownAside ? ownAsideOnMobile : "top";
  const asideBlock = aside && <div className={styles.aside}>{aside}</div>;
  const docs = outsideTree ? null : await getCurrentDocs();

  return (
    <div className={cn(styles.columns, aside && styles.columnsWithAside, className)}>
      <div className={cn(styles.panel, aside && styles.panelWithAside)}>
        <div className={styles.navRow}>
          <SiteNav />
          {!outsideTree && <Breadcrumbs />}
          {docs && <DocsBar nav={docs.nav} sectionSlug={docs.item.section?.slug ?? null} />}
        </div>
        {asideOnMobile === "top" && asideBlock}
        <main className={styles.main}>
          <PageBody>{children}</PageBody>
          {!outsideTree && !hideRelated && <RelatedPages />}
          {!outsideTree && <PrevNext />}
        </main>
        {asideOnMobile === "bottom" && asideBlock}
      </div>
    </div>
  );
}
