"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Copy, WrapText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import styles from "./CodeBlockClient.module.css";

export interface HighlightedFile {
  key: string;
  path?: string;
  language: string;
  /** raw text; what the copy button copies */
  content: string;
  highlighted: ReactNode;
}

interface CodeBlockClientProps {
  files: HighlightedFile[];
  className?: string;
}

function fileName(path: string) {
  return path.split("/").pop() ?? path;
}

export function CodeBlockClient({ files, className }: CodeBlockClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [wrap, setWrap] = useState(false);
  const [copied, setCopied] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);

  // files can shrink under a kept index (e.g. Fast Refresh preserving state)
  const active = files[activeIndex] ?? files[0];
  const isMultiFile = files.length > 1;

  // measure only while unwrapped; wrapped code never overflows
  useEffect(() => {
    const el = codeRef.current;
    if (!el || wrap) return;
    const check = () => setOverflows(el.scrollWidth > el.clientWidth);
    check();
    document.fonts.ready.then(check);
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [wrap, activeIndex]);

  async function copy() {
    await navigator.clipboard.writeText(active.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <figure className={cn(styles.block, className)} data-wrap={wrap}>
      <div className={styles.header}>
        <span className={styles.language}>{active.language}</span>
        {!isMultiFile && active.path && <span className={styles.path}>{active.path}</span>}

        <div className={styles.actions}>
          {(overflows || wrap) && (
            <Button
              variant="ghost"
              size="icon-sm"
              className={styles.action}
              aria-label="Toggle line wrap"
              aria-pressed={wrap}
              onClick={() => setWrap((value) => !value)}
            >
              <WrapText />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            className={styles.action}
            aria-label={copied ? "Copied" : "Copy code"}
            onClick={copy}
          >
            {copied ? <Check /> : <Copy />}
          </Button>
        </div>
      </div>

      {isMultiFile && (
        <div className={styles.tabs} role="tablist" aria-label="Files">
          {files.map((file, index) => (
            <button
              key={file.key}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              className={styles.tab}
              onClick={() => setActiveIndex(index)}
            >
              {file.path ? fileName(file.path) : `File ${index + 1}`}
            </button>
          ))}
        </div>
      )}

      <div className={styles.body}>
        {isMultiFile && (
          <nav className={styles.explorer} aria-label="Explorer">
            <span className={styles.explorerTitle}>Explorer</span>
            {files.map((file, index) => (
              <button
                key={file.key}
                type="button"
                aria-current={index === activeIndex ? "true" : undefined}
                className={styles.explorerItem}
                onClick={() => setActiveIndex(index)}
              >
                {file.path ?? `File ${index + 1}`}
              </button>
            ))}
          </nav>
        )}

        <div
          ref={codeRef}
          className={styles.code}
          role={isMultiFile ? "tabpanel" : undefined}
        >
          {active.highlighted}
        </div>
      </div>
    </figure>
  );
}
