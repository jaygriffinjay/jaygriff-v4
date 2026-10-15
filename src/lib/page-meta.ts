import type { Metadata } from "next";
import { getContentByPath, type ContentItem } from "@/lib/goatboat";

// Drafts only show in local dev; in production they don't exist
export const isVisible = (item: Pick<ContentItem, "status">) =>
  item.status === "published" || process.env.NODE_ENV === "development";

/** The goatboat row for a code page, or null if it isn't synced yet. Repeated calls in one render share a fetch. */
export async function getPage(path: string) {
  const result = await getContentByPath(path);
  return result && !("redirectTo" in result) ? result : null;
}

export const titleFromPath = (path: string) => {
  const slug = path.slice(path.lastIndexOf("/") + 1);
  return slug.charAt(0).toUpperCase() + slug.slice(1).replaceAll("-", " ");
};

/** Title and description for a code page's <head>, from its goatboat row. */
export async function pageMetadata(path: string): Promise<Metadata> {
  const page = await getPage(path);
  if (!page) return { title: titleFromPath(path) };
  return { title: page.item.title, description: page.item.description ?? undefined };
}
