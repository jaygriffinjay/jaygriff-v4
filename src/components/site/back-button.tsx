"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import styles from "./back-button.module.css";

/** Returns to the previous page, or home when there's no history to go back to. */
export function BackButton({ className }: { className?: string }) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  // History only exists in the browser, so the label settles after mount
  useEffect(() => setCanGoBack(window.history.length > 1), []);

  return (
    <NextLink
      href="/"
      className={cn(styles.backLink, className)}
      onClick={(e) => {
        if (!canGoBack) return;
        e.preventDefault();
        router.back();
      }}
    >
      <span className={styles.arrow} aria-hidden="true">
        ←
      </span>{" "}
      {canGoBack ? "Take me back" : "Take me home"}
    </NextLink>
  );
}
