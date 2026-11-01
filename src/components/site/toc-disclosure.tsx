"use client";

import { useId, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { H2 } from "@/components/typography";
import type { TocEntry } from "@/lib/goatboat";
import { cn } from "@/lib/utils";
import { TableOfContents } from "./table-of-contents";
import styles from "./toc-disclosure.module.css";

/** The contents list. Always open beside the article; below the wide breakpoint a one-line bar opens it, and it closes again after a jump. */
export function TocDisclosure({
  title,
  titleId,
  entries,
}: {
  title: string;
  titleId: string;
  entries: TocEntry[];
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <section className={styles.section}>
      <H2 className={styles.heading}>On this page</H2>

      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.toggleLabel}>On this page</span>
        <span className={styles.toggleCount}>
          {entries.length} {entries.length === 1 ? "section" : "sections"}
        </span>
        <ChevronDownIcon aria-hidden="true" className={cn(styles.chevron, open && styles.chevronOpen)} />
      </button>

      <div id={panelId} className={cn(styles.panel, open && styles.panelOpen)}>
        <TableOfContents title={title} titleId={titleId} entries={entries} onNavigate={() => setOpen(false)} />
      </div>
    </section>
  );
}
