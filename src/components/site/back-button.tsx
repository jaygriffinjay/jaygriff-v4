"use client";

import { useSyncExternalStore } from "react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import styles from "./back-button.module.css";

const subscribeToHistory = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
};

const canGoBackSnapshot = () => window.history.length > 1;
const serverCanGoBackSnapshot = () => false;

/** Returns to the previous page, or home when there's no history to go back to. */
export function BackButton({ className }: { className?: string }) {
  const router = useRouter();
  // Next navigation rerenders this component after pushing a history entry.
  usePathname();
  const canGoBack = useSyncExternalStore(
    subscribeToHistory,
    canGoBackSnapshot,
    serverCanGoBackSnapshot,
  );

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
