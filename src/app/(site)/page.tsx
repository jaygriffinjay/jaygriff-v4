import { H2, Paragraph, Title } from "@/components/typography";
import { HomeFeed } from "@/components/site/home-feed";
import { PageLayout } from "@/components/site/page-layout";
import { MainAside } from "@/components/site/main-aside";
import { StepLink, StepLinks } from "@/components/site/step-links";
import { getContentByPath, listContent, type ContentItem } from "@/lib/goatboat";
import styles from "./page.module.css";

const LATEST = 10;

/** The newest content as full pages, so each entry has its body, project, authors and picture. Pages stay out of the feed, except those tagged showcase. */
async function latestPages() {
  const [feed, showcase] = await Promise.all([
    listContent({ limit: LATEST }),
    listContent({ type: "page", tag: "showcase", limit: LATEST }),
  ]);
  const newest = [...feed, ...showcase]
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .slice(0, LATEST);
  const pages = await Promise.all(newest.map((item) => getContentByPath(item.path)));
  return pages.flatMap((page): ContentItem[] => (page && !("redirectTo" in page) ? [page.item] : []));
}

export default async function Home() {
  // The feed is an extra, so the intro still shows if goatboat is down
  const latest = await latestPages().catch((err) => {
    console.error(err);
    return [];
  });

  return (
    <PageLayout aside={<MainAside />} hideRelated>
      <article className={styles.article}>
        <Title>Hi, I'm Jay</Title>
        <Paragraph>
          Welcome to my website where I do my work and publish it too! On here I document my development work, share my thoughts, and maybe even post some personal stuff.
        </Paragraph>
      </article>
      {latest.length > 0 && (
        <section aria-labelledby="latest-heading" className={styles.latest}>
          <H2 id="latest-heading" className={styles.latestHeading}>
            Latest
          </H2>
          <HomeFeed items={latest} className={styles.feed} />
          <StepLinks className={styles.more}>
            <StepLink direction="next" href="/new" label="The full feed" title="Everything new" />
          </StepLinks>
        </section>
      )}
    </PageLayout>
  );
}
