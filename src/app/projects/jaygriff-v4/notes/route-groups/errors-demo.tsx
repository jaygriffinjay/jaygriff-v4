"use client";

import { useState } from "react";
import styles from "./errors-demo.module.css";

type Breaks = "nothing" | "page" | "layout" | "not-found";
type Caught = "dashboard" | "root" | "global";

const BREAKS: { id: Breaks; label: string }[] = [
  { id: "nothing", label: "Nothing" },
  { id: "page", label: "The page throws" },
  { id: "layout", label: "The dashboard layout throws" },
  { id: "not-found", label: "The page calls notFound()" },
];

type Files = { dashboardError: boolean; rootError: boolean; dashboardNotFound: boolean };

const FILES: { id: keyof Files; file: string }[] = [
  { id: "dashboardError", file: "app/dashboard/error.tsx" },
  { id: "rootError", file: "app/error.tsx" },
  { id: "dashboardNotFound", file: "app/dashboard/not-found.tsx" },
];

/** Break the page, the layout or call notFound(), and see which file catches it and what stays on screen. */
export function ErrorsDemo() {
  const [breaks, setBreaks] = useState<Breaks>("page");
  const [files, setFiles] = useState<Files>({ dashboardError: true, rootError: false, dashboardNotFound: false });

  // error.tsx wraps its segment's page and children but not its own layout, so a layout error skips the file beside it
  let caught: Caught | null = null;
  let why = "Nothing is broken, so every layer renders.";
  if (breaks === "page") {
    caught = files.dashboardError ? "dashboard" : files.rootError ? "root" : "global";
    why =
      caught === "dashboard"
        ? "The page threw. app/dashboard/error.tsx is the nearest boundary, so only the page is replaced and both layouts stay."
        : caught === "root"
          ? "The page threw and there's no dashboard error.tsx. app/error.tsx catches it, and it replaces everything inside the root layout, including the dashboard layout."
          : "The page threw and no error.tsx exists above it. Only global-error.tsx is left.";
  } else if (breaks === "layout") {
    caught = files.rootError ? "root" : "global";
    why =
      caught === "root"
        ? "The dashboard layout threw. dashboard/error.tsx sits inside that layout, so it can't catch it. The error goes up to app/error.tsx."
        : "The dashboard layout threw. dashboard/error.tsx can't catch its own layout and there's no app/error.tsx, so only global-error.tsx is left.";
  } else if (breaks === "not-found") {
    caught = files.dashboardNotFound ? "dashboard" : "root";
    why =
      caught === "dashboard"
        ? "notFound() was called. app/dashboard/not-found.tsx is the nearest one, so it fills the page's place inside the dashboard layout."
        : "notFound() was called and there's no dashboard not-found.tsx. The root one handles it, and per the docs' hierarchy it wraps the dashboard layout too.";
  }

  const fallback = breaks === "not-found" ? "404: not-found.tsx" : "Something went wrong: error.tsx";

  return (
    <div className={styles.demo}>
      <div className={styles.controls}>
        <div className={styles.group} role="group" aria-label="What breaks">
          <span className={styles.groupLabel}>Break</span>
          {BREAKS.map((b) => (
            <button key={b.id} type="button" className={styles.choice} aria-pressed={breaks === b.id} onClick={() => setBreaks(b.id)}>
              {b.label}
            </button>
          ))}
        </div>
        <div className={styles.group} role="group" aria-label="Files that exist">
          <span className={styles.groupLabel}>Files</span>
          {FILES.map((f) => (
            <button
              key={f.id}
              type="button"
              className={styles.choice}
              aria-pressed={files[f.id]}
              onClick={() => setFiles((current) => ({ ...current, [f.id]: !current[f.id] }))}
            >
              {f.file}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.stage}>
        {caught === "global" ? (
          <div className={styles.layer} data-fallback="true">
            <code className={styles.file}>app/global-error.tsx</code>
            <span className={styles.note}>replaces the root layout itself, so it brings its own &lt;html&gt; and &lt;body&gt;</span>
            <p className={styles.message}>Something went wrong.</p>
          </div>
        ) : (
          <div className={styles.layer}>
            <div className={styles.head}>
              <code className={styles.file}>app/layout.tsx</code>
              <span className={styles.note}>root layout</span>
            </div>
            {caught === "root" ? (
              <Fallback file={breaks === "not-found" ? "app/not-found.tsx" : "app/error.tsx"} text={fallback} />
            ) : (
              <div className={styles.layer}>
                <div className={styles.head}>
                  <code className={styles.file}>app/dashboard/layout.tsx</code>
                  <span className={styles.note}>dashboard layout</span>
                </div>
                {caught === "dashboard" ? (
                  <Fallback file={breaks === "not-found" ? "app/dashboard/not-found.tsx" : "app/dashboard/error.tsx"} text={fallback} />
                ) : (
                  <div className={styles.page}>
                    <code>app/dashboard/page.tsx</code>
                    <span className={styles.note}>renders fine</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <p className={styles.outcome} data-kind={breaks === "nothing" ? "ok" : "caught"} aria-live="polite">
        {why}
      </p>
    </div>
  );
}

function Fallback({ file, text }: { file: string; text: string }) {
  return (
    <div className={styles.fallback}>
      <code className={styles.file}>{file}</code>
      <p className={styles.message}>{text}</p>
    </div>
  );
}
