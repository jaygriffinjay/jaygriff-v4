"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { LayersIcon } from "lucide-react";
import { CapsLabel } from "@/components/typography";
import type { NotesNav } from "@/lib/goatboat";
import { cn } from "@/lib/utils";
import { NavPanel } from "./nav-panel";
import styles from "./notes-bar.module.css";

/** Opens a panel with every section and page of the project whose notes you're reading. */
export function NotesBar({ nav }: { nav: NotesNav }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Picking a page lands on it, so close the panel then
  useEffect(() => setOpen(false), [pathname]);

  return (
    <NavPanel
      open={open}
      onOpenChange={setOpen}
      triggerClassName={styles.bar}
      trigger={
        <>
          <LayersIcon aria-hidden="true" className={styles.barIcon} />
          Also in this project
        </>
      }
      eyebrow="Notes"
      title={nav.project.title}
      subtitle={nav.project.tagline}
      closeLabel="Close notes"
    >
      <nav aria-label={`${nav.project.title} notes`} className={styles.sections}>
        {nav.sections.map((s) => (
          <section key={s.slug}>
            <h3 className={styles.groupHeading}>
              <CapsLabel>{s.title}</CapsLabel>
            </h3>
            <ul className={styles.pages}>
              {s.pages.map((page) => {
                const current = page.path === pathname;
                return (
                  <li key={page.path}>
                    <NextLink
                      href={page.path}
                      className={cn(styles.page, current && styles.pageCurrent)}
                      aria-current={current ? "page" : undefined}
                    >
                      {page.title}
                    </NextLink>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>
    </NavPanel>
  );
}
