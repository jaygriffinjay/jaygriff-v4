"use client";

import { QrCodeIcon, XIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import styles from "./qr-button.module.css";

/** A button beside a contact row that opens a dialog holding whatever it's given: the card to scan. */
export function QrButton({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger render={<button type="button" className={styles.button} aria-label={`Show QR code for ${label}`} />}>
        <QrCodeIcon aria-hidden="true" />
      </DialogTrigger>
      <DialogContent className={styles.dialog} showCloseButton={false}>
        {children}
        <DialogClose render={<button type="button" className={styles.close} aria-label="Close" />}>
          <XIcon aria-hidden="true" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
