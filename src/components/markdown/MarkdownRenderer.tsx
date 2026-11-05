import NextLink from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Element, ElementContent } from "hast";
import { CodeBlock } from "@/components/code-block/CodeBlock";
import {
  Blockquote,
  Bold,
  H2,
  H3,
  H4,
  H5,
  H6,
  InlineCode,
  Italic,
  List,
  ListItem,
  Paragraph,
  Strikethrough,
} from "@/components/typography";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { slugifyHeading } from "@/lib/slugify-heading";
import styles from "./MarkdownRenderer.module.css";

function textOf(node: Element | ElementContent | undefined): string {
  if (!node) return "";
  if (node.type === "text") return node.value;
  return "children" in node ? node.children.map(textOf).join("") : "";
}

function createComponents(): Components {
  // Duplicate headings get -1, -2, … like goatboat's TOC
  const seen = new Map<string, number>();
  const headingId = (node: Element | undefined) => {
    const base = slugifyHeading(textOf(node));
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count ? `${base}-${count}` : base;
  };

  return {
    h1: ({ node, children }) => <H2 id={headingId(node)}>{children}</H2>,
    h2: ({ node, children }) => <H2 id={headingId(node)}>{children}</H2>,
    h3: ({ node, children }) => <H3 id={headingId(node)}>{children}</H3>,
    h4: ({ node, children }) => <H4 id={headingId(node)}>{children}</H4>,
    h5: ({ node, children }) => <H5 id={headingId(node)}>{children}</H5>,
    h6: ({ node, children }) => <H6 id={headingId(node)}>{children}</H6>,
    p: ({ children }) => <Paragraph>{children}</Paragraph>,
    ul: ({ children }) => <List>{children}</List>,
    ol: ({ children }) => <List ordered>{children}</List>,
    li: ({ children }) => <ListItem>{children}</ListItem>,
    strong: ({ children }) => <Bold>{children}</Bold>,
    em: ({ children }) => <Italic>{children}</Italic>,
    del: ({ children }) => <Strikethrough>{children}</Strikethrough>,
    blockquote: ({ children }) => <Blockquote>{children}</Blockquote>,
    code: ({ children }) => <InlineCode>{children}</InlineCode>,
    pre: ({ node }) => {
      const code = node?.children[0];
      if (code?.type !== "element") return null;
      const classes = (code.properties.className as string[] | undefined) ?? [];
      const language = classes.find((c) => c.startsWith("language-"))?.slice("language-".length);
      return <CodeBlock code={textOf(code).replace(/\n$/, "")} language={language} />;
    },
    a: ({ node, href = "", children }) => {
      // A link that is only inline code looks like plain code, so it gets an underline; mixed text doesn't
      const only = node?.children.length === 1 ? node.children[0] : null;
      const codeOnly = only?.type === "element" && only.tagName === "code";
      return href.startsWith("/") || href.startsWith("#") ? (
        <NextLink href={href} className={styles.link} data-code-only={codeOnly || undefined}>
          {children}
        </NextLink>
      ) : (
        <a href={href} className={styles.link} data-code-only={codeOnly || undefined}>
          {children}
        </a>
      );
    },
    table: ({ children }) => <Table>{children}</Table>,
    thead: ({ children }) => <TableHeader>{children}</TableHeader>,
    tbody: ({ children }) => <TableBody>{children}</TableBody>,
    tr: ({ children }) => <TableRow>{children}</TableRow>,
    th: ({ children }) => <TableHead>{children}</TableHead>,
    td: ({ children }) => <TableCell className={styles.cell}>{children}</TableCell>,
    hr: () => <hr className={styles.rule} />,
    img: ({ src, alt }) => (typeof src === "string" ? <img src={src} alt={alt ?? ""} className={styles.image} /> : null),
  };
}

/** Renders a markdown body with the site's own components, as direct children of the page's PageBody. Raw HTML in the source is dropped. */
export function MarkdownRenderer({ source }: { source: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={createComponents()} skipHtml>
      {source}
    </ReactMarkdown>
  );
}
