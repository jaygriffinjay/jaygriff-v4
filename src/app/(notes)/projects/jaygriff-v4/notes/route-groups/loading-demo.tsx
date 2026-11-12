"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./loading-demo.module.css";

type Where = "segment" | "group";
type Page = "overview" | "settings" | "reports";

const PAGES: { id: Page; url: string; file: string }[] = [
  { id: "overview", url: "/dashboard", file: "app/dashboard/(overview)/page.tsx" },
  { id: "settings", url: "/dashboard/settings", file: "app/dashboard/settings/page.tsx" },
  { id: "reports", url: "/dashboard/reports", file: "app/dashboard/reports/page.tsx" },
];

const WHERE: { id: Where; label: string; file: string }[] = [
  { id: "segment", label: "In the dashboard folder", file: "app/dashboard/loading.tsx" },
  { id: "group", label: "In the (overview) group", file: "app/dashboard/(overview)/loading.tsx" },
];

const LOAD_MS = 1500;

/** Move loading.tsx into a route group and see which pages get a skeleton while they load, and which just wait. */
export function LoadingDemo() {
  const [where, setWhere] = useState<Where>("group");
  const [shown, setShown] = useState<Page>("overview");
  const [pending, setPending] = useState<Page | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  // The skeleton covers every page in the folder, or just the overview when the file sits in its group
  const hasSkeleton = (page: Page) => where === "segment" || page === "overview";

  const go = (page: Page) => {
    if (page === shown && !pending) return;
    clearTimeout(timer.current);
    setPending(page);
    timer.current = setTimeout(() => {
      setShown(page);
      setPending(null);
    }, LOAD_MS);
  };

  const pick = (next: Where) => {
    clearTimeout(timer.current);
    setPending(null);
    setWhere(next);
  };

  const current = PAGES.find((p) => p.id === shown)!;
  const target = pending ? PAGES.find((p) => p.id === pending)! : null;
  const skeleton = target && hasSkeleton(target.id);

  return (
    <div className={styles.demo}>
      <div className={styles.controls}>
        <div className={styles.group} role="group" aria-label="Where loading.tsx lives">
          <span className={styles.groupLabel}>Put it</span>
          {WHERE.map((w) => (
            <button key={w.id} type="button" className={styles.choice} aria-pressed={where === w.id} onClick={() => pick(w.id)}>
              {w.label}
            </button>
          ))}
        </div>
        <div className={styles.group} role="group" aria-label="Go to">
          <span className={styles.groupLabel}>Go to</span>
          {PAGES.map((p) => (
            <button key={p.id} type="button" className={styles.choice} aria-pressed={shown === p.id && !pending} onClick={() => go(p.id)}>
              {p.url}
            </button>
          ))}
        </div>
      </div>

      <p className={styles.files}>
        <code>{WHERE.find((w) => w.id === where)!.file}</code>
      </p>

      <div className={styles.layout}>
        <div className={styles.layoutHead}>
          <code className={styles.file}>app/dashboard/layout.tsx</code>
          <span className={styles.note}>stays on screen and interactive the whole time</span>
        </div>
        <div className={styles.screen} aria-busy={pending !== null}>
          {skeleton ? (
            <div className={styles.skeleton}>
              <span className={styles.note}>loading.tsx for {target.url}</span>
              <span className={styles.bar} />
              <span className={cn(styles.bar, styles.barShort)} />
              <span className={styles.bar} />
            </div>
          ) : (
            <div className={styles.content}>
              <code className={styles.file}>{current.file}</code>
              <span className={styles.line} />
              <span className={cn(styles.line, styles.lineShort)} />
            </div>
          )}
        </div>
      </div>

      <p className={styles.outcome} data-kind={pending ? (skeleton ? "skeleton" : "wait") : "idle"} aria-live="polite">
        {!pending
          ? `Showing ${current.url}. Click another page; each one takes ${LOAD_MS / 1000} seconds to load.`
          : skeleton
            ? `Going to ${target.url}: the skeleton shows instantly, because a loading.tsx applies to this page.`
            : `Going to ${target!.url}: no loading.tsx applies here, so the old page stays on screen until the new one is ready.`}
      </p>
    </div>
  );
}
