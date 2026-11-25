"use client";

import type { ReactNode } from "react";
import { useEffect, useState, useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { CapsLabel } from "@/components/typography";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setHomeFeedPreferences, type HomeFeedFilter, type HomeFeedSort } from "./infinite-feed-actions";
import styles from "./home-feed-controls.module.css";

const filters: { value: HomeFeedFilter; label: string }[] = [
  { value: "cool", label: "Cool" },
  { value: "all", label: "All" },
  { value: "projects", label: "Projects" },
  { value: "posts", label: "Posts" },
  { value: "notes", label: "Notes" },
];

const sorts: { value: HomeFeedSort; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
];

export function HomeFeedControls({
  activeFilter,
  activeSort,
  children,
}: {
  activeFilter: HomeFeedFilter;
  activeSort: HomeFeedSort;
  children: ReactNode;
}) {
  const [pending, startTransition] = useTransition();
  const [openMenu, setOpenMenu] = useState<"filter" | "sort" | null>(null);
  const [hoveredWhilePending, setHoveredWhilePending] = useState<"filter" | "sort" | null>(null);
  const activeFilterLabel = filters.find(({ value }) => value === activeFilter)?.label ?? "Cool";
  const activeSortLabel = sorts.find(({ value }) => value === activeSort)?.label ?? "Latest";

  useEffect(() => {
    if (pending || !hoveredWhilePending) return;
    setOpenMenu(hoveredWhilePending);
    setHoveredWhilePending(null);
  }, [hoveredWhilePending, pending]);

  const setMenuOpen = (menu: "filter" | "sort", open: boolean) => {
    setOpenMenu((current) => (open ? menu : current === menu ? null : current));
  };

  const trackPendingPointer = (menu: "filter" | "sort") => {
    if (pending) setHoveredWhilePending(menu);
  };

  const clearPendingPointer = (menu: "filter" | "sort") => {
    setHoveredWhilePending((current) => (current === menu ? null : current));
  };

  const updatePreferences = (filter: HomeFeedFilter, sort: HomeFeedSort) => {
    startTransition(async () => {
      await setHomeFeedPreferences(filter, sort);
    });
  };

  const selectFilter = (value: string) => {
    const filter = filters.find((option) => option.value === value)?.value;
    if (!filter || filter === activeFilter || pending) return;
    updatePreferences(filter, "latest");
  };

  const selectSort = (value: string) => {
    const sort = sorts.find((option) => option.value === value)?.value;
    if (!sort || sort === activeSort || pending) return;
    updatePreferences(activeFilter, sort);
  };

  return (
    <div className={styles.controls}>
      <div className={styles.toolbar}>
        <div
          onPointerEnter={() => trackPendingPointer("filter")}
          onPointerLeave={() => clearPendingPointer("filter")}
        >
          <DropdownMenu
            open={openMenu === "filter"}
            highlightItemOnHover={false}
            onOpenChange={(open) => setMenuOpen("filter", open)}
          >
            <DropdownMenuTrigger
              disabled={pending}
              openOnHover
              delay={0}
              closeDelay={200}
              render={<button type="button" className={styles.trigger} aria-label={`Filter feed: ${activeFilterLabel}`} />}
            >
              <CapsLabel className={styles.label}>{activeFilterLabel}</CapsLabel>
              <ChevronDown aria-hidden="true" className={styles.chevron} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={styles.menu}>
              {filters.map(({ value, label }) => (
                <DropdownMenuItem
                  key={value}
                  className={styles.item}
                  disabled={pending}
                  onClick={() => selectFilter(value)}
                >
                  <CapsLabel>{label}</CapsLabel>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div
          onPointerEnter={() => trackPendingPointer("sort")}
          onPointerLeave={() => clearPendingPointer("sort")}
        >
          <DropdownMenu
            open={openMenu === "sort"}
            highlightItemOnHover={false}
            onOpenChange={(open) => setMenuOpen("sort", open)}
          >
            <DropdownMenuTrigger
              disabled={pending}
              openOnHover
              delay={0}
              closeDelay={200}
              render={<button type="button" className={styles.trigger} aria-label={`Sort feed: ${activeSortLabel}`} />}
            >
              <CapsLabel className={styles.label}>{activeSortLabel}</CapsLabel>
              <ChevronDown aria-hidden="true" className={styles.chevron} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={styles.menu}>
              {sorts.map(({ value, label }) => (
                <DropdownMenuItem
                  key={value}
                  className={styles.item}
                  disabled={pending}
                  onClick={() => selectSort(value)}
                >
                  <CapsLabel>{label}</CapsLabel>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className={styles.panel}>{children}</div>
    </div>
  );
}