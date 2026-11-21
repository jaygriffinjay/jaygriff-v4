"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import NextLink from "next/link";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisIcon,
  ExternalLinkIcon,
  LinkIcon,
  Maximize2Icon,
  Minimize2Icon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { H2, Paragraph } from "@/components/typography";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import styles from "./artifact-arcade.module.css";

export type ArcadeItem = {
  id: string;
  slug: string;
  path: string;
  title: string;
  description: string | null;
  tags: string[];
  thumbnail: string | null;
  /** The full URL of the artifact's HTML file. */
  src: string;
};

// How long a slide stays centered before its artifact starts loading, so flicking past doesn't boot each one
const SETTLE_MS = 400;
// Slides this far from the center are drawn (invisible), so their pictures are ready when they slide in
const DRAWN = 3;
// A trackpad swipe moves one slide once it has gone this far, then does nothing more until it has coasted to a halt
// (it keeps sending wheel events for a second or so) or a new swipe starts: either back the other way, or the same way
// again, which shows as the events growing again after they'd been shrinking
const SWIPE_DISTANCE = 30;
const FLIP_DISTANCE = 6;
const GESTURE_GAP_MS = 100;
// A finger swipe moves one slide when it has gone this far sideways
const TOUCH_SWIPE = 50;
// A trackpad moves at most one slide per this long, so a swipe can't run through several in a row. The arrow keys and finger swipes aren't held to it
const STEP_MS = 380;
// When an artifact fills the page, its menu shows this long before tucking away, and after the pointer last moved in its corner
const PEEK_MS = 2000;
const NEAR_MS = 1500;
// The artifact menu opens once the pointer has rested on its button this long
const OPEN_DELAY_MS = 150;
// The screenshots are taken at 1280x720. The live artifact runs at that size too, scaled down or up to its frame, so it lays out exactly like its screenshot
const SHOT_WIDTH = 1280;

/** True, and starts the wait for the next one, if the last step was long enough ago. */
function claimStep(last: { current: number }) {
  const now = Date.now();
  if (now - last.current < STEP_MS) return false;
  last.current = now;
  return true;
}

/** One place in the carousel: an artifact, and the tag group it's in there (none when browsing all). */
type Entry = { key: string; item: ArcadeItem; group: string | null };

/** Every artifact once, for browsing all. */
const allEntries = (items: ArcadeItem[]): Entry[] => items.map((item) => ({ key: item.id, item, group: null }));

/** One run per tag, in the rail's order, each with every artifact that has the tag. An artifact with several tags is in several runs, so cycling goes through every group in full. */
const tagEntries = (items: ArcadeItem[], tags: string[]): Entry[] =>
  tags.flatMap((group) =>
    items.filter((i) => i.tags.includes(group)).map((item) => ({ key: `${group}:${item.id}`, item, group })),
  );

/** How far item `i` is from the selected one in a loop of `n`, the short way round: negative is left. */
const offsetIn = (i: number, selected: number, n: number) => {
  const d = (((i - selected) % n) + n) % n;
  return d > n / 2 ? d - n : d;
};

type MenuProps = {
  path: string;
  /** The artifact is filling the page, so the first item minimizes it. */
  filling: boolean;
  onFill: () => void;
  onStep: (delta: number) => void;
  onClose: () => void;
};

/** The same menu, in the corner of an artifact that fills the page: there for a moment, then only while the pointer is near the corner, and open only while it's over the button. */
function FillCorner(menu: MenuProps) {
  const [peek, setPeek] = useState(true);
  const [near, setNear] = useState(false);
  const [open, setOpen] = useState(false);
  const nearTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const timer = setTimeout(() => setPeek(false), PEEK_MS);
    return () => {
      clearTimeout(timer);
      clearTimeout(nearTimer.current);
    };
  }, []);

  // A pointer that drops into the artifact's frame sends no "leave", so being near also lapses by itself once it stops moving
  const wake = () => {
    setNear(true);
    clearTimeout(nearTimer.current);
    nearTimer.current = setTimeout(() => setNear(false), NEAR_MS);
  };
  const sleep = () => {
    clearTimeout(nearTimer.current);
    setNear(false);
  };

  return (
    <div className={styles.fillHot} onPointerEnter={wake} onPointerMove={wake} onPointerLeave={sleep}>
      <div className={styles.fillMenu} data-shown={peek || near || open ? "" : undefined}>
        <ArtifactMenu {...menu} open={open} onOpenChange={setOpen} />
      </div>
    </div>
  );
}

