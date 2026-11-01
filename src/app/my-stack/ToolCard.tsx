"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TOOL_STATUS_META } from "./tool-status";
import type { Tool } from "./tools";
import styles from "./page.module.css";

/** One tool: logo, name and a short line. A tool with a note opens to show it. */
export function ToolCard({ logo, title, description, note, invert = false, status = "active" }: Tool) {
  const { label, markClass } = TOOL_STATUS_META[status];
  const [open, setOpen] = useState(false);

  const body = (
    <>
      <div className={styles.toolLogo}>
        <Image
          src={logo}
          alt={`${title} logo`}
          width={40}
          height={40}
          className={cn(styles.toolLogoImg, invert && styles.toolLogoInvert)}
        />
      </div>
      <div className={styles.toolBody}>
        <strong className={styles.toolTitle}>
          {title}
          {markClass && (
            <span className={cn(styles.statusMark, markClass)} title={`${title}: ${label}`}>
              *<span className={styles.srOnly}> {label}</span>
            </span>
          )}
        </strong>
        <p className={styles.toolDescription}>{description}</p>
      </div>
    </>
  );

  if (!note) return <div className={styles.toolCard}>{body}</div>;

  return (
    <div className={cn(styles.toolCard, styles.toolCardNoted, open && styles.toolCardOpen)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={styles.toolTrigger}
      >
        {body}
        <ChevronDownIcon aria-hidden="true" className={cn(styles.toolChevron, open && styles.toolChevronOpen)} />
      </button>
      {open && <p className={styles.toolNote}>{note}</p>}
    </div>
  );
}
