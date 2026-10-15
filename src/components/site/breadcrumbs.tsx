import { Fragment } from "react";
import NextLink from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { currentPath, getCurrentPage, titleFromPath } from "@/lib/page-meta";
import { cn } from "@/lib/utils";
import { BreadcrumbOverflow } from "./breadcrumb-overflow";
import styles from "./breadcrumbs.module.css";

// More crumbs than this and the middle ones fold into "…"
const MAX_CRUMBS = 3;

export type Crumb = { title: string; path: string };

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

/** The trail under the nav. The nav already shows Home and the section, so top-level pages get no trail. */
export async function Breadcrumbs({ className }: { className?: string }) {
  const crumbs = await getCrumbs();
  if (crumbs.length < 2) return null;

  const hidden = crumbs.length > MAX_CRUMBS ? crumbs.slice(1, -2) : [];
  const shown = hidden.length ? [crumbs[0], ...crumbs.slice(-2)] : crumbs;

  return (
    <Breadcrumb className={cn(styles.breadcrumbs, className)}>
      <BreadcrumbList className={styles.list}>
        {shown.map((crumb, i) => (
          <Fragment key={crumb.path}>
            {i > 0 && <BreadcrumbSeparator />}
            {i === 1 && hidden.length > 0 && (
              <>
                <BreadcrumbItem className={styles.overflow}>
                  <BreadcrumbOverflow crumbs={hidden} />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              {i === shown.length - 1 ? (
                <BreadcrumbPage className={styles.title} title={crumb.title}>
                  {crumb.title}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink className={styles.title} title={crumb.title} render={<NextLink href={crumb.path} />}>
                  {crumb.title}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
