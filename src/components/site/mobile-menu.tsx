"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
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

/** The current page's full trail, with a curved arrow from the word "here" to the page you're on. */
function HereTrail({ crumbs }: { crumbs: Crumb[] }) {
  const boxRef = useRef<HTMLElement>(null);
  const hereRef = useRef<HTMLSpanElement>(null);
  const currentRef = useRef<HTMLSpanElement>(null);
  // useId can contain characters that break url(#…), so keep just the safe ones
  const [path, setPath] = useState<string | null>(null);

  // The arrow's ends depend on rendered text, so measure after layout and again on resize
  useLayoutEffect(() => {
    const box = boxRef.current;
    const here = hereRef.current;
    const current = currentRef.current;
    if (!box || !here || !current) return;

    const draw = () => {
      const b = box.getBoundingClientRect();
      const h = here.getBoundingClientRect();
      const c = current.getBoundingClientRect();
      const start = { x: h.right - b.left + 6, y: h.top + h.height / 2 - b.top };
      const end = { x: c.right - b.left + 8, y: c.top + c.height / 2 - b.top };
      // Out from "here", round a semicircle on the right, back in to the title, then a fixed left-pointing head
      const x = Math.max(start.x, end.x) + 12;
      const r = (end.y - start.y) / 2;
      setPath(
        `M ${start.x} ${start.y} H ${x} A ${r} ${r} 0 0 1 ${x} ${end.y} H ${end.x}` +
          ` M ${end.x + 6} ${end.y - 5} L ${end.x} ${end.y} L ${end.x + 6} ${end.y + 5}`,
      );
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(box);
    return () => observer.disconnect();
  }, [crumbs]);

  return (
    <nav ref={boxRef} aria-label="You are here" className={styles.here}>
      <p className={styles.hereLabel}>
        You are <span ref={hereRef}>here</span>
      </p>
      <ol className={styles.trail}>
        {crumbs.map((crumb, i) => {
          const isCurrent = i === crumbs.length - 1;
          return (
            <li key={crumb.path} className={styles.crumb} data-depth={Math.min(i, 4)}>
              {isCurrent ? (
                <span ref={currentRef} aria-current="page" className={styles.crumbCurrent}>
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
      {path && (
        <svg className={styles.arrow} aria-hidden="true">
          <path d={path} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </nav>
  );
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

          {crumbs.length > 1 && <HereTrail crumbs={crumbs} />}

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

          {footer && <div className={styles.footer}>{footer}</div>}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
