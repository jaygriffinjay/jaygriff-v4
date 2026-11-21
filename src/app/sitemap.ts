import type { MetadataRoute } from "next";
import { listTree } from "@/lib/goatboat";
import { siteUrl } from "@/lib/page-meta";

export const revalidate = 3600;

/** The home page and every published page in goatboat's tree, except the test pages. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tree = await listTree().catch(() => []);
  const paths = tree.filter((node) => node.status === "published" && !node.path.startsWith("/tests")).map((node) => node.path);
  return [...new Set(["/", ...paths])].map((path) => ({ url: path === "/" ? siteUrl : `${siteUrl}${path}` }));
}
