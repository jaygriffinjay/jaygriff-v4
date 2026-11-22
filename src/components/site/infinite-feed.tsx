"use client";

import { useCallback, useEffect, useRef, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CapsLabel } from "@/components/typography";
import { setInfiniteFeedCount, type FeedKey } from "./infinite-feed-actions";
import styles from "./infinite-feed.module.css";

type InfiniteFeedProps = {
  feedKey: FeedKey;
  loadedCount: number;
  maxCount: number;
  batchSize: number;
  autoLoad?: boolean;
  children: ReactNode;
};

/** Appends server-rendered feed batches manually or as an automatic scroll feed. */
export function InfiniteFeed({
  feedKey,
  loadedCount,
  maxCount,
  batchSize,
  autoLoad = false,
  children,
}: InfiniteFeedProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const requestedCount = useRef<number | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const maxLoadedCount = Math.min(maxCount, 500);
  const hasMore = loadedCount < maxLoadedCount;

  const loadMore = useCallback(() => {
    if (pending || requestedCount.current !== null || !hasMore) return;
    const nextCount = Math.min(loadedCount + batchSize, maxLoadedCount);
    if (nextCount <= loadedCount) return;
    requestedCount.current = nextCount;
    startTransition(async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 120));
        await setInfiniteFeedCount(feedKey, nextCount);
        router.refresh();
      } catch {
        requestedCount.current = null;
      }
    });
  }, [batchSize, feedKey, hasMore, loadedCount, maxLoadedCount, pending, router]);

  useEffect(() => {
    if (requestedCount.current !== null && requestedCount.current <= loadedCount) {
      requestedCount.current = null;
    }
  }, [loadedCount]);

  useEffect(() => {
    if (!autoLoad || !hasMore) return;

    let previousScrollY = window.scrollY;
    const loadWhenScrolledToEnd = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > previousScrollY;
      previousScrollY = currentScrollY;
      if (!scrollingDown) return;

      const target = sentinel.current;
      if (target && target.getBoundingClientRect().top <= window.innerHeight) loadMore();
    };

    window.addEventListener("scroll", loadWhenScrolledToEnd, { passive: true });
    return () => window.removeEventListener("scroll", loadWhenScrolledToEnd);
  }, [autoLoad, hasMore, loadMore]);

  return (
    <div className={styles.container}>
      {children}
      {autoLoad ? (
        hasMore && (
          <div
            ref={sentinel}
            className={pending ? styles.loading : styles.sentinel}
            role={pending ? "status" : undefined}
            aria-label={pending ? "Loading more posts" : undefined}
            aria-hidden={!pending}
          >
            {pending && <span aria-hidden className={styles.spinner} />}
          </div>
        )
      ) : (
        hasMore && (
          <div className={styles.controls}>
            <button type="button" onClick={loadMore} className={styles.button} disabled={pending}>
              <CapsLabel className={styles.label}>[LOAD MORE]</CapsLabel>
            </button>
          </div>
        )
      )}
    </div>
  );
}