/** The blue ellipsis menu for an artifact: opens on hover, with everything you can do with it. In a card's chin it's always there; in the corner of an artifact filling the page it comes and goes. */
function ArtifactMenu({
  path,
  filling,
  onFill,
  onStep,
  onClose,
  open,
  onOpenChange,
}: MenuProps & { open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(new URL(path, location.origin).href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // The browser refused the clipboard; there's nothing else to do
    }
  };

  // A mouse click on a hover menu's button doesn't open or close it, so it's only ever open while hovered; on a touch screen, which has no hover, a tap still opens it, and the keyboard always works
  const obeyHover = (next: boolean, details: HoverMenuDetails) => {
    if (isMousePress(details)) {
      details.cancel();
      return;
    }
    onOpenChange?.(next);
  };

  return (
    <DropdownMenu open={open} onOpenChange={obeyHover}>
      <DropdownMenuTrigger
        openOnHover
        // Opens once the pointer has rested on the button, so sweeping past it doesn't
        delay={OPEN_DELAY_MS}
        closeDelay={200}
        render={<button type="button" aria-label="Artifact options" className={styles.menuButton} />}
      >
        <EllipsisIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onFill}>
          {filling ? <Minimize2Icon /> : <Maximize2Icon />}
          {filling ? "Minimize" : "Fullscreen"}
        </DropdownMenuItem>
        <DropdownMenuItem render={<NextLink href={path} />}>
          <ExternalLinkIcon />
          About
        </DropdownMenuItem>
        <DropdownMenuItem closeOnClick={false} onClick={copyLink}>
          <LinkIcon />
          {copied ? "Copied" : "Copy link"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onStep(-1)}>
          <ChevronLeftIcon />
          Previous
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStep(1)}>
          <ChevronRightIcon />
          Next
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onClose}>
          <XIcon />
          Close
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type RailTag = { name: string | null; count: number };

type HoverMenuDetails = { reason: string; event: Event; cancel: () => void };

/** A click of a mouse, as opposed to a tap or a key, on a menu's button */
const isMousePress = (details: HoverMenuDetails) =>
  details.reason === "trigger-press" && /^(mouse|pointer|click)/.test(details.event.type) && matchMedia("(hover: hover)").matches;

/** Deals the tags, in order, into the given number of rows, each to whichever row is shortest so far by a rough guess at its width, so the rows come out about as long as each other */
function masonryRows(tags: RailTag[], rows: number) {
  const out: RailTag[][] = Array.from({ length: rows }, () => []);
  const widths = new Array<number>(rows).fill(0);
  for (const tag of tags) {
    const r = widths.indexOf(Math.min(...widths));
    out[r].push(tag);
    widths[r] += (tag.name ?? "all").length + String(tag.count).length + 5;
  }
  return out;
}

const FAKE_WORDS = ["sketch", "generative", "audio", "canvas", "physics", "color", "game", "tool", "shader", "noise", "grid", "particles", "text", "map", "tiny", "toy", "music", "3d", "pattern", "data"];

/** Dev only: ?fakeTags=60 in the address gives the artifacts that many made-up tags, to try the tag rail with a lot of them */
function useFakeTags(items: ArcadeItem[]) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    // Read after mount, so the server and first client render agree
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCount(Number(new URLSearchParams(window.location.search).get("fakeTags")) || 0);
  }, []);
  return useMemo(() => {
    if (!count) return items;
    const fake = Array.from({ length: count }, (_, k) =>
      k < FAKE_WORDS.length ? FAKE_WORDS[k] : `${FAKE_WORDS[k % FAKE_WORDS.length]}-${FAKE_WORDS[(k * 7 + 3) % FAKE_WORDS.length]}-${k}`,
    );
    return items.map((item, n) => ({
      ...item,
      tags: [...new Set([...item.tags, ...fake.filter((_, k) => (n + k) % (2 + (k % 4)) === 0)])],
    }));
  }, [items, count]);
}

