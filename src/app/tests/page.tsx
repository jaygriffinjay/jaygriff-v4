import NextLink from "next/link";
import { H1, Paragraph } from "@/components/typography";
import { PageLayout } from "@/components/site/page-layout";
import styles from "./page.module.css";

const tests = [
  {
    href: "/tests/feed",
    title: "Content feed",
    description: "Every published item from the database, newest first, filterable by type.",
  },
  {
    href: "/tests/feed?type=post",
    title: "Posts feed",
    description: "Only posts: md, mdx and component formats.",
  },
  {
    href: "/tests/feed?type=link",
    title: "Links feed",
    description: "Link posts with their target URL and via credit.",
  },
  {
    href: "/tests/feed?type=image",
    title: "Images feed",
    description: "Image posts with their hero asset.",
  },
  {
    href: "/tests/tags",
    title: "Tags",
    description: "Every tag with its count. Each links to the feed filtered by that tag.",
  },
  {
    href: "/tests/projects",
    title: "Projects",
    description: "Every project and experiment, any status, with kind and status shown.",
  },
  {
    href: "/tests/tree",
    title: "Content tree",
    description: "Every node nested under its parent. Paths, and so URLs, come from this tree.",
  },
  {
    href: "/tests/content/docs/guides/linking",
    title: "A deep docs page",
    description: "Breadcrumbs from the ancestor query, and the stored table of contents.",
  },
];

export default function TestsPage() {
  return (
    <PageLayout>
      <H1 className={styles.title}>Tests</H1>
      <Paragraph className={styles.intro}>
        Pages that read from the content database, for checking the schema and queries.
      </Paragraph>

      <ul className={styles.list}>
        {tests.map((test) => (
          <li key={test.href}>
            <NextLink href={test.href} className={styles.link}>
              {test.title}
            </NextLink>
            <Paragraph className={styles.description}>{test.description}</Paragraph>
          </li>
        ))}
      </ul>
    </PageLayout>
  );
}
