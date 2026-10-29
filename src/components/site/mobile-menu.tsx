"use client";

import { createContext, useContext, useEffect, useRef, useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { Dialog } from "@base-ui/react/dialog";
import { MenuIcon, XIcon } from "lucide-react";
import { useActiveHeading } from "@/hooks/use-active-heading";
import type { TocEntry } from "@/lib/goatboat";
import { cn } from "@/lib/utils";
import { TocList } from "./table-of-contents";
import styles from "./mobile-menu.module.css";

type PageToc = { title: string; titleId: string; entries: TocEntry[] };

// The menu lives in the header (root layout), but the headings belong to each page, so pages report them here
const MenuContext = createContext<{
  toc: PageToc | null;
  setToc: (toc: PageToc | null) => void;
}>({
  toc: null,
  setToc: () => {},
});

export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const [toc, setToc] = useState<PageToc | null>(null);
  return <MenuContext.Provider value={{ toc, setToc }}>{children}</MenuContext.Provider>;
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

/** Phone-only hamburger that opens a full-screen overlay with the page's headings and the footer. */
export function MobileMenu({
  footer,
  className,
}: {
  footer?: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const { toc } = useContext(MenuContext);
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

  // Following any link inside the menu lands on a new page, so close it then
  useEffect(() => setOpen(false), [pathname]);

  // Past Tailwind's sm breakpoint the hamburger is hidden, so the overlay can't stay open
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 40rem)");
    const closeIfWide = () => wide.matches && setOpen(false);
    wide.addEventListener("change", closeIfWide);
    return () => wide.removeEventListener("change", closeIfWide);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} onOpenChangeComplete={scrollToPending}>
      <Dialog.Trigger className={cn(styles.trigger, className)} aria-label="Open menu">
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

          {toc && (
            <section>
              <p className={styles.tocHeading}>On this page</p>
              <TocList title={toc.title} titleId={toc.titleId} entries={toc.entries} activeId={activeId} goTo={goTo} />
            </section>
          )}

          {footer && <div className={styles.footer}>{footer}</div>}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
