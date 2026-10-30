import { currentPath, getCurrentPage, titleFromPath } from "@/lib/page-meta";
import { BreadcrumbTrail, type Crumb } from "./breadcrumb-trail";
import { ReportCrumbs } from "./mobile-menu";

export type { Crumb };

// Without a row (e.g. a page added before syncing), build the trail from the URL
const crumbsFromPath = (path: string): Crumb[] =>
  path
    .split("/")
    .filter(Boolean)
    .map((_, i, segments) => {
      const crumbPath = "/" + segments.slice(0, i + 1).join("/");
      return { title: titleFromPath(crumbPath), path: crumbPath };
    });

/** Section › … › current page for the current URL, from its goatboat row. */
export async function getCrumbs(): Promise<Crumb[]> {
  const page = await getCurrentPage();
  return page?.breadcrumbs ?? crumbsFromPath(await currentPath());
}

/** The trail under the nav. */
export async function Breadcrumbs({ className }: { className?: string }) {
  const crumbs = await getCrumbs();
  return (
    <>
      <ReportCrumbs crumbs={crumbs} />
      <BreadcrumbTrail crumbs={crumbs} className={className} />
    </>
  );
}
