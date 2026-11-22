"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearInfiniteFeedCounts } from "@/components/site/infinite-feed-actions";

export function useResetFeedCounts() {
  const pathname = usePathname();
  const router = useRouter();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;

    void clearInfiniteFeedCounts().then(() => router.refresh());
  }, [pathname, router]);
}