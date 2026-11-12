"use client";

import { useState } from "react";
import styles from "./url-demo.module.css";

type Folder = "marketing" | "shop";

const FOLDERS: Folder[] = ["marketing", "shop"];

const FILES: { folder: Folder; rest: string; extra?: boolean }[] = [
  { folder: "marketing", rest: "pricing/page.tsx" },
  { folder: "marketing", rest: "about/page.tsx" },
  { folder: "shop", rest: "cart/page.tsx" },
  { folder: "shop", rest: "about/page.tsx", extra: true },
];

/** Wrap folders in parentheses and watch the URLs lose them; make two groups claim one URL to see the error. */
export function UrlDemo() {
  const [wrapped, setWrapped] = useState<Record<Folder, boolean>>({ marketing: false, shop: false });
  const [addExtra, setAddExtra] = useState(false);

  const rows = FILES.filter((f) => addExtra || !f.extra).map((f) => {
    const dirs = f.rest.split("/").slice(0, -1);
    const path = `app/${wrapped[f.folder] ? `(${f.folder})` : f.folder}/${f.rest}`;
    const url = "/" + [...(wrapped[f.folder] ? [] : [f.folder]), ...dirs].join("/");
    return { path, url };
  });

  const counts = new Map<string, number>();
  for (const row of rows) counts.set(row.url, (counts.get(row.url) ?? 0) + 1);
  const clash = [...counts].find(([, n]) => n > 1);
  const clashing = clash ? rows.filter((r) => r.url === clash[0]) : [];

  return (
    <div className={styles.demo}>
      <div className={styles.controls}>
        <div className={styles.group} role="group" aria-label="Wrap in parentheses">
          <span className={styles.groupLabel}>Wrap</span>
          {FOLDERS.map((folder) => (
            <button
              key={folder}
              type="button"
              className={styles.choice}
              aria-pressed={wrapped[folder]}
              onClick={() => setWrapped((w) => ({ ...w, [folder]: !w[folder] }))}
            >
              {folder}
            </button>
          ))}
        </div>
        <div className={styles.group} role="group" aria-label="Add a file">
          <span className={styles.groupLabel}>Add</span>
          <button type="button" className={styles.choice} aria-pressed={addExtra} onClick={() => setAddExtra((v) => !v)}>
            shop/about/page.tsx
          </button>
        </div>
      </div>

      <ul className={styles.rows}>
        {rows.map((row) => (
          <li key={row.path} className={styles.row} data-clash={clash?.[0] === row.url}>
            <code className={styles.path}>{row.path}</code>
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
            <code className={styles.url}>{row.url}</code>
          </li>
        ))}
      </ul>

      <p className={styles.outcome} data-kind={clash ? "error" : "ok"} aria-live="polite">
        {clash
          ? `Build error: ${clashing.map((r) => r.path.replace("/page.tsx", "")).join(" and ")} both resolve to ${clash[0]}. Two groups can't claim the same URL.`
          : "No conflicts. The URLs on the right are what visitors see: the parenthesised folders are gone from them."}
      </p>
    </div>
  );
}
