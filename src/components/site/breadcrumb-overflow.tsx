"use client";

import NextLink from "next/link";
import { BreadcrumbEllipsis } from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import styles from "./breadcrumb-overflow.module.css";

type Crumb = { title: string; path: string };

/** The "…" in a collapsed trail; opens a menu of the pages it hides. */
export function BreadcrumbOverflow({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={styles.trigger} aria-label="Show hidden pages">
        <BreadcrumbEllipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className={styles.menu}>
        {crumbs.map((crumb) => (
          <DropdownMenuItem key={crumb.path} className={styles.item} title={crumb.title} render={<NextLink href={crumb.path} />}>
            {crumb.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
