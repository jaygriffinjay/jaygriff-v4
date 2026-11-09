"use client";

import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { CapsLabel } from "@/components/typography";
import type { NotesNav } from "@/lib/goatboat";
import { cn } from "@/lib/utils";
import styles from "./notes-list.module.css";

/** Every section of a project's notes and its pages, with the page being read marked. Shared by the notes panel and the notes aside. */
export function NotesList({ nav }: { nav: NotesNav }) {
  const pathname = usePathname();

  return (
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
  );
}
