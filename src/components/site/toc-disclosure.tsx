"use client";

import { useState } from "react";
import { ChevronsUpDownIcon } from "lucide-react";
import { useActiveHeading } from "@/hooks/use-active-heading";
import { useJumpAfterClose } from "@/hooks/use-jump-after-close";
import { CapsLabel } from "@/components/typography";
import type { TocEntry } from "@/lib/goatboat";
import { NavPanel } from "./nav-panel";
import { TableOfContents, TocList } from "./table-of-contents";
import styles from "./toc-disclosure.module.css";

/** The contents list. Always open beside the article; below the wide breakpoint a one-line bar opens it in a panel. */
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
  const [activeId] = useActiveHeading(
    titleId,
    entries.map((entry) => entry.id),
  );
  const { goTo, onClosed } = useJumpAfterClose(titleId, () => setOpen(false));
  const count = `${entries.length} ${entries.length === 1 ? "section" : "sections"}`;

  return (
    <section className={styles.section}>
      <div className={styles.beside}>
        <h2 className={styles.heading}>
          <CapsLabel>On this page</CapsLabel>
        </h2>
        <div className={styles.list}>
          <TableOfContents title={title} titleId={titleId} entries={entries} />
        </div>
      </div>

      <NavPanel
        open={open}
        onOpenChange={setOpen}
        onOpenChangeComplete={onClosed}
        triggerClassName={styles.toggle}
        trigger={
          <>
            <CapsLabel>On this page</CapsLabel>
            <span className={styles.toggleCount}>{count}</span>
            <ChevronsUpDownIcon aria-hidden="true" className={styles.chevron} />
          </>
        }
        eyebrow="On this page"
        title={title}
        subtitle={count}
        closeLabel="Close contents"
      >
        <TocList title={title} titleId={titleId} entries={entries} activeId={activeId} goTo={goTo} />
      </NavPanel>
    </section>
  );
}
