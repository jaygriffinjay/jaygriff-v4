"use client";

import NextLink from "next/link";
import { useEffect, useState, type MouseEvent } from "react";
import type { TocEntry } from "@/lib/goatboat";
import { cn } from "@/lib/utils";
import styles from "./table-of-contents.module.css";

// Scroll distance in px that still counts as the top of the page
const AT_TOP = 40;

export function TableOfContents({
  title,
  titleId,
  entries,
}: {
  title: string;
  titleId: string;
  entries: TocEntry[];
}) {
  const [activeId, setActiveId] = useState(titleId);

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
    const headings = [titleId, ...entries.map((entry) => entry.id)]
      .map((id) => document.getElementById(id))
      .filter((heading): heading is HTMLElement => heading !== null);
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (observations) => {
        // At the top of the page the title is current, even if the first heading is already in view
        if (window.scrollY < AT_TOP) return setActiveId(titleId);
        const visible = observations
          .filter((observation) => observation.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-12% 0px -72% 0px", threshold: 0 },
    );
    headings.forEach((heading) => observer.observe(heading));

    // Scrolling back up leaves the first heading's band without any heading entering it
    const onScroll = () => {
      if (window.scrollY < AT_TOP) setActiveId(titleId);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [entries, titleId]);

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
