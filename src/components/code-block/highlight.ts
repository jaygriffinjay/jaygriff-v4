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
// the browser's default tab-size, which the code block doesn't change
const TAB_SIZE = 8;

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

  const sourceLines = code.split(/\r?\n/);
  const hast = highlighter.codeToHast(code, {
    lang,
    theme: THEME,
    transformers: [
      {
        // each line's indentation in columns, so wrapped rows can hang at it (see .line in CodeBlockClient.module.css)
        line(node, lineNumber) {
          const leading = /^[ \t]*/.exec(sourceLines[lineNumber - 1] ?? "")?.[0] ?? "";
          const columns = [...leading].reduce((sum, c) => sum + (c === "\t" ? TAB_SIZE : 1), 0);
          if (columns) node.properties.style = `--indent:${columns}`;
        },
      },
    ],
  });
  return toJsxRuntime(hast, { Fragment, jsx, jsxs }) as ReactNode;
}
