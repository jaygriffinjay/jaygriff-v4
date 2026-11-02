"use client";

import { useState } from "react";
import { ChevronsDownUpIcon, ChevronsUpDownIcon } from "lucide-react";
import { H2 } from "@/components/typography";
import { QuestionList, type Question } from "@/components/site/question-list";
import styles from "./faq.module.css";

type Section = { heading: string; items: Question[] };

/** The About page's question sections; a button beside the first heading opens every answer, or closes them all if any are open. */
export function Faq({ sections }: { sections: Section[] }) {
  const [open, setOpen] = useState<string[]>([]);
  const anyOpen = open.length > 0;
  const all = sections.flatMap((s) => s.items.map((q) => q.question));

  return sections.map(({ heading, items }, index) => {
    const mine = new Set(items.map((q) => q.question));
    return (
      <section key={heading} className={styles.section}>
        <div className={styles.headingRow}>
          <H2 className={styles.heading}>{heading}</H2>
          {index === 0 && (
            <button type="button" className={styles.toggle} onClick={() => setOpen(anyOpen ? [] : all)}>
              {anyOpen ? <ChevronsDownUpIcon aria-hidden="true" /> : <ChevronsUpDownIcon aria-hidden="true" />}
              {anyOpen ? "Collapse all" : "Expand all"}
            </button>
          )}
        </div>
        <QuestionList
          items={items}
          open={open.filter((q) => mine.has(q))}
          onOpenChange={(next) => setOpen([...open.filter((q) => !mine.has(q)), ...next])}
        />
      </section>
    );
  });
}
