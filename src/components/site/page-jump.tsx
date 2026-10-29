"use client";

import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type KeyboardEvent } from "react";
import { pageHref } from "@/lib/page-href";
import styles from "./page-jump.module.css";

type PageJumpProps = {
  pageCount: number;
  basePath: string;
  /** What a screen reader says for the button. */
  label: string;
  current?: boolean;
  className?: string;
  children: React.ReactNode;
};

/** A button that becomes a box for typing a page number: Enter (or Go, on touch screens) goes there; Escape or clicking away cancels. */
export function PageJump({ pageCount, basePath, label, current, className, children }: PageJumpProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  const go = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = Number(new FormData(event.currentTarget).get("page"));
    setEditing(false);
    if (!Number.isInteger(value)) return;
    router.push(pageHref(basePath, Math.min(Math.max(value, 1), pageCount)));
  };

  if (!editing) {
    return (
      <button
        type="button"
        aria-label={label}
        aria-current={current ? "page" : undefined}
        onClick={() => setEditing(true)}
        className={className}
      >
        {children}
      </button>
    );
  }

  return (
    <form
      onSubmit={go}
      className={styles.form}
      // Moving focus onto the Go button isn't clicking away
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setEditing(false);
      }}
    >
      <input
        name="page"
        type="number"
        min={1}
        max={pageCount}
        step={1}
        inputMode="numeric"
        enterKeyHint="go"
        required
        autoFocus
        aria-label={`Go to page, 1 to ${pageCount}`}
        placeholder={`1–${pageCount}`}
        className={styles.input}
        onKeyDown={(event: KeyboardEvent) => {
          if (event.key === "Escape") setEditing(false);
        }}
      />
      {/* Phone number pads have no Return key. Tapping must not move focus off the input, which would cancel the edit first */}
      <button
        type="submit"
        aria-label="Go to page"
        className={styles.go}
        onMouseDown={(event) => event.preventDefault()}
      >
        <ArrowRightIcon aria-hidden="true" />
      </button>
    </form>
  );
}
