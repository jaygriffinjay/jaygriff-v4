import { Suspense } from "react";
import { Muted } from "@/components/typography";
import { Feed } from "@/components/site/feed";
import { HomeProfile, HomeProfileSimulation } from "@/components/site/home-profile";
import { HomeFeed } from "@/components/site/home-feed";
import { HomeFeedControls } from "@/components/site/home-feed-controls";
import { InfiniteFeed } from "@/components/site/infinite-feed";
import { PageLayout } from "@/components/site/page-layout";
import { ProjectEntry } from "@/components/site/project-entry";
import { getContentByPath, getHomeFeed, listFeed, listNotes, listProjects } from "@/lib/goatboat";
import type { FeedItem, NoteListItem } from "@/lib/goatboat";
import type { FeedKey, HomeFeedFilter, HomeFeedSort } from "@/components/site/infinite-feed-actions";
import { isVisible } from "@/lib/page-meta";
import { cookies } from "next/headers";
import styles from "./page.module.css";

const COOL_BATCH_SIZE = 10;
const FEED_BATCH_SIZE = 20;
const MAX_FEED_COUNT = 500;
const filters: HomeFeedFilter[] = ["cool", "all", "projects", "posts", "notes"];

const BANNER_PATH = "/artifacts/home-profile-field";

/** Where the banner artifact's html file is hosted, or null when it isn't published (or goatboat can't be reached). */
async function getBannerUrl() {
  const page = await getContentByPath(BANNER_PATH).catch((error) => {
    console.error(error);
    return null;
  });
  if (!page || "redirectTo" in page || !isVisible(page.item)) return null;
  return page.item.assets.find((a) => a.kind === "html" && a.role === "hero")?.url ?? null;
}

function parseFilter(value?: string): HomeFeedFilter {
  return filters.includes(value as HomeFeedFilter) ? (value as HomeFeedFilter) : "cool";
}

function parseSort(value?: string): HomeFeedSort {
  return value === "oldest" ? "oldest" : "latest";
}

function noteAsFeedItem(note: NoteListItem): FeedItem {
  return {
    id: note.path,
    slug: note.path.split("/").filter(Boolean).at(-1) ?? note.path,
    path: note.path,
    type: "page",
    title: note.title,
    description: note.description,
    publishedAt: note.publishedAt,
    tags: note.tags,
    targetUrl: null,
    viaName: null,
    cover: null,
  };
}

async function LatestFeed({ filter, sort }: { filter: HomeFeedFilter; sort: HomeFeedSort }) {
  const cookieStore = await cookies();
  const feedKey: FeedKey = filter === "cool" ? "home" : filter === "all" ? "new" : filter;
  const batchSize = filter === "cool" ? COOL_BATCH_SIZE : FEED_BATCH_SIZE;
  const savedCount = Number(cookieStore.get(`load-more-feed-${feedKey}`)?.value);
  const loadedCount =
    Number.isInteger(savedCount) && savedCount >= batchSize
      ? Math.min(savedCount, MAX_FEED_COUNT)
      : batchSize;

  if (filter === "cool") {
    const coolFeed = await getHomeFeed(loadedCount, sort).catch((error) => {
      console.error(error);
      return { items: [], hasMore: false };
    });
    if (!coolFeed.items.length) return null;

    return (
      <InfiniteFeed
        feedKey={feedKey}
        loadedCount={loadedCount}
        maxCount={coolFeed.hasMore ? Math.min(loadedCount + batchSize, MAX_FEED_COUNT) : loadedCount}
        batchSize={batchSize}
        autoLoad
      >
        <HomeFeed items={coolFeed.items} sort={sort} className={styles.feed} />
        {!coolFeed.hasMore && (
          <Muted className={styles.feedEnd}>
            You've reached the end! That's all the cool stuff I have.
          </Muted>
        )}
      </InfiniteFeed>
    );
  }

  if (filter === "projects") {
    const projects = (await listProjects())
      .filter(isVisible)
      .sort((a, b) =>
        sort === "oldest"
          ? a.createdAt.localeCompare(b.createdAt)
          : b.createdAt.localeCompare(a.createdAt),
      );
    const maxCount = Math.min(projects.length, MAX_FEED_COUNT);
    const visibleProjects = projects.slice(0, Math.min(loadedCount, maxCount));

    return (
      <InfiniteFeed
        feedKey={feedKey}
        loadedCount={Math.min(loadedCount, maxCount)}
        maxCount={maxCount}
        batchSize={batchSize}
        autoLoad
      >
        {visibleProjects.length ? (
          <ul className={styles.projects}>
            {visibleProjects.map((project) => (
              <ProjectEntry key={project.id} project={project} />
            ))}
          </ul>
        ) : (
          <Muted className={styles.feedEnd}>Nothing here yet.</Muted>
        )}
      </InfiniteFeed>
    );
  }

  if (filter === "notes") {
    const notes = (await listNotes()).sort((left, right) =>
      sort === "oldest"
        ? (left.publishedAt ?? "").localeCompare(right.publishedAt ?? "")
        : (right.publishedAt ?? "").localeCompare(left.publishedAt ?? ""),
    );
    const maxCount = Math.min(notes.length, MAX_FEED_COUNT);
    const visibleCount = Math.min(loadedCount, maxCount);
    const feedItems = notes.slice(0, visibleCount).map(noteAsFeedItem);

    return (
      <InfiniteFeed
        feedKey={feedKey}
        loadedCount={visibleCount}
        maxCount={maxCount}
        batchSize={batchSize}
        autoLoad
      >
        <Feed items={feedItems} className={styles.feed} />
        {notes.length > 0 && notes.length <= MAX_FEED_COUNT && feedItems.length >= notes.length && (
          <Muted className={styles.feedEnd}>You've reached the end of your notes.</Muted>
        )}
      </InfiniteFeed>
    );
  }

  const type = filter === "posts" ? "post" : "all";
  const feed = await listFeed({
    type,
    hideStructure: true,
    sort,
    limit: loadedCount,
  });
  const maxCount = Math.min(feed.total, MAX_FEED_COUNT);
  return (
    <InfiniteFeed
      feedKey={feedKey}
      loadedCount={Math.min(loadedCount, maxCount)}
      maxCount={maxCount}
      batchSize={batchSize}
      autoLoad
    >
      <Feed items={feed.items} className={styles.feed} />
      {feed.total > 0 && feed.total <= MAX_FEED_COUNT && feed.items.length >= feed.total && (
        <Muted className={styles.feedEnd}>You've reached the end of everything.</Muted>
      )}
    </InfiniteFeed>
  );
}

export default async function Home() {
  const cookieStore = await cookies();
  const activeFilter = parseFilter(cookieStore.get("home-feed-filter")?.value);
  const activeSort = parseSort(cookieStore.get("home-feed-sort")?.value);
  const taglineDismissed = cookieStore.has("home-tagline-dismissed");
  const bannerUrl = await getBannerUrl();

  return (
    <PageLayout
      background={
        bannerUrl ? <HomeProfileSimulation src={bannerUrl} /> : null
      }
      hideNav
      hideRelated
      hideToc
      className={styles.pageLayout}
    >
      <HomeProfile showTagline={!taglineDismissed} />
      <section aria-label="Home feed">
        <HomeFeedControls activeFilter={activeFilter} activeSort={activeSort}>
          <Suspense fallback={null}>
            <LatestFeed filter={activeFilter} sort={activeSort} />
          </Suspense>
        </HomeFeedControls>
      </section>
    </PageLayout>
  );
}
