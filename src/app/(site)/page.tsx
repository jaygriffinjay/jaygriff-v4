import { H2, Paragraph, Title } from "@/components/typography";
import { HomeFeed } from "@/components/site/home-feed";
import { InfiniteFeed } from "@/components/site/infinite-feed";
import { PageLayout } from "@/components/site/page-layout";
import { MainAside } from "@/components/site/main-aside";
import { StepLink, StepLinks } from "@/components/site/step-links";
import { cookies } from "next/headers";
import { getContentByPath, listFeed, type ContentItem } from "@/lib/goatboat";
import styles from "./page.module.css";

const LATEST = 10;

/** The newest content as full pages, so each entry has its body, project, authors and picture. Pages stay out of the feed, except those tagged showcase. */
async function latestPages(limit: number) {
  const [feed, showcase] = await Promise.all([
    listFeed({ limit }),
    listFeed({ type: "page", tag: "showcase", limit }),
  ]);
  const newest = [...new Map([...feed.items, ...showcase.items].map((item) => [item.id, item])).values()]
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .slice(0, limit);
  const pages = await Promise.all(newest.map((item) => getContentByPath(item.path)));
  return {
    items: pages.flatMap((page): ContentItem[] => (page && !("redirectTo" in page) ? [page.item] : [])),
    total: feed.total + showcase.total,
  };
}

export default async function Home() {
  const cookieStore = await cookies();
  const loaded = Number(cookieStore.get("load-more-feed-home")?.value);
  const loadedCount = Number.isInteger(loaded) && loaded >= LATEST ? Math.min(loaded, 500) : LATEST;
  // The feed is an extra, so the intro still shows if goatboat is down
  const latest = await latestPages(loadedCount).catch((err) => {
    console.error(err);
    return { items: [], total: 0 };
  });

  return (
    <PageLayout aside={<MainAside />} hideRelated>
      <article className={styles.article}>
        <Title>Hi, I'm Jay</Title>
        <Paragraph>
          Welcome to my website where I do my work and publish it too! On here I document my development work, share my thoughts, and maybe even post some personal stuff.
        </Paragraph>
      </article>
      {latest.items.length > 0 && (
        <section aria-labelledby="latest-heading" className={styles.latest}>
          <H2 id="latest-heading" className={styles.latestHeading}>
            Latest
          </H2>
          <InfiniteFeed
            feedKey="home"
            loadedCount={Math.min(loadedCount, latest.total)}
            maxCount={latest.total}
            batchSize={LATEST}
          >
            <HomeFeed items={latest.items} className={styles.feed} />
            <StepLinks className={styles.more}>
              <StepLink direction="next" href="/new" label="The full feed" title="Everything new" />
            </StepLinks>
          </InfiniteFeed>
        </section>
      )}
    </PageLayout>
  );
}
