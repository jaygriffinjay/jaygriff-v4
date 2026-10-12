import NextLink from "next/link";
import { H1, Paragraph } from "@/components/typography";
import { PageLayout } from "@/components/site/page-layout";
import { listTags } from "@/lib/goatboat";
import { tagHref } from "../_components/tag-links";
import styles from "./page.module.css";

export default async function TagsPage() {
  const tags = await listTags();

  return (
    <PageLayout>
      <H1 className={styles.title}>Tags</H1>
      <Paragraph className={styles.intro}>
        Every tag on published content, most used first. Each one links to its feed.
      </Paragraph>

      <ul className={styles.list}>
        {tags.map(({ tag, count }) => (
          <li key={tag}>
            <NextLink href={tagHref(tag)} className={styles.tag}>
              #{tag}
              <span className={styles.count}>{count}</span>
            </NextLink>
          </li>
        ))}
      </ul>
    </PageLayout>
  );
}
