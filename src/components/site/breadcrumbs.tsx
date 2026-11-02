import { getCurrentDocs } from "@/lib/docs";
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

/** Section › … › current page for the current URL, from its goatboat row. A docs page's trail is Projects › project › Docs › section › page. */
export async function getCrumbs(): Promise<Crumb[]> {
  const docs = await getCurrentDocs();
  if (docs) {
    const { nav, item } = docs;
    const section = nav.sections.find((s) => s.slug === item.section?.slug);
    return [
      { title: "Projects", path: "/projects" },
      { title: nav.project.title, path: `/projects/${nav.project.slug}` },
      { title: "Docs", path: `/projects/${nav.project.slug}/docs` },
      ...(section ? [{ title: section.title, path: section.pages[0].path }] : []),
      { title: item.title, path: item.path },
    ];
  }
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
