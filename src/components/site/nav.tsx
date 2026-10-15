"use client";

import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { cn } from "@/lib/utils";
import { isActiveRoute, navRoutes } from "./routes";
import styles from "./nav.module.css";

interface SiteNavProps {
  className?: string;
}

export function SiteNav({ className }: SiteNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className={cn(styles.nav, className)}>
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
  );
}
