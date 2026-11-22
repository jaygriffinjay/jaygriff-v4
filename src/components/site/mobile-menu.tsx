"use client";

import { createContext, useContext, useEffect, useRef, useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { Dialog } from "@base-ui/react/dialog";
import { MenuIcon, XIcon } from "lucide-react";
import { useActiveHeading } from "@/hooks/use-active-heading";
import { useResetFeedCounts } from "@/hooks/use-reset-feed-counts";
import { CapsLabel } from "@/components/typography";
import type { TocEntry } from "@/lib/goatboat";
import { cn } from "@/lib/utils";
import { BreadcrumbTrail, type Crumb } from "./breadcrumb-trail";
import { SiteNav } from "./nav";
import { TocList } from "./table-of-contents";
import styles from "./mobile-menu.module.css";

type PageToc = { title: string; titleId: string; entries: TocEntry[] };

// The menu lives in the header (root layout), but the headings and breadcrumbs belong to each page, so pages report them here
const MenuContext = createContext<{
  toc: PageToc | null;
  setToc: (toc: PageToc | null) => void;
  crumbs: Crumb[] | null;
  setCrumbs: (crumbs: Crumb[] | null) => void;
}>({
  toc: null,
  setToc: () => {},
  crumbs: null,
  setCrumbs: () => {},
});

export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  useResetFeedCounts();
  const [toc, setToc] = useState<PageToc | null>(null);
  const [crumbs, setCrumbs] = useState<Crumb[] | null>(null);
  return <MenuContext.Provider value={{ toc, setToc, crumbs, setCrumbs }}>{children}</MenuContext.Provider>;
}

/** Rendered with a page's breadcrumbs so the header's menu shows the same trail. */
export function ReportCrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const { setCrumbs } = useContext(MenuContext);
  useEffect(() => {
    setCrumbs(crumbs);
    return () => setCrumbs(null);
  }, [crumbs, setCrumbs]);
  return null;
}

/** Rendered with a page's table of contents so the header's menu lists the same title and headings. */
export function ReportToc({ title, titleId, entries }: PageToc) {
  const { setToc } = useContext(MenuContext);
  useEffect(() => {
    setToc({ title, titleId, entries });
    return () => setToc(null);
  }, [title, titleId, entries, setToc]);
  return null;
}

/** Hamburger that opens a full-screen overlay with the page's headings and the footer. Phone-only unless `always`, for a header with no nav links of its own. */
export function MobileMenu({
  footer,
  className,
  always,
}: {
  footer?: React.ReactNode;
  className?: string;
  always?: boolean;
}) {
  const pathname = usePathname();
  return <MobileMenuContent key={pathname} footer={footer} className={className} always={always} />;
}

function MobileMenuContent({
  footer,
  className,
  always,
}: {
  footer?: React.ReactNode;
  className?: string;
  always?: boolean;
}) {
  const { toc, crumbs } = useContext(MenuContext);
  // Tracked here, where it keeps running while the menu is closed, so the list is already right when it opens
  const [activeId] = useActiveHeading(
    toc?.titleId ?? "",
    toc?.entries.map((entry) => entry.id) ?? [],
  );
  const [open, setOpen] = useState(false);
  // A heading picked in the menu is scrolled to once the overlay has finished closing and released the page
  const pendingId = useRef<string | null>(null);
  const pendingTop = useRef(false);

  const scrollToPending = (isOpen: boolean) => {
    const id = pendingId.current;
    if (isOpen || !id) return;
    pendingId.current = null;
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${id}`);
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    if (pendingTop.current) window.scrollTo({ top: 0, behavior });
    else document.getElementById(id)?.scrollIntoView({ behavior });
  };

  // Picking a heading closes the menu first; the page scrolls once it has closed
  const goTo = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    pendingId.current = id;
    pendingTop.current = id === toc?.titleId;
    setOpen(false);
  };

  // Past the wide breakpoint (56rem, set in globals.css) the hamburger is hidden, so the overlay can't stay open
  useEffect(() => {
    if (always) return;
    const wide = window.matchMedia("(min-width: 56rem)");
    const closeIfWide = () => wide.matches && setOpen(false);
    wide.addEventListener("change", closeIfWide);
    return () => wide.removeEventListener("change", closeIfWide);
  }, [always]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} onOpenChangeComplete={scrollToPending}>
      <Dialog.Trigger className={cn(styles.trigger, !always && styles.phoneOnly, className)} aria-label="Open menu">
        <MenuIcon aria-hidden="true" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Popup className={styles.overlay}>
          <div className={styles.top}>
            <Dialog.Title className={styles.srOnly}>Menu</Dialog.Title>
            <NextLink href="/" className={styles.name} onClick={() => setOpen(false)}>
              Jay Griffin
            </NextLink>
            <Dialog.Close className={styles.close} aria-label="Close menu">
              <XIcon aria-hidden="true" />
            </Dialog.Close>
          </div>

          <div>
            <SiteNav />
            {crumbs && <BreadcrumbTrail crumbs={crumbs} />}
          </div>

          {toc && (
            <section className={styles.toc}>
              <h2 className={styles.tocHeading}>
                <CapsLabel>On this page</CapsLabel>
              </h2>
              <TocList title={toc.title} titleId={toc.titleId} entries={toc.entries} activeId={activeId} goTo={goTo} />
            </section>
          )}

          {footer && <div className={styles.footer}>{footer}</div>}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
