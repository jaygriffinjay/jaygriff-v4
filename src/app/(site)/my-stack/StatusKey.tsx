"use client";

import { InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TOOL_STATUS_META, type ToolStatus } from "./tool-status";
import styles from "./page.module.css";

/** The info button that opens the full legend of usage statuses. */
export function StatusLegend() {
  const statuses = Object.keys(TOOL_STATUS_META) as ToolStatus[];
  return (
    <Popover>
      <PopoverTrigger className={styles.keyButton} aria-label="What the usage statuses mean">
        <InfoIcon aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent align="start" className={styles.keyPopover}>
          <p className={styles.legendTitle}>What the statuses mean</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Meaning</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statuses.map((status) => {
                const { label, hint, markClass } = TOOL_STATUS_META[status];
                return (
                  <TableRow key={status}>
                    <TableCell className={styles.legendLabel}>
                      <span className={styles.dotLabel}>
                        <span className={cn(styles.statusMark, markClass || styles.noDot)} />
                        <span className={styles.statusLabel}>{label}</span>
                      </span>
                    </TableCell>
                    <TableCell className={styles.legendMeaning}>
                      {hint}.{!markClass && " No dot."}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
      </PopoverContent>
    </Popover>
  );
}

/** The usage statuses as a centred row of dotted labels; the legend button explains them. */
export function StatusKey() {
  const statuses = Object.keys(TOOL_STATUS_META) as ToolStatus[];
  return (
    <ul className={styles.keyList} aria-hidden="true">
      {statuses.map((status) => {
        const { label, markClass } = TOOL_STATUS_META[status];
        return (
          <li key={status} className={styles.dotLabel}>
            <span className={cn(styles.statusMark, markClass || styles.noDot)} />
            <span className={styles.statusLabel}>{label}</span>
          </li>
        );
      })}
    </ul>
  );
}
