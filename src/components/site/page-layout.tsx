import { cn } from "@/lib/utils";
import { getCurrentNotes } from "@/lib/notes";
import { getCurrentPage, requireVisible } from "@/lib/page-meta";
import { PageBody } from "@/components/layout/PageBody";
import { Breadcrumbs } from "./breadcrumbs";
import { NotesBar } from "./notes-bar";
import { NotesAside } from "./notes-aside";
import { SiteNav } from "./nav";
import { PageToc, PageTocButton } from "./page-toc";
import { PrevNext } from "./prev-next";
import { RelatedPages } from "./related-pages";
import type { TocEntry } from "@/lib/goatboat";
import styles from "./page-layout.module.css";

interface PageLayoutProps {
  children: React.ReactNode;
  /** Full-bleed page background rendered behind the content panel. */
  background?: React.ReactNode;
  /** Page-specific side column: a sticky right rail on desktop. */
  aside?: React.ReactNode;
  /** Keep the page-specific aside in document flow instead of pinning it during scroll. */
  stickyAside?: boolean;
  /** Hide the shared site navigation row on pages with their own primary controls. */
  hideNav?: boolean;
  /** Where the aside goes when the page is one column: above the article (a table of contents) or below it. */
  asideOnMobile?: "top" | "bottom";
  /** For pages with no place in the tree (the 404): no breadcrumbs, related pages or prev/next. */
  outsideTree?: boolean;
  /** Section index pages list their children instead, so they turn related pages off. */
  hideRelated?: boolean;
  /** Pages whose headings aren't worth navigating (a short bio) turn the automatic table of contents off. */
  hideToc?: boolean;
  /** Instead of a side column, just the "On this page" button under the nav, at every width, listing these entries. */
  tocButton?: { title: string; entries: TocEntry[] };
  className?: string;
}

// A page without its own aside gets a table of contents from the headings goatboat holds for it
const MIN_AUTO_TOC = 2;

export async function PageLayout({
  children,
  background,
  aside: ownAside,
  stickyAside = true,
  hideNav = false,
  asideOnMobile: ownAsideOnMobile = "bottom",
  outsideTree,
  hideRelated,
  hideToc,
  tocButton,
  className,
}: PageLayoutProps) {
  // The 404 page renders at the requested path, so it must not check that path again
  if (!outsideTree) await requireVisible();
  const item = outsideTree || ownAside || hideToc || tocButton ? null : (await getCurrentPage())?.item;
  const autoToc = item?.toc && item.toc.length >= MIN_AUTO_TOC ? item : null;
  const aside = ownAside ?? (autoToc && <PageToc title={autoToc.title} entries={autoToc.toc!} />);
  const asideOnMobile = ownAside ? ownAsideOnMobile : "top";
  const asideBlock = aside && <div className={styles.aside} data-sticky={stickyAside ? undefined : "false"}>{aside}</div>;
  const notes = outsideTree ? null : await getCurrentNotes();

  return (
    <div
      className={cn(
        styles.columns,
        aside && styles.columnsWithAside,
        aside && notes && styles.columnsWithNotes,
        notes && styles.columnsWithNotesAside,
        className,
      )}
    >
      {/* the shell's CSS looks for data-notes-aside to widen the frame for it */}
      {notes && (
        <div className={styles.notesAside} data-notes-aside>
          <NotesAside nav={notes.nav} />
        </div>
      )}
      <div className={cn(styles.panel, aside && styles.panelWithAside)}>
        {!hideNav && (
          <div className={styles.navRow}>
            <SiteNav />
            {!outsideTree && <Breadcrumbs />}
          </div>
        )}
        {(notes || tocButton) && (
          <div className={cn(styles.notes, !tocButton && styles.notesOnlyButton)}>
            {notes && (
              <div className={styles.notesButton}>
                <NotesBar nav={notes.nav} />
              </div>
            )}
            {tocButton && <PageTocButton title={tocButton.title} entries={tocButton.entries} />}
          </div>
        )}
        {asideOnMobile === "top" && asideBlock}
        <main className={styles.main}>
          <PageBody>{children}</PageBody>
          {!outsideTree && !hideRelated && <RelatedPages />}
          {!outsideTree && <PrevNext />}
        </main>
        {asideOnMobile === "bottom" && asideBlock}
      </div>
        {background && <div className={styles.background}>{background}</div>}
    </div>
  );
}
