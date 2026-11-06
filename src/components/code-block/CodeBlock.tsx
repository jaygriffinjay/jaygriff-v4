import { highlight, resolveLanguage } from "./highlight";
import { CodeBlockClient, type HighlightedFile } from "./CodeBlockClient";
import type { CodeFile } from "./types";

type CodeBlockProps = {
  className?: string;
  /** Show the top bar with the language and path; without it, copy and wrap float over the code. Default true */
  header?: boolean;
  /** Show the line number gutter. Default true */
  lineNumbers?: boolean;
  /** Shrink the block to its code's width instead of filling the column */
  fit?: boolean;
} & (
  | { files: CodeFile[]; code?: never; language?: never; filename?: never }
  | { code: string; language?: string; filename?: string; files?: never }
);

/**
 * VS Code-style code block. Pass a single `code` string, or `files` for a
 * multi-file block (tabs on mobile, explorer on larger screens).
 */
export async function CodeBlock(props: CodeBlockProps) {
  const files: CodeFile[] =
    props.files ?? [{ path: props.filename, language: props.language, content: props.code }];

  const highlighted: HighlightedFile[] = await Promise.all(
    files.map(async (file, index) => {
      const content = file.content.replace(/\n$/, "");
      const language = resolveLanguage(file);
      return {
        key: file.id ?? file.path ?? String(index),
        path: file.path,
        language,
        content,
        highlighted: await highlight(content, language),
      };
    }),
  );

  return (
    <CodeBlockClient
      files={highlighted}
      className={props.className}
      header={props.header ?? true}
      lineNumbers={props.lineNumbers ?? true}
      fit={props.fit ?? false}
    />
  );
}
