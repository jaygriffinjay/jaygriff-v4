import NextLink from "next/link";
import { cn } from "@/lib/utils";
import { navRoutes } from "./routes";
import styles from "./nav.module.css";

// No current-page mark: the breadcrumbs say where you are
export function SiteNav({ className }: { className?: string }) {
  return (
    <nav aria-label="Primary" className={cn(styles.nav, className)}>
      <ul className={styles.navList}>
        {navRoutes.map((route) => (
          <li key={route.href} className={styles.navItem}>
            <NextLink href={route.href} className={styles.navLink}>
              {route.label}
            </NextLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
