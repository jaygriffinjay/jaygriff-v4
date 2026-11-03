"use client";

import { ChevronsDownUpIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./expand-all-toggle.module.css";

/** Opens everything, or closes everything if anything is open. Muted text and an icon, no box. */
export function ExpandAllToggle({
  anyOpen,
  onToggle,
  className,
}: {
  anyOpen: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button type="button" className={cn(styles.toggle, className)} onClick={onToggle}>
      {anyOpen ? <ChevronsDownUpIcon aria-hidden="true" /> : <ChevronsUpDownIcon aria-hidden="true" />}
      {anyOpen ? "Collapse all" : "Expand all"}
    </button>
  );
}
