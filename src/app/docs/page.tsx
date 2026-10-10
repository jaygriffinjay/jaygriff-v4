import NextLink from "next/link";
import { H1, Paragraph } from "@/components/typography";
import { PageLayout } from "@/components/site/page-layout";
import styles from "./page.module.css";

const docs = [
  {
    href: "/docs/components",
    title: "Theme lab",
    description: "Color, link, card, and focus-ring experiments for the site theme.",
  },
  {
    href: "/docs/components/library",
    title: "Component library",
    description: "Every typography and shadcn component, rendered in the real theme.",
  },
  {
    href: "/docs/blues",
    title: "Blue tester",
    description: "Candidate blues side by side across headings, links, and text.",
  },
  {
    href: "/docs/code-blocks",
    title: "Code blocks",
    description: "The VS Code-style code block: snippets, multi-file tabs, explorer, wrap, copy.",
  },
  {
    href: "/docs/code-fonts",
    title: "Code fonts",
    description: "The same snippet at different sizes and in different monospace fonts.",
  },
  {
    href: "/docs/code-stress",
    title: "Code stress test",
    description: "Absurdly long identifiers, strings, paths, and files in inline code and code blocks.",
  },
];

export default function DocsPage() {
  return (
    <PageLayout>
      <H1 className={styles.title}>Docs</H1>
      <Paragraph className={styles.intro}>
        Internal pages for building and tuning the site.
      </Paragraph>

      <ul className={styles.list}>
        {docs.map((doc) => (
          <li key={doc.href}>
            <NextLink href={doc.href} className={styles.link}>
              {doc.title}
            </NextLink>
            <Paragraph className={styles.description}>{doc.description}</Paragraph>
          </li>
        ))}
      </ul>
    </PageLayout>
  );
}
