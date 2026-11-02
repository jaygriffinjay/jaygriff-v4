"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { ChevronsUpDownIcon } from "lucide-react";
import { Bold, CapsLabel, Small } from "@/components/typography";
import type { NotesNav } from "@/lib/goatboat";
import { cn } from "@/lib/utils";
import { NavPanel } from "./nav-panel";
import styles from "./notes-bar.module.css";

/** Names the project whose notes you're reading; opens a panel with all of its sections and pages. */
export function NotesBar({ nav, sectionSlug }: { nav: NotesNav; sectionSlug: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const section = nav.sections.find((s) => s.slug === sectionSlug);

  // Picking a page lands on it, so close the panel then
  useEffect(() => setOpen(false), [pathname]);

  return (
    <NavPanel
      open={open}
      onOpenChange={setOpen}
      triggerClassName={styles.bar}
      trigger={
        <>
          <span className={styles.barText}>
            <CapsLabel>Notes</CapsLabel>
            <span className={styles.project}>
              <Bold>{nav.project.title}</Bold>
            </span>
            {section && <Small className={styles.section}>{section.title}</Small>}
          </span>
          <ChevronsUpDownIcon aria-hidden="true" className={styles.barIcon} />
        </>
      }
      eyebrow="Notes"
      title={nav.project.title}
      subtitle={nav.project.tagline}
      closeLabel="Close notes"
    >
      <nav aria-label={`${nav.project.title} notes`} className={styles.sections}>
        {nav.sections.map((s) => (
          <section key={s.slug} className={cn(styles.group, s.slug === sectionSlug && styles.groupCurrent)}>
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
                      <span className={styles.pageTitle}>{page.title}</span>
                      {page.description && <Small className={styles.pageDescription}>{page.description}</Small>}
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
