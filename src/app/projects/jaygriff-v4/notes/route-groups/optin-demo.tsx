"use client";

import { useState } from "react";
import styles from "./optin-demo.module.css";

const ROUTES = ["account", "cart", "checkout"];

/** Move routes in and out of a (shop) group and see which of them get the shop layout. The URLs never change. */
export function OptInDemo() {
  const [inGroup, setInGroup] = useState<string[]>(["account", "cart"]);

  const toggle = (route: string) =>
    setInGroup((current) => (current.includes(route) ? current.filter((r) => r !== route) : [...current, route]));

  const members = ROUTES.filter((r) => inGroup.includes(r));
  const outsiders = ROUTES.filter((r) => !inGroup.includes(r));

  return (
    <div className={styles.demo}>
      <div className={styles.group} role="group" aria-label="Routes in the (shop) group">
        <span className={styles.groupLabel}>In (shop)</span>
        {ROUTES.map((route) => (
          <button
            key={route}
            type="button"
            className={styles.choice}
            aria-pressed={inGroup.includes(route)}
            onClick={() => toggle(route)}
          >
            {route}
          </button>
        ))}
      </div>

      <ul className={styles.rows}>
        {ROUTES.map((route) => (
          <li key={route} className={styles.row}>
            <code className={styles.path}>{`app/${inGroup.includes(route) ? "(shop)/" : ""}${route}/page.tsx`}</code>
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
            <code className={styles.url}>{`/${route}`}</code>
          </li>
        ))}
      </ul>

      <div className={styles.preview}>
        <div className={styles.shop}>
          <div className={styles.shopHead}>
            <code className={styles.file}>app/(shop)/layout.tsx</code>
            <span className={styles.note}>shop header, cart badge</span>
          </div>
          {members.length ? (
            members.map((route) => (
              <div key={route} className={styles.page}>
                <code>{`/${route}`}</code>
              </div>
            ))
          ) : (
            <p className={styles.empty}>No routes in the group, so nothing uses this layout.</p>
          )}
        </div>
        <div className={styles.outside}>
          <span className={styles.note}>no shared layout</span>
          {outsiders.length ? (
            outsiders.map((route) => (
              <div key={route} className={styles.page}>
                <code>{`/${route}`}</code>
              </div>
            ))
          ) : (
            <p className={styles.empty}>Every route is in the group.</p>
          )}
        </div>
      </div>
    </div>
  );
}
