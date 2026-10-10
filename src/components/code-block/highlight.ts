import type { ReactNode } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import {
  bundledLanguages,
  createHighlighter,
  type BundledLanguage,
  type Highlighter,
} from "shiki";
import type { CodeFile } from "./types";

const THEME = "dark-plus";

const EXTENSION_LANGUAGES: Record<string, string> = {
  ts: "typescript",
  tsx: "tsx",
  js: "javascript",
  jsx: "jsx",
  mjs: "javascript",
  css: "css",
  json: "json",
  md: "markdown",
  mdx: "mdx",
  html: "html",
  py: "python",
  sh: "bash",
  sql: "sql",
  yml: "yaml",
  yaml: "yaml",
};

// one highlighter per server process; languages are loaded on first use
let highlighterPromise: Promise<Highlighter> | undefined;

function getHighlighter() {
  highlighterPromise ??= createHighlighter({ themes: [THEME], langs: [] });
  return highlighterPromise;
}

export function resolveLanguage(file: CodeFile): string {
  const extension = file.path?.split(".").pop()?.toLowerCase() ?? "";
  return file.language ?? EXTENSION_LANGUAGES[extension] ?? "text";
}

export async function highlight(code: string, language: string): Promise<ReactNode> {
  const highlighter = await getHighlighter();
  const lang = language in bundledLanguages ? (language as BundledLanguage) : "text";

  if (lang !== "text" && !highlighter.getLoadedLanguages().includes(lang)) {
    await highlighter.loadLanguage(lang);
  }

  const hast = highlighter.codeToHast(code, { lang, theme: THEME });
  return toJsxRuntime(hast, { Fragment, jsx, jsxs }) as ReactNode;
}
