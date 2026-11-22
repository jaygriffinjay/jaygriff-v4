"use server";

import { cookies } from "next/headers";

export type FeedKey = "home" | "new";

export async function setInfiniteFeedCount(feedKey: FeedKey, count: number) {
  if (!Number.isInteger(count) || count < 0 || count > 500) return;

  const cookieStore = await cookies();
  cookieStore.set(`load-more-feed-${feedKey}`, String(count), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function clearInfiniteFeedCounts() {
  const cookieStore = await cookies();
  cookieStore.delete("load-more-feed-home");
  cookieStore.delete("load-more-feed-new");
}