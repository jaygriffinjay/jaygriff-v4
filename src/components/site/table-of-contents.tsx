"use client";

import NextLink from "next/link";
import { useEffect, useState, type MouseEvent } from "react";
import type { TocEntry } from "@/lib/goatboat";
import { cn } from "@/lib/utils";
import styles from "./table-of-contents.module.css";

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

  const returnToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;

    event.preventDefault();
    window.history.pushState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#${titleId}`,
    );
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
    setActiveId(titleId);
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
    return () => observer.disconnect();
  }, [entries, titleId]);

  return (
    <nav aria-label="On this page">
      <ol className={styles.list}>
        <li>
          <NextLink
            href={`#${titleId}`}
            onClick={returnToTop}
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
