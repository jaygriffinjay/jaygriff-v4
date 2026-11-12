"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./route-simulator.module.css";

type Route = "/about" | "/notes" | "/contact";
type Mode = "nested" | "two-roots";
type Outcome = { kind: "idle" | "soft" | "hard"; text: string };

const ROUTES: Route[] = ["/about", "/notes", "/contact"];
const MODES: { id: Mode; label: string }[] = [
  { id: "nested", label: "One root layout, groups nested inside" },
  { id: "two-roots", label: "Two root layouts, one per group" },
];

// /contact is the page with no site chrome, so it lives in the (bare) group
const inSite = (route: Route) => route !== "/contact";

/** A model of how layouts behave across navigations, not Next itself: click around and bump the counters to see what survives. */
export function RouteSimulator() {
  const [route, setRoute] = useState<Route>("/about");
  const [mode, setMode] = useState<Mode>("nested");
  const [rootCount, setRootCount] = useState(0);
  const [siteCount, setSiteCount] = useState(0);
  const [outcome, setOutcome] = useState<Outcome>({
    kind: "idle",
    text: "Bump a counter, then click a route. Whatever survives kept its state.",
  });

  const go = (next: Route) => {
    if (next === route) return;
    const crossing = inSite(route) !== inSite(next);

    if (crossing && mode === "two-roots") {
      setRootCount(0);
      setSiteCount(0);
      setOutcome({
        kind: "hard",
        text: "Full page load. Each group has its own root layout, and each root layout owns its own <html>, so the browser starts a fresh document. Everything resets.",
      });
    } else if (crossing) {
      setSiteCount(0);
      setOutcome({
        kind: "soft",
        text: inSite(next)
          ? "Soft navigation. The root layout kept its state; the (site) layout mounted fresh."
          : "Soft navigation. The root layout kept its state; the (site) layout went away, and its state with it.",
      });
    } else {
      setOutcome({ kind: "soft", text: "Soft navigation. Every shared layout kept its state; only the page changed." });
    }
    setRoute(next);
  };

  const changeMode = (next: Mode) => {
    setMode(next);
    setRootCount(0);
    setSiteCount(0);
    setRoute("/about");
    setOutcome({ kind: "idle", text: "Reset. Bump a counter, then click a route." });
  };

  const page = (
    <div key={route} className={styles.page}>
      <code>{`app/${inSite(route) ? "(site)" : "(bare)"}${route}/page.tsx`}</code>
    </div>
  );

  return (
    <div className={styles.sim}>
      <div className={styles.controls}>
        <div className={styles.group} role="group" aria-label="Go to">
          <span className={styles.groupLabel}>Go to</span>
          {ROUTES.map((r) => (
            <button key={r} type="button" className={styles.choice} aria-pressed={route === r} onClick={() => go(r)}>
              {r}
            </button>
          ))}
        </div>
        <div className={styles.group} role="group" aria-label="Layout setup">
          <span className={styles.groupLabel}>Setup</span>
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={styles.choice}
              aria-pressed={mode === m.id}
              onClick={() => changeMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.stage}>
        {mode === "nested" ? (
          <Layer file="app/layout.tsx" note="<html> and <body>, fonts, metadata" count={rootCount} onBump={() => setRootCount((n) => n + 1)}>
            {inSite(route) ? (
              <Layer
                inner
                file="app/(site)/layout.tsx"
                note="header, footer, page frame"
                count={siteCount}
                onBump={() => setSiteCount((n) => n + 1)}
              >
                {page}
              </Layer>
            ) : (
              page
            )}
          </Layer>
        ) : inSite(route) ? (
          <Layer
            file="app/(site)/layout.tsx"
            note="its own <html> and <body>, plus header, footer, page frame"
            count={rootCount}
            onBump={() => setRootCount((n) => n + 1)}
          >
            {page}
          </Layer>
        ) : (
          <Layer
            file="app/(bare)/layout.tsx"
            note="its own <html> and <body>, nothing else"
            count={rootCount}
            onBump={() => setRootCount((n) => n + 1)}
          >
            {page}
          </Layer>
        )}
      </div>

      <p className={styles.outcome} data-kind={outcome.kind} aria-live="polite">
        {outcome.text}
      </p>
    </div>
  );
}

function Layer({
  file,
  note,
  count,
  onBump,
  inner,
  children,
}: {
  file: string;
  note: string;
  count: number;
  onBump: () => void;
  inner?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(styles.layer, inner && styles.layerInner)}>
      <div className={styles.layerHead}>
        <code className={styles.layerFile}>{file}</code>
        <span className={styles.layerNote}>{note}</span>
        <button type="button" className={styles.counter} onClick={onBump}>
          state: {count} <span aria-hidden="true">+1</span>
        </button>
      </div>
      {children}
    </div>
  );
}
