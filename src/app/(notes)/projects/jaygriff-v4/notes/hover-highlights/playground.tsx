"use client";

import { useState } from "react";
import { Small } from "@/components/typography";
import { cn } from "@/lib/utils";
import { brighter } from "./candidates";
import { AccordionMock, TableMock } from "./demos";
import styles from "./page.module.css";

/** Pick a candidate, then hover the live accordion and table. */
export function Playground() {
  const [index, setIndex] = useState(0);
  const current = brighter[index];

  return (
    <section className={cn(styles.section, current.className)}>
      <div className={styles.chips} role="radiogroup" aria-label="Hover color">
        {brighter.map(({ name }, i) => (
          <button
            key={name}
            type="button"
            role="radio"
            aria-checked={i === index}
            onClick={() => setIndex(i)}
            className={cn(styles.chip, i === index && styles.chipOn)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className={styles.compare}>
        <div className={cn(styles.demo, styles.hoverable)}>
          <Small>Accordion</Small>
          <AccordionMock />
        </div>
        <div className={cn(styles.demo, styles.hoverable)}>
          <Small>Table</Small>
          <TableMock />
        </div>
      </div>
    </section>
  );
}
