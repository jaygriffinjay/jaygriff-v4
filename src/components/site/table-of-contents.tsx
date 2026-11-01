"use client";

import NextLink from "next/link";
import { useEffect, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { useActiveHeading } from "@/hooks/use-active-heading";
import type { TocEntry } from "@/lib/goatboat";
import { cn } from "@/lib/utils";
import styles from "./table-of-contents.module.css";

export function TableOfContents({
  title,
  titleId,
  entries,
  onNavigate,
}: {
  title: string;
  titleId: string;
  entries: TocEntry[];
  /** Called when a link is followed, before the page scrolls; a container that collapses can do so first. */
  onNavigate?: () => void;
}) {
  const [activeId, setActiveId] = useActiveHeading(
    titleId,
    entries.map((entry) => entry.id),
  );

  // Sections aren't history entries: Back and Forward stay for pages, so the hash replaces the current entry
  const goTo = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;

    const heading = document.getElementById(id);
    if (!heading && id !== titleId) return;

    event.preventDefault();
    // Collapsing moves the page, so it has to land before the scroll is measured
    if (onNavigate) flushSync(onNavigate);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#${id}`,
    );
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    if (id === titleId) window.scrollTo({ top: 0, behavior });
    else heading?.scrollIntoView({ behavior });
    setActiveId(id);
  };

  useEffect(() => {
    if (window.location.hash === `#${titleId}`)
      window.scrollTo({ top: 0, behavior: "auto" });
  }, [titleId]);

  return <TocList title={title} titleId={titleId} entries={entries} activeId={activeId} goTo={goTo} />;
}

/** The title and headings as links, with the current one marked. Shared by the side column and the mobile menu. */
export function TocList({
  title,
  titleId,
  entries,
  activeId,
  goTo,
}: {
  title: string;
  titleId: string;
  entries: TocEntry[];
  activeId: string;
  /** Click handler for the link to a heading id. */
  goTo: (id: string) => (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <nav aria-label="On this page">
      <ol className={styles.list}>
        <li>
          <NextLink
            href={`#${titleId}`}
            onClick={goTo(titleId)}
            className={cn(styles.link, activeId === titleId && styles.active)}
            aria-current={activeId === titleId ? "location" : undefined}
          >
            {title}
          </NextLink>
        </li>
        {entries.map((entry) => (
          <li
            key={entry.id}
            className={cn(entry.depth > 2 && styles.nested)}
          >
            <NextLink
              href={`#${entry.id}`}
              onClick={goTo(entry.id)}
              className={cn(
                styles.link,
                activeId === entry.id && styles.active,
              )}
              aria-current={activeId === entry.id ? "location" : undefined}
            >
              {entry.text}
            </NextLink>
          </li>
        ))}
      </ol>
    </nav>
  );
}
