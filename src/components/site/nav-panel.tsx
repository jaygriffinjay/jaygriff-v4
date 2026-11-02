"use client";

import { Dialog } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { CapsLabel, H2, Muted } from "@/components/typography";
import styles from "./nav-panel.module.css";

/** A bar that opens a centred panel for in-page navigation: the project's notes, the page's contents. */
export function NavPanel({
  open,
  onOpenChange,
  onOpenChangeComplete,
  triggerClassName,
  trigger,
  eyebrow,
  title,
  subtitle,
  closeLabel,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Runs once the panel has finished opening or closing and released the page. */
  onOpenChangeComplete?: (open: boolean) => void;
  triggerClassName?: string;
  /** What the bar shows. */
  trigger: React.ReactNode;
  /** Small caps line above the title, e.g. "Notes". */
  eyebrow: string;
  title: string;
  subtitle?: string | null;
  closeLabel: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} onOpenChangeComplete={onOpenChangeComplete}>
      <Dialog.Trigger className={triggerClassName}>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup className={styles.panel}>
          <div className={styles.header}>
            <div className={styles.headerText}>
              <CapsLabel>{eyebrow}</CapsLabel>
              <Dialog.Title render={<H2 className={styles.title} />}>{title}</Dialog.Title>
              {subtitle && <Muted>{subtitle}</Muted>}
            </div>
            <Dialog.Close className={styles.close} aria-label={closeLabel}>
              <XIcon aria-hidden="true" />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
