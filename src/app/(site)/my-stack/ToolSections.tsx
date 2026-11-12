"use client";

import { useState } from "react";
import { H2 } from "@/components/typography";
import { ExpandAllToggle } from "@/components/site/expand-all-toggle";
import { ToolCard } from "./ToolCard";
import type { Tool } from "./tools";
import styles from "./page.module.css";

type Section = { id: string; label: string; tools: Tool[] };

/** Every category's tools; a control beside the first heading opens every note, or closes them all if any are open. */
export function ToolSections({ sections }: { sections: Section[] }) {
  const [open, setOpen] = useState<string[]>([]);
  const anyOpen = open.length > 0;
  const withNotes = sections.flatMap((s) => s.tools.filter((t) => t.note).map((t) => t.title));
  const toggle = (title: string) =>
    setOpen(open.includes(title) ? open.filter((t) => t !== title) : [...open, title]);

  return (
    <div className={styles.sections}>
      {sections.map((section, index) => (
        <section key={section.id} className={styles.sectionBody}>
          <div className={styles.headingRow}>
            <H2 className={styles.sectionHeading}>{section.label}</H2>
            {index === 0 && <ExpandAllToggle anyOpen={anyOpen} onToggle={() => setOpen(anyOpen ? [] : withNotes)} />}
          </div>
          <div className={styles.toolList}>
            {section.tools.map((tool) => (
              <ToolCard key={tool.title} {...tool} open={open.includes(tool.title)} onToggle={() => toggle(tool.title)} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
