"use client";

import { useEffect, useRef } from "react";
import styles from "./indent-trial.module.css";

// matches the gutter in CodeBlockClient.module.css: line number w-8 + mr-5
const GUTTER = "3.25rem";
// extra indent on continuation rows, so a wrapped piece doesn't read as a new line
const HANG_CH = 2;
// most of the block width a continuation row may be pushed in
const CAP = "40cqi";

/** Trial only: wraps a code block and gives each line's wrapped rows that line's own indentation. */
export function IndentTrial({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const pre = root.querySelector("pre");
    const tabSize = Number(pre ? getComputedStyle(pre).tabSize : 8) || 8;

    for (const line of root.querySelectorAll<HTMLElement>(".line")) {
      const leading = /^[ \t]*/.exec(line.textContent ?? "")?.[0] ?? "";
      const columns = [...leading].reduce((sum, c) => sum + (c === "\t" ? tabSize : 1), 0);
      const hang = `min(${columns + HANG_CH}ch, ${CAP})`;
      // inline, so it can't tie with the component's own .line rule
      line.style.paddingLeft = `calc(${GUTTER} + ${hang})`;
      line.style.textIndent = `calc(-1 * (${GUTTER} + ${hang}))`;
    }
  }, []);

  return (
    <div ref={ref} className={styles.trial}>
      {children}
    </div>
  );
}
