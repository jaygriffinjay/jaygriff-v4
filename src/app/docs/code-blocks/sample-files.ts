import type { CodeFile } from "@/components/code-block/types";

// dummy rows shaped like the future code_files table
export const sampleSnippet: CodeFile = {
  id: "file-1",
  path: "src/lib/greet.ts",
  language: "typescript",
  content: `export function greet(name: string): string {
  const time = new Date().getHours();
  const part = time < 12 ? "morning" : time < 18 ? "afternoon" : "evening";
  return "Good " + part + ", " + name + "!";
}
`,
};

export const sampleProject: CodeFile[] = [
  {
    id: "file-2",
    path: "src/components/counter/Counter.tsx",
    content: `"use client";

import { useState } from "react";
import styles from "./Counter.module.css";

export function Counter({ start = 0 }: { start?: number }) {
  const [count, setCount] = useState(start);

  return (
    <button className={styles.button} onClick={() => setCount((c) => c + 1)}>
      Clicked {count} {count === 1 ? "time" : "times"}
    </button>
  );
}
`,
  },
  {
    id: "file-3",
    path: "src/components/counter/Counter.module.css",
    content: `/* pill button that shows the click count */
.button {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  background: #58a6ff;
  color: #0d1117;
  font-weight: 600;
}
`,
  },
  {
    id: "file-4",
    path: "scripts/count_lines.py",
    content: `from pathlib import Path


def count_lines(root: str, suffix: str = ".tsx") -> int:
    """Count lines across every file with the given suffix."""
    return sum(
        len(path.read_text().splitlines())
        for path in Path(root).rglob(f"*{suffix}")
    )


if __name__ == "__main__":
    print(count_lines("src"))
`,
  },
];

export const longLineSample: CodeFile = {
  language: "bash",
  content: `npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --turbopack --skip-install
`,
};
