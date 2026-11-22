import { Suspense } from "react";
import { H2, Paragraph, Title } from "@/components/typography";
import { HomeFeed } from "@/components/site/home-feed";
import { InfiniteFeed } from "@/components/site/infinite-feed";
import { PageLayout } from "@/components/site/page-layout";
import { MainAside } from "@/components/site/main-aside";
import { getHomeFeed } from "@/lib/goatboat";
import { cookies } from "next/headers";
import styles from "./page.module.css";

const FEED_BATCH_SIZE = 10;
const MAX_FEED_COUNT = 500;

async function LatestFeed() {
  const cookieStore = await cookies();
  const savedCount = Number(cookieStore.get("load-more-feed-home")?.value);
  const loadedCount =
    Number.isInteger(savedCount) && savedCount >= FEED_BATCH_SIZE
      ? Math.min(savedCount, MAX_FEED_COUNT)
      : FEED_BATCH_SIZE;
  // The feed is an extra, so the intro still shows if goatboat is down
  const latest = await getHomeFeed(loadedCount).catch((err) => {
    console.error(err);
    return { items: [], hasMore: false };
  });
  if (!latest.items.length) return null;

  return (
    <InfiniteFeed
      feedKey="home"
      loadedCount={loadedCount}
      maxCount={latest.hasMore ? Math.min(loadedCount + FEED_BATCH_SIZE, MAX_FEED_COUNT) : loadedCount}
      batchSize={FEED_BATCH_SIZE}
      autoLoad
    >
      <HomeFeed items={latest.items} className={styles.feed} />
    </InfiniteFeed>
  );
}

export default function Home() {
  return (
    <PageLayout aside={<MainAside />} hideRelated>
      <article className={styles.article}>
        <Title>Hi, I'm Jay</Title>
        <Paragraph>
          Welcome to my website where I do my work and publish it too! On here I document my development work, share my thoughts, and maybe even post some personal stuff.
        </Paragraph>
      </article>
      <section aria-labelledby="latest-heading" className={styles.latest}>
        <H2 id="latest-heading" className={styles.latestHeading}>
          Latest
        </H2>
        <Suspense fallback={null}>
          <LatestFeed />
        </Suspense>
      </section>
    </PageLayout>
  );
}
