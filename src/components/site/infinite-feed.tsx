"use client";

import { useEffect, useRef, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CapsLabel } from "@/components/typography";
import { setInfiniteFeedCount, type FeedKey } from "./infinite-feed-actions";
import styles from "./infinite-feed.module.css";

type InfiniteFeedProps = {
  feedKey: FeedKey;
  loadedCount: number;
  maxCount: number;
  batchSize: number;
  children: ReactNode;
};

/** Keeps the server-rendered feed and appends one batch when LOAD MORE is pressed. */
export function InfiniteFeed({
  feedKey,
  loadedCount,
  maxCount,
  batchSize,
  children,
}: InfiniteFeedProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const requestedCount = useRef<number | null>(null);
  const maxLoadedCount = Math.min(maxCount, 500);
  const hasMore = loadedCount < maxLoadedCount;

  const loadMore = () => {
    if (pending || requestedCount.current !== null || !hasMore) return;
    const nextCount = Math.min(loadedCount + batchSize, maxLoadedCount);
    if (nextCount <= loadedCount) return;
    requestedCount.current = nextCount;
    startTransition(() => {
      void setInfiniteFeedCount(feedKey, nextCount)
        .then(() => router.refresh())
        .catch(() => {
          requestedCount.current = null;
        });
    });
  };

  useEffect(() => {
    if (requestedCount.current === loadedCount) requestedCount.current = null;
  }, [loadedCount]);

  return (
    <div className={styles.container}>
      {children}
      {hasMore && (
        <div className={styles.controls}>
          <button type="button" onClick={loadMore} className={styles.button} disabled={pending}>
            <CapsLabel className={styles.label}>[LOAD MORE]</CapsLabel>
          </button>
        </div>
      )}
    </div>
  );
}
