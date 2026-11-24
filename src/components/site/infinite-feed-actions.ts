"use server";

import { cookies } from "next/headers";

export type FeedKey = "home" | "new" | "projects" | "pages" | "posts" | "notes";
export type HomeFeedFilter = "cool" | "all" | "projects" | "pages" | "posts" | "notes";
export type HomeFeedSort = "latest" | "oldest";

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
  cookieStore.delete("load-more-feed-projects");
  cookieStore.delete("load-more-feed-pages");
  cookieStore.delete("load-more-feed-posts");
  cookieStore.delete("load-more-feed-notes");
  cookieStore.delete("home-feed-filter");
  cookieStore.delete("home-feed-sort");
  cookieStore.delete("home-feed-tab");
}

export async function setHomeFeedPreferences(filter: HomeFeedFilter, sort: HomeFeedSort) {
  const filters: HomeFeedFilter[] = ["cool", "all", "projects", "pages", "posts", "notes"];
  const sorts: HomeFeedSort[] = ["latest", "oldest"];
  if (!filters.includes(filter) || !sorts.includes(sort)) return;

  const cookieStore = await cookies();
  const options = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
  cookieStore.set("home-feed-filter", filter, options);
  cookieStore.set("home-feed-sort", sort, options);
}

export async function dismissHomeTagline() {
  const cookieStore = await cookies();
  cookieStore.set("home-tagline-dismissed", "1", {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365 * 10,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}