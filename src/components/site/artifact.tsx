"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import NextLink from "next/link";
import { EllipsisIcon, ExternalLinkIcon, LayoutGridIcon, Maximize2Icon, Minimize2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import styles from "./artifact.module.css";

const sizes = { sm: styles.sm, md: styles.md, lg: styles.lg };

// A reported height is capped, so a page that grows with its frame can't run away
const MAX_HEIGHT = 10000;
// The frame's border takes this much from the height set on it, so the page inside would otherwise be this short
const BORDER = 2;

/** An HTML artifact shown in a frame inside a page. The frame is sized once, to the height the artifact reports after it loads, and can expand over the whole page. */
export function Artifact({
  src,
  title,
  size = "md",
  poster,
  href,
  className,
}: {
  /** The full URL of the artifact's HTML file, where it's hosted. */
  src: string;
  /** What the frame is, for screen readers. */
  title: string;
  /** The frame's minimum height, and its height until the artifact reports its own. */
  size?: keyof typeof sizes;
  /** A picture standing in for the artifact, as in a feed. With one, no frame is loaded until Fullscreen is chosen, and minimizing removes it again. */
  poster?: React.ReactNode;
  /** The path of the artifact's own page, for the menu's About. */
  href?: string;
  className?: string;
}) {
  const hasPoster = poster !== undefined;
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  // A poster's frame loads on demand; this is whether it has yet, so a spinner can cover the wait
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow) return;
      const { type, height } = event.data ?? {};
      if (type !== "jaygriff:size" || typeof height !== "number" || !Number.isFinite(height)) return;
      // Measured while expanded, a page would report the screen's height, not its own
      if (root.current?.hasAttribute("data-expanded")) return;
      setHeight(Math.min(MAX_HEIGHT, Math.round(height) + BORDER));
      // The first report is the only one; the frame never resizes again
      window.removeEventListener("message", onMessage);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  /** Expands or minimizes the frame, morphing between the two where the browser supports view transitions. */
  const toggle = useCallback((next: boolean, animate = true) => {
    const el = root.current;
    if (!el) return;
    const apply = () => {
      // The expanded frame leaves the page's flow, so its box keeps the height meanwhile
      if (next) el.style.height = `${el.offsetHeight}px`;
      if (next) setLoaded(false);
      if (animate) flushSync(() => setExpanded(next));
      else setExpanded(next);
      if (!next) el.style.removeProperty("height");
      // A poster's page is the feed, which has no single artifact to link to
      if (!hasPoster) {
        const url = new URL(location.href);
        if (next) url.searchParams.set("fullscreen", "");
        else url.searchParams.delete("fullscreen");
        history.replaceState(history.state, "", url);
      }
    };
    const smooth = animate && typeof document.startViewTransition === "function" && !matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (smooth) {
      // A transition name must be unique on the page, so a feed's artifacts carry theirs only while one of them morphs
      el.setAttribute("data-morphing", "");
      document.startViewTransition(apply).finished.finally(() => el.removeAttribute("data-morphing"));
    } else apply();
  }, [hasPoster]);

  // A link with ?fullscreen opens the artifact expanded
  useEffect(() => {
    if (!hasPoster && new URLSearchParams(location.search).has("fullscreen")) toggle(true, false);
  }, [toggle, hasPoster]);

  // The page behind an expanded artifact doesn't scroll
  useLayoutEffect(() => {
    if (!expanded) return;
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = before;
    };
  }, [expanded]);

  // Escape minimizes, except when it's closing the menu. Not heard while the artifact itself has focus, so the menu matters
  useEffect(() => {
    if (!expanded) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || root.current?.querySelector('[aria-expanded="true"]')) return;
      toggle(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [expanded, toggle]);

  const sized = height !== null;

  return (
    <div ref={root} className={styles.root} data-expanded={expanded ? "" : undefined} data-poster={hasPoster ? "" : undefined}>
      {poster}
      {/* With a poster, the frame exists only while expanded, so nothing loads until Fullscreen is chosen */}
      {(!hasPoster || expanded) && (
        <iframe
          ref={frame}
          src={src}
          title={title}
          // Scripts run, but with no origin: no cookies or storage, no top-level navigation, no popups or forms
          sandbox="allow-scripts allow-downloads allow-pointer-lock"
          allowFullScreen
          referrerPolicy="no-referrer"
          loading={hasPoster ? "eager" : "lazy"}
          height={sized ? height : undefined}
          onLoad={() => setLoaded(true)}
          className={cn(styles.frame, sizes[size], !sized && styles.pending, className)}
        />
      )}
      {hasPoster && expanded && !loaded && <Spinner className={styles.spinner} />}
      <div className={styles.controls}>
        {hasPoster && !expanded ? (
          // A card's only control: one plain way in, with no menu to wonder about. The options wait inside the artifact
          <button type="button" className={styles.control} aria-label={`Open ${title} fullscreen`} onClick={() => toggle(true)}>
            <Maximize2Icon />
          </button>
        ) : (
          // Opens on hover, with no wait, like the menu on a Claude artifact
          <DropdownMenu>
            <DropdownMenuTrigger
              openOnHover
              delay={0}
              closeDelay={200}
              render={<button type="button" className={styles.control} aria-label="Artifact options" />}
            >
              <EllipsisIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toggle(!expanded)}>
                {expanded ? <Minimize2Icon /> : <Maximize2Icon />}
                {expanded ? "Minimize" : "Fullscreen"}
              </DropdownMenuItem>
              {/* A card's artifact can say where it lives; an artifact on its own page is already there */}
              {href && (
                <DropdownMenuItem render={<NextLink href={href} />}>
                  <ExternalLinkIcon />
                  About
                </DropdownMenuItem>
              )}
              <DropdownMenuItem render={<NextLink href="/artifacts" />}>
                <LayoutGridIcon />
                More
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<NextLink href="/about" />}>Made by Jay</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