/** A full-screen, looping carousel of artifacts: the centered one runs live, the ones either side tilt away showing their screenshots, and the chosen tag follows whichever group the centered one is in. Clicking the centered one frames it in a card, over the page, with its name, description and tags, and a menu of what to do with it. */
export function ArtifactArcade({ items: realItems }: { items: ArcadeItem[] }) {
  const items = useFakeTags(realItems);
  // Tags with how many artifacts each has, most first
  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const tag of items.flatMap((i) => i.tags)) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [items]);
  const tags = useMemo(() => tagCounts.map(([tag]) => tag), [tagCounts]);

  // Browsing a tag cycles through every tag's group in turn; browsing all cycles through each artifact once
  const [grouped, setGrouped] = useState(false);
  const lineup = useMemo(() => (grouped ? tagEntries(items, tags) : allEntries(items)), [grouped, items, tags]);
  const [index, setIndex] = useState(0);
  const [live, setLive] = useState<{ id: string; loaded: boolean } | null>(null);
  // The card's fullscreen button makes the artifact fill the page, not the browser's own fullscreen
  const [pseudo, setPseudo] = useState(false);
  // The card framed round the centered artifact
  const [card, setCard] = useState(false);
  // The search chip's text; with text in it, the cards below are search results. Once anything has been typed, no tag is chosen any more, and none comes back until one is clicked
  const [query, setQuery] = useState("");
  const [searchTouched, setSearchTouched] = useState(false);
  // What the search looks in: the tags in the rail, the artifacts in the cards, or both
  const [inTags, setInTags] = useState(true);
  const [inArtifacts, setInArtifacts] = useState(true);
  const searchId = useId();
  const cards = useRef<HTMLElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const rail = useRef<HTMLElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const lastStep = useRef(0);

  const n = lineup.length;
  const entry = lineup[index];
  const current = entry?.item;
  // The chosen tag is the group the centered artifact is in, so it follows the carousel. None when browsing all
  const tag = entry?.group ?? null;

  const closeCard = () => {
    frame.current?.blur();
    setPseudo(false);
    setCard(false);
  };

  // The centered artifact loads once it has stayed centered a moment. Leaving it clears that, so coming back starts the wait, and the load, afresh
  const currentKey = entry?.key;
  useEffect(() => {
    if (!currentKey) return;
    const timer = setTimeout(() => setLive({ id: currentKey, loaded: false }), SETTLE_MS);
    return () => {
      clearTimeout(timer);
      setLive(null);
    };
  }, [currentKey]);

  // How much the live artifact is scaled to fit the centered frame, kept up to date as the frame resizes
  useEffect(() => {
    const media = stage.current;
    const host = root.current;
    if (!media || !host) return;
    const fit = () => host.style.setProperty("--fit", String(media.clientWidth / SHOT_WIDTH));
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(media);
    return () => observer.disconnect();
  }, [currentKey]);

  // The chosen tag slides to the middle of the rail
  useEffect(() => {
    rail.current?.querySelector('[aria-pressed="true"]')?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [tag]);

  // Keys, from anywhere on the page (a live artifact with focus keeps its own): the arrows move the carousel, or the card's artifact, and Esc backs out
  useEffect(() => {
    if (!n) return;
    const onKeyDown = (event: KeyboardEvent) => {
      // Typing in the search field is for the field
      if ((event.target as Element).closest("input")) return;
      if (event.key === "Escape") {
        if (pseudo) setPseudo(false);
        else if (card) closeCard();
        return;
      }
      if (pseudo || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
      const step = event.key === "ArrowRight" ? 1 : -1;
      setIndex((i) => (((i + step) % n) + n) % n);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [n, pseudo, card]);

  // The page doesn't scroll behind a card or the fullscreen stage, and is taken back to the top for either, so you can't be left stuck down the page
  const covering = pseudo || card;
  useEffect(() => {
    if (!covering) return;
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      html.style.overflow = before;
    };
  }, [covering]);

  // A trackpad swipe sideways, anywhere on the page, moves one slide per swipe. Added by hand because React's wheel listener can't stop the browser's own swipe-to-go-back. The tag rail scrolls by itself
  useEffect(() => {
    const el = root.current;
    if (!el || !n || covering) return;
    let locked = false;
    let travelled = 0;
    let direction = 0;
    // The wheel events of one swipe rise, peak, then fall away as it coasts. A fresh swipe shows as a rise after a fall
    let previous = 0;
    let rising = 0;
    let falling = 0;
    let coasting = false;
    let quiet: ReturnType<typeof setTimeout>;

    const reset = () => {
      locked = false;
      travelled = 0;
      previous = 0;
      rising = 0;
      falling = 0;
      coasting = false;
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      if ((event.target as Element).closest("[data-no-swipe]")) return;
      event.preventDefault();

      const size = Math.abs(event.deltaX);
      if (size > previous) {
        rising++;
        falling = 0;
      } else if (size < previous) {
        falling++;
        rising = 0;
      }
      previous = size;

      if (locked) {
        if (falling >= 2) coasting = true;
        const swipedBack = Math.sign(event.deltaX) !== direction && size >= FLIP_DISTANCE;
        const swipedAgain = coasting && rising >= 3 && size >= FLIP_DISTANCE;
        if (swipedBack || swipedAgain) {
          locked = false;
          travelled = 0;
          coasting = false;
        }
      }
      clearTimeout(quiet);
      quiet = setTimeout(reset, GESTURE_GAP_MS);
      if (locked) return;

      travelled += event.deltaX;
      if (Math.abs(travelled) < SWIPE_DISTANCE) return;
      locked = true;
      coasting = false;
      direction = Math.sign(travelled);
      // A swipe that comes too soon after the last step is used up without moving anything
      if (claimStep(lastStep)) setIndex((i) => (((i + direction) % n) + n) % n);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      clearTimeout(quiet);
    };
  }, [n, covering]);

  // An artifact that grabs focus by itself (an autofocused input, a game calling focus()) is made to give it back, so the arrow keys keep working until the visitor opens it
  useEffect(() => {
    if (card) return;
    const onBlur = () =>
      setTimeout(() => {
        if (document.activeElement === frame.current) frame.current?.blur();
      }, 0);
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, [card]);

  // Fewer results make the page shorter, and a page too short for where the reader has scrolled to throws them upward. So the cards' section is only held as tall as that scroll position needs (usually not at all), and the page is put back where it was. The scroll position from before the change is kept here
  const scrollBefore = useRef(0);
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const searching = words.length > 0 && inArtifacts && searchTouched;
  useLayoutEffect(() => {
    const el = cards.current;
    if (!el) return;
    el.style.removeProperty("min-height");
    if (!searching) return;
    const top = scrollBefore.current;
    const short = top + window.innerHeight - document.documentElement.scrollHeight;
    if (short > 0) el.style.minHeight = `${el.offsetHeight + short}px`;
    if (window.scrollY !== top) window.scrollTo(0, top);
  }, [query, searching]);

  if (!current) return null;

  const go = (delta: number) => setIndex((i) => (((i + delta) % n) + n) % n);

  const choose = (next: string | null) => {
    // Choosing a tag keeps the search words, which go on narrowing the tags; the cards show the tag's artifacts until the next letter typed
    setSearchTouched(false);
    releaseCards();
    if (next === null) {
      // All: the same artifact, now in the list of every artifact once
      setGrouped(false);
      setIndex(Math.max(items.findIndex((i) => i.id === current.id), 0));
      return;
    }
    // A tag: the centered artifact if it's in that group, otherwise the group's first
    const list = tagEntries(items, tags);
    const same = list.findIndex((e) => e.group === next && e.item.id === current.id);
    setGrouped(true);
    setIndex(same >= 0 ? same : Math.max(list.findIndex((e) => e.group === next), 0));
  };

  const toggleFill = () => setPseudo((filling) => !filling);

  const releaseCards = () => cards.current?.style.removeProperty("min-height");
  const onSearch = (value: string) => {
    scrollBefore.current = window.scrollY;
    if (value.trim() !== "" && inArtifacts) setSearchTouched(true);
    setQuery(value);
  };
  // One of the two always stays checked
  const onScope = (which: "tags" | "artifacts", on: boolean) => {
    if (!on && !(which === "tags" ? inArtifacts : inTags)) return;
    scrollBefore.current = window.scrollY;
    if (which === "tags") setInTags(on);
    else setInArtifacts(on);
    if (query.trim() !== "") setSearchTouched(which === "artifacts" ? on : inArtifacts);
  };

  // While the tags are searched the all chip goes with the tags that don't match
  const searchTags = words.length > 0 && inTags;
  const railTags: RailTag[] = [
    ...(searchTags ? [] : [{ name: null, count: items.length }]),
    ...tagCounts.filter(([name]) => !searchTags || words.every((w) => name.includes(w))).map(([name, count]) => ({ name, count })),
  ];
  const railRows = masonryRows(railTags, railTags.length <= 8 ? 1 : railTags.length <= 16 ? 2 : 3);

  // The cards under the rail: what the search finds in every artifact (all the words, in the name, description or tags), or else the chosen tag's artifacts
  const shown = searching
    ? items.filter((i) => {
        const text = `${i.title} ${i.description ?? ""} ${i.tags.join(" ")}`.toLowerCase();
        return words.every((w) => text.includes(w));
      })
    : tag && !searchTouched
      ? items.filter((i) => i.tags.includes(tag))
      : items;

  // A card puts its artifact in the carousel, and takes you up to it. One that isn't in the tag you're browsing (a search result) is found in the list of all
  const pick = (item: ArcadeItem) => {
    let i = lineup.findIndex((e) => e.item.id === item.id && e.group === tag);
    if (i < 0) {
      setGrouped(false);
      i = items.findIndex((x) => x.id === item.id);
    }
    setIndex(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onPointerDown = (event: React.PointerEvent) => {
    if (event.pointerType === "mouse" || covering) return;
    touchStart.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: React.PointerEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    if (Math.abs(dx) < TOUCH_SWIPE || Math.abs(dx) < Math.abs(event.clientY - start.y) * 1.5) return;
    go(dx < 0 ? 1 : -1);
    // The tap that ends a swipe shouldn't also press whatever is under the finger
    swiped.current = true;
    setTimeout(() => (swiped.current = false), 50);
  };

  const onClickCapture = (event: React.MouseEvent) => {
    if (!swiped.current) return;
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <div ref={root} className={styles.arcade} data-card={card ? "" : undefined} data-pseudo={pseudo ? "" : undefined}>
      {/* The dark behind a card covers the whole window, site header and all, so it's outside the arcade, which sits above it */}
      {card && !pseudo && createPortal(<div aria-hidden onClick={closeCard} className={styles.backdrop} />, document.body)}

      <main className={styles.stage}>
        {card && (
          <div className={styles.cardBg}>
            <div className={styles.cardMenu}>
              <ArtifactMenu path={current.path} filling={pseudo} onFill={toggleFill} onStep={go} onClose={closeCard} />
            </div>
          </div>
        )}

        <div
          role="group"
          aria-roledescription="carousel"
          aria-label="Artifacts"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onClickCapture={onClickCapture}
          className={styles.track}
        >
          <div aria-hidden className={styles.glow} />
          <div className={styles.slides}>
            {lineup.map((e, i) => {
              const item = e.item;
              const d = offsetIn(i, index, n);
              if (Math.abs(d) > DRAWN) return null;
              const center = d === 0;
              const running = center && live?.id === e.key;
              const inside = card;

              return (
                <div key={e.key} data-offset={d} className={styles.slide}>
                  <div ref={center ? stage : undefined} className={styles.media}>
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt=""
                        fill
                        loading={Math.abs(d) <= 1 ? "eager" : undefined}
                        sizes="84vw"
                        unoptimized={item.thumbnail.endsWith(".svg")}
                        className={styles.thumb}
                      />
                    ) : (
                      <div className={styles.noThumb} />
                    )}
                    {running && (
                      <iframe
                        ref={frame}
                        src={item.src}
                        title={item.title}
                        tabIndex={inside ? 0 : -1}
                        // Scripts run, but with no origin: no cookies or storage, no top-level navigation, no popups or forms
                        sandbox="allow-scripts allow-downloads allow-pointer-lock"
                        allowFullScreen
                        referrerPolicy="no-referrer"
                        data-loaded={live.loaded ? "" : undefined}
                        onLoad={() => setLive({ id: e.key, loaded: true })}
                        className={styles.frame}
                      />
                    )}
                    {running && !inside && (
                      <button type="button" aria-label={`Open ${item.title}`} onClick={() => setCard(true)} className={styles.shield} />
                    )}
                    {!center && (
                      <button type="button" aria-label={`Show ${item.title}`} onClick={() => go(d)} className={styles.pick} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {pseudo && <FillCorner path={current.path} filling onFill={toggleFill} onStep={go} onClose={closeCard} />}
        </div>

        {card ? (
          <div className={styles.card}>
            <H2 className={styles.cardTitle}>{current.title}</H2>
            {current.description && <Paragraph className={styles.description}>{current.description}</Paragraph>}
          </div>
        ) : (
          <>
            <div role="search" data-no-swipe data-active={words.length > 0 ? "" : undefined} className={styles.searchZone}>
              <label htmlFor={searchId} className={styles.searchGlass}>
                <SearchIcon aria-label="Search" />
              </label>
              <div className={styles.searchField}>
                <input
                  id={searchId}
                  type="search"
                  value={query}
                  placeholder="Search"
                  aria-label="Search"
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  onChange={(event) => onSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key !== "Escape") return;
                    onSearch("");
                    event.currentTarget.blur();
                  }}
                  className={styles.searchInput}
                />
              </div>
              <div className={styles.searchOptions}>
                <label className={styles.option}>
                  <input type="checkbox" checked={inTags} onChange={(event) => onScope("tags", event.target.checked)} className={styles.optionBox} />
                  Tags
                </label>
                <label className={styles.option}>
                  <input type="checkbox" checked={inArtifacts} onChange={(event) => onScope("artifacts", event.target.checked)} className={styles.optionBox} />
                  Artifacts
                </label>
              </div>
            </div>
          <nav ref={rail} aria-label="Filter by tag" data-no-swipe className={styles.rail}>
            <div className={styles.railInner}>
              <div className={styles.railRows}>
                {railRows.map((row, r) => (
                  <div key={r} className={styles.railRow}>
                    {row.map(({ name, count }) => (
                      <button
                        key={name ?? "all"}
                        type="button"
                        aria-pressed={!searchTouched && name === tag}
                        onClick={() => choose(name)}
                        className={styles.railTag}
                      >
                        <span className={styles.railName}>{name ?? "all"}</span>
                        <span className={styles.railCount}>{count}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </nav>
          </>
        )}

        <section ref={cards} aria-labelledby="cards-heading" className={styles.cards}>
          <div className={styles.cardsHead}>
            <H2 id="cards-heading" className={styles.cardsTitle}>
              {searching ? "Search results" : tag && !searchTouched ? `#${tag}` : "All artifacts"}
            </H2>
            <span className={styles.cardsCount}>{shown.length} items</span>
          </div>
          {shown.length === 0 && <p className={styles.noResults}>Nothing matches.</p>}
          <ul className={styles.cardGrid}>
            {shown.map((item, i) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => pick(item)}
                  aria-current={item.id === current.id ? "true" : undefined}
                  className={styles.miniCard}
                >
                  <span className={styles.miniThumb}>
                    {item.thumbnail && (
                      <Image
                        src={item.thumbnail}
                        alt=""
                        fill
                        // The first row can be on screen at load, where a lazy image is reported as slow
                        loading={i < 6 ? "eager" : undefined}
                        sizes="(min-width: 56rem) 26rem, 90vw"
                        unoptimized={item.thumbnail.endsWith(".svg")}
                        className={styles.thumb}
                      />
                    )}
                  </span>
                  <span className={styles.miniBody}>
                    <span className={styles.miniTitle}>{item.title}</span>
                    {item.description && <span className={styles.miniDescription}>{item.description}</span>}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
