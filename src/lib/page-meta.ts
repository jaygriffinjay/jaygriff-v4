import type { Metadata } from "next";
import { headers } from "next/headers";
import { getContentByPath, type ContentItem } from "@/lib/goatboat";

// Drafts only show in local dev; in production they don't exist
export const isVisible = (item: Pick<ContentItem, "status">) =>
  item.status === "published" || process.env.NODE_ENV === "development";

/** The URL path being rendered, set by src/proxy.ts. */
export async function currentPath() {
  return (await headers()).get("x-pathname") ?? "/";
}

/** The goatboat row for the current path, or null. Code pages are live whatever their status; markdown drafts aren't. */
export async function getCurrentPage() {
  const result = await getContentByPath(await currentPath());
  if (!result || "redirectTo" in result) return null;
  return result.item.source === "approute" || isVisible(result.item) ? result : null;
}

export const titleFromPath = (path: string) => {
  const slug = path.slice(path.lastIndexOf("/") + 1);
  return slug.charAt(0).toUpperCase() + slug.slice(1).replaceAll("-", " ");
};

const SITE_NAME = "Jay Griffin";

// Vercel sets the production domain; locally, links point at the dev server
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

/** Full SEO metadata for the current page, from its goatboat row. */
export async function currentPageMetadata(): Promise<Metadata> {
  const path = await currentPath();
  const page = await getCurrentPage();
  const base = { metadataBase: new URL(siteUrl), alternates: { canonical: path } };

  if (!page) {
    const title = path === "/" ? SITE_NAME : `${titleFromPath(path)} · ${SITE_NAME}`;
    return { ...base, title, openGraph: { title, url: path, siteName: SITE_NAME, type: "website" } };
  }

  const { item } = page;
  const title = `${item.title} · ${SITE_NAME}`;
  const description = item.description ?? undefined;
  const image = item.assets.find((a) => a.role === "hero") ?? item.assets.find((a) => a.role === "thumbnail");
  const images = image
    ? [{ url: image.url, alt: image.alt ?? item.title, width: image.width ?? undefined, height: image.height ?? undefined }]
    : undefined;
  const shared = { title, description, url: path, siteName: SITE_NAME, images };

  return {
    ...base,
    title,
    description,
    robots: item.status === "published" ? undefined : { index: false, follow: false },
    openGraph:
      item.type === "post"
        ? {
            ...shared,
            type: "article",
            publishedTime: item.publishedAt ?? undefined,
            modifiedTime: item.revisedAt ?? item.updatedAt,
            authors: item.authors ?? undefined,
            tags: item.tags ?? undefined,
          }
        : { ...shared, type: "website" },
    twitter: { card: images ? "summary_large_image" : "summary", title, description, images: images?.map((i) => i.url) },
  };
}
