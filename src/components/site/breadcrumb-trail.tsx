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
import { cn } from "@/lib/utils";
import { BreadcrumbOverflow } from "./breadcrumb-overflow";
import styles from "./breadcrumbs.module.css";

// More crumbs than this and the middle ones fold into "…"
const MAX_CRUMBS = 3;

export type Crumb = { title: string; path: string };

/** Section › … › current page. The nav already shows Home and the section, so top-level pages get no trail. */
export function BreadcrumbTrail({ crumbs, className }: { crumbs: Crumb[]; className?: string }) {
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
