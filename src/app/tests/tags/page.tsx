import NextLink from "next/link";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { listTags } from "@/lib/goatboat";
import { tagHref } from "../_components/tag-links";
import styles from "./page.module.css";

export default async function TagsPage() {
  const tags = await listTags();

  return (
    <PageLayout>
      <PageHeader />

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
