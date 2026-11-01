"use client";

import { InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TOOL_STATUS_META, type ToolStatus } from "./tool-status";
import styles from "./page.module.css";

/** What each usage status means. Every one is a chip that opens its meaning, by tap, click or keyboard. */
export function StatusKey() {
  return (
    <ul className={styles.key} aria-label="What the usage statuses mean">
      {(Object.keys(TOOL_STATUS_META) as ToolStatus[]).map((status) => {
        const { label, hint, markClass } = TOOL_STATUS_META[status];
        return (
          <li key={status}>
            <Popover>
              <PopoverTrigger className={styles.keyButton}>
                <span>
                  {label}
                  {markClass && <span className={cn(styles.statusMark, markClass)}>*</span>}
                </span>
                <InfoIcon aria-hidden="true" className={styles.keyInfo} />
              </PopoverTrigger>
              <PopoverContent align="start" className={styles.keyPopover}>
                <p>
                  <strong>{label}.</strong> {hint}.{!markClass && " These tools have no asterisk."}
                </p>
              </PopoverContent>
            </Popover>
          </li>
        );
      })}
    </ul>
  );
}
