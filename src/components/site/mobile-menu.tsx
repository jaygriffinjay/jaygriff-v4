"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { Dialog } from "@base-ui/react/dialog";
import { MenuIcon, XIcon } from "lucide-react";
import { Paragraph } from "@/components/typography";
import { cn } from "@/lib/utils";
import type { Crumb } from "./breadcrumbs";
import { isActiveRoute, navRoutes } from "./routes";
import styles from "./mobile-menu.module.css";

// The menu lives in the header (root layout), but crumbs belong to each page, so pages report them here
const CrumbsContext = createContext<{ crumbs: Crumb[]; setCrumbs: (crumbs: Crumb[]) => void }>({
  crumbs: [],
  setCrumbs: () => {},
});

export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const [crumbs, setCrumbs] = useState<Crumb[]>([]);
  return <CrumbsContext.Provider value={{ crumbs, setCrumbs }}>{children}</CrumbsContext.Provider>;
}

/** Rendered by each page so the header's menu shows that page's trail. */
export function ReportCrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const { setCrumbs } = useContext(CrumbsContext);
  useEffect(() => setCrumbs(crumbs), [crumbs, setCrumbs]);
  return null;
}

/** Phone-only hamburger that opens a full-screen overlay with the nav, where you are, and the footer. */
export function MobileMenu({
  tagline,
  footer,
  className,
}: {
  tagline?: string;
  footer?: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const { crumbs } = useContext(CrumbsContext);
  const [open, setOpen] = useState(false);

  // Following any link inside the menu lands on a new page, so close it then
  useEffect(() => setOpen(false), [pathname]);

  // Past Tailwind's sm breakpoint the hamburger is hidden and the desktop nav shows, so the overlay can't stay open
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 40rem)");
    const closeIfWide = () => wide.matches && setOpen(false);
    wide.addEventListener("change", closeIfWide);
    return () => wide.removeEventListener("change", closeIfWide);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={cn(styles.trigger, className)} aria-label="Open menu">
        <MenuIcon aria-hidden="true" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Popup className={styles.overlay}>
          <div>
            <div className={styles.top}>
              <Dialog.Title className={styles.srOnly}>Menu</Dialog.Title>
              <NextLink href="/" className={styles.name} onClick={() => setOpen(false)}>
                Jay Griffin
              </NextLink>
              <Dialog.Close className={styles.close} aria-label="Close menu">
                <XIcon aria-hidden="true" />
              </Dialog.Close>
            </div>
            {tagline && <Paragraph className={styles.tagline}>{tagline}</Paragraph>}
          </div>

          <nav aria-label="Primary">
            <ul className={styles.navList}>
              {navRoutes.map((route) => {
                const isActive = isActiveRoute(route.href, pathname);
                return (
                  <li key={route.href} className={styles.navItem}>
                    <NextLink
                      href={route.href}
                      aria-current={isActive ? "page" : undefined}
                      className={styles.navLink}
                    >
                      {route.label}
                    </NextLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {crumbs.length > 1 && (
            <nav aria-label="You are here" className={styles.here}>
              <p className={styles.hereLabel}>You are here</p>
              <ol className={styles.trail}>
                {crumbs.map((crumb, i) => {
                  const isCurrent = i === crumbs.length - 1;
                  return (
                    <li key={crumb.path} className={styles.crumb} data-depth={Math.min(i, 4)}>
                      {isCurrent ? (
                        <span aria-current="page" className={styles.crumbCurrent}>
                          {crumb.title}
                        </span>
                      ) : (
                        <NextLink href={crumb.path} className={styles.crumbLink}>
                          {crumb.title}
                        </NextLink>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}

          {footer && <div className={styles.footer}>{footer}</div>}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
