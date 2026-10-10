/** One file shown in a code block. Mirrors the future database row. */
export interface CodeFile {
  id?: string;
  /** e.g. "src/app/page.tsx"; shown in tabs and the explorer */
  path?: string;
  /** Shiki language id; inferred from the path's extension when omitted */
  language?: string;
  content: string;
}
