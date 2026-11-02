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
import styles from "./breadcrumbs.module.css";

export type Crumb = { title: string; path: string };

/** Section › … › current page, in full. The nav already shows Home and the section, so top-level pages get no trail. */
export function BreadcrumbTrail({ crumbs, className }: { crumbs: Crumb[]; className?: string }) {
  if (crumbs.length < 2) return null;

  return (
    <Breadcrumb className={cn(styles.breadcrumbs, className)}>
      <BreadcrumbList className={styles.list}>
        {crumbs.map((crumb, i) => (
          <Fragment key={`${i}-${crumb.path}`}>
            {i > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {i === crumbs.length - 1 ? (
                <BreadcrumbPage className={styles.current}>{crumb.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink render={<NextLink href={crumb.path} />}>{crumb.title}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
