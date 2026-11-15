"use client";

import Image from "next/image";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TOOL_STATUS_META } from "./tool-status";
import type { Tool } from "./tools";
import styles from "./page.module.css";

/** One tool: logo, name and a short line. A tool with a note opens to show it; the list owns which are open. */
export function ToolCard({
  logo,
  title,
  description,
  note,
  invert = false,
  status = "active",
  open,
  onToggle,
}: Tool & { open: boolean; onToggle: () => void }) {
  const { label, markClass } = TOOL_STATUS_META[status];

  const body = (
    <>
      <span className={styles.gutter}>
        {markClass && (
          <span className={cn(styles.statusMark, markClass)} title={`${title}: ${label}`}>
            <span className={styles.srOnly}>{label}</span>
          </span>
        )}
      </span>
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
        <strong className={styles.toolTitle}>{title}</strong>
        <p className={styles.toolDescription}>{description}</p>
      </div>
    </>
  );

  if (!note)
    return (
      <div className={styles.toolCard}>
        {body}
        <span className={styles.chevronSpace} aria-hidden="true" />
      </div>
    );

  return (
    <div className={cn(styles.toolCard, styles.toolCardNoted)}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={styles.toolTrigger}
      >
        {body}
        <ChevronRightIcon aria-hidden="true" className={cn(styles.toolChevron, open && styles.toolChevronOpen)} />
      </button>
      <p hidden={!open} className={styles.toolNote}>
        {note}
      </p>
    </div>
  );
}
