"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Copy, WrapText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  header: boolean;
  lineNumbers: boolean;
  fit: boolean;
}

function fileName(path: string) {
  return path.split("/").pop() ?? path;
}

/** Shows a file's full path in a tooltip just under the cursor, after a pause like VS Code's so moving across the list doesn't flash one per file. */
function PathTip({ path, element }: { path?: string; element: React.ReactElement }) {
  if (!path) return element;
  return (
    <Tooltip trackCursorAxis="both">
      <TooltipTrigger delay={1000} render={element} />
      <TooltipContent side="bottom" align="start" sideOffset={16}>{path}</TooltipContent>
    </Tooltip>
  );
}

export function CodeBlockClient({ files, className, header, lineNumbers, fit }: CodeBlockClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [wrap, setWrap] = useState(false);
  const [copied, setCopied] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const [more, setMore] = useState({ left: false, right: false });
  const codeRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

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

  // which ends of the file strip have files scrolled out of view, so those edges can fade
  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const check = () =>
      setMore({
        left: el.scrollLeft > 1,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
      });
    check();
    el.addEventListener("scroll", check, { passive: true });
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", check);
      observer.disconnect();
    };
  }, [isMultiFile]);

  async function copy() {
    await navigator.clipboard.writeText(active.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const actions = (
    <div className={header ? styles.actions : styles.floatingActions}>
      <Button
        variant="ghost"
        size="icon-sm"
        className={styles.action}
        aria-label={copied ? "Copied" : "Copy code"}
        onClick={copy}
      >
        {copied ? <Check /> : <Copy />}
      </Button>
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
    </div>
  );

  return (
    // Its own provider with no grace period: by default, once one tooltip has shown, the next opens instantly
    <TooltipProvider timeout={0}>
    <figure
      className={cn(styles.block, className)}
      data-wrap={wrap}
      data-header={header}
      data-wrap-button={overflows || wrap}
      data-line-numbers={lineNumbers}
      data-fit={fit}
    >
      {header ? (
        <div className={styles.header}>
          <span className={styles.language}>{active.language}</span>
          {active.path && <PathTip path={active.path} element={<span className={styles.path}>{active.path}</span>} />}
          {actions}
        </div>
      ) : (
        actions
      )}

      {isMultiFile && (
        <div
          ref={tabsRef}
          className={styles.tabs}
          role="tablist"
          aria-label="Files"
          data-more-left={more.left}
          data-more-right={more.right}
        >
          {files.map((file, index) => (
            <PathTip
              key={file.key}
              path={file.path}
              element={
                <button
                  type="button"
                  role="tab"
                  aria-selected={index === activeIndex}
                  className={styles.tab}
                  onClick={() => setActiveIndex(index)}
                >
                  {file.path ? fileName(file.path) : `File ${index + 1}`}
                </button>
              }
            />
          ))}
        </div>
      )}

      <div className={styles.body}>
        {isMultiFile && (
          <nav className={styles.explorer} aria-label="Explorer">
            {files.map((file, index) => (
              <PathTip
                key={file.key}
                path={file.path}
                element={
                  <button
                    type="button"
                    aria-current={index === activeIndex ? "true" : undefined}
                    className={styles.explorerItem}
                    onClick={() => setActiveIndex(index)}
                  >
                    {file.path ?? `File ${index + 1}`}
                  </button>
                }
              />
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
    </TooltipProvider>
  );
}
