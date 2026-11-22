import Image from "next/image";
import NextLink from "next/link";
import { Box, CodeXml } from "lucide-react";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { H3, H4, Muted, Paragraph } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { excerpt } from "@/lib/excerpt";
import type { ContentItem } from "@/lib/goatboat";
import { cn } from "@/lib/utils";
import styles from "./home-feed.module.css";

/** Where an entry's picture goes: above its title, above it but shorter, between the title and the opening, or not at all. */
export type HeroStyle = "above" | "wide" | "between" | "none";

// Jay is in Central time; the server's own zone (UTC on Vercel) would shift times and even days
const TIME_ZONE = "America/Chicago";

const dayOf = (item: ContentItem) =>
  item.publishedAt
    ? new Date(item.publishedAt).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: TIME_ZONE,
      })
    : "Undated";

const timeOf = (item: ContentItem) =>
  item.publishedAt
    ? new Date(item.publishedAt)
        .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: TIME_ZONE })
        .toLowerCase()
    : null;

/** Entries in groups of one day each, newest day first. */
function byDay(items: ContentItem[]) {
  const sorted = [...items].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
  const days = new Map<string, ContentItem[]>();
  for (const item of sorted) days.set(dayOf(item), [...(days.get(dayOf(item)) ?? []), item]);
  return [...days];
}

/** The picture an entry leads with: its hero image, else its thumbnail. An artifact's hero is its html file, which is no picture. */
const heroOf = (item: ContentItem) =>
  item.assets.find((a) => a.kind === "image" && a.role === "hero") ??
  item.assets.find((a) => a.kind === "image" && a.role === "thumbnail");

const sectionsIn = (item: ContentItem) => (item.toc ?? []).filter((e) => e.depth === 2).length;

/** A page's picture, as wide as the column, linking to the page. Pages with no picture have none. */
function Hero({ item, shape }: { item: ContentItem; shape: "above" | "wide" | "between" }) {
  const image = heroOf(item);
  if (!image) return null;
  return (
    // The title already links to the page, so this link stays out of the tab order
    <NextLink href={item.path} className={styles.hero} data-shape={shape} tabIndex={-1} aria-hidden="true">
      <Image
        src={image.url}
        alt=""
        width={1280}
        height={720}
        sizes="(min-width: 56rem) 42rem, calc(100vw - 2rem)"
        unoptimized={image.url.endsWith(".svg")}
        className={styles.image}
      />
    </NextLink>
  );
}

/** What's left after the opening, in brackets: words for prose, sections for a code page. Nothing when there's no more; the title is the way in. */
function Count({ item, moreWords }: { item: ContentItem; moreWords?: number }) {
  const left = moreWords ?? sectionsIn(item);
  if (left <= 0) return null;
  const unit = moreWords !== undefined ? "words" : "sections";
  return (
    <Paragraph>
      [
      <NextLink href={item.path} className={styles.link}>
        … {left.toLocaleString("en-US")} {unit}
      </NextLink>
      ]
    </Paragraph>
  );
}

/** Where a tag leads: artifacts to the artifacts page filtered by it, everything else to the notes feed. */
const tagHref = (item: ContentItem, tag: string) =>
  item.type === "artifact"
    ? `/artifacts?tag=${encodeURIComponent(tag)}`
    : `/projects/goatboat/notes/feed?tag=${encodeURIComponent(tag)}`;

/** Time, project, hashtags and authors, with middle dots between. */
function TagLine({ item }: { item: ContentItem }) {
  const time = timeOf(item);
  const parts = [
    time && (
      <NextLink key="time" href={item.path} className={styles.quietLink}>
        {time}
      </NextLink>
    ),
    item.project && (
      <NextLink key="project" href={`/projects/${item.project.slug}`} className={styles.projectLink}>
        <Box aria-hidden className={styles.projectIcon} />
        {item.project.title}
      </NextLink>
    ),
    item.tags?.length ? (
      <span key="tags" className={styles.hashTags}>
        {item.tags.map((tag) => (
          <NextLink key={tag} href={tagHref(item, tag)} className={styles.link}>
            #{tag}
          </NextLink>
        ))}
      </span>
    ) : null,
    item.authors?.length ? <span key="authors">{item.authors.join(", ")}</span> : null,
  ].filter(Boolean);

  return (
    <Muted className={styles.tagLine}>
      {parts.map((part, i) => (
        <span key={i} className={styles.part}>
          {i > 0 && (
            <span aria-hidden className={styles.dot}>
              ·
            </span>
          )}
          {part}
        </span>
      ))}
    </Muted>
  );
}

function Entry({ item, hero }: { item: ContentItem; hero: HeroStyle }) {
  const cut = item.body ? excerpt(item.body) : null;
  const isCode = item.source === "approute";
  const opening = item.intro ?? item.description;
  return (
    <article className={styles.entry}>
      {(hero === "above" || hero === "wide") && <Hero item={item} shape={hero} />}
      <div className={styles.titleRow}>
        <H4 className={styles.title}>
          <NextLink href={item.path} className={styles.link}>
            {isCode && <CodeXml aria-label="Code page" className={styles.glyph} />}
            {item.title}
          </NextLink>
        </H4>
        <Badge variant="outline" render={item.type === "artifact" ? <NextLink href="/artifacts" /> : undefined}>
          {item.type}
        </Badge>
      </div>
      {hero === "between" && <Hero item={item} shape="between" />}
      {cut ? (
        <div className={styles.rendered}>
          <MarkdownRenderer source={cut.markdown} />
        </div>
      ) : (
        opening && <Paragraph>{opening}</Paragraph>
      )}
      <Count item={item} moreWords={cut?.moreWords} />
      <TagLine item={item} />
    </article>
  );
}

/** The home page's latest content as a by-day stream: a day heading, then each entry with its picture, opening, what's left and a line of details. */
export function HomeFeed({
  items,
  hero = "wide",
  className,
}: {
  items: ContentItem[];
  hero?: HeroStyle;
  className?: string;
}) {
  return (
    <div className={cn(styles.feed, className)}>
      {byDay(items).map(([day, dayItems]) => (
        <section key={day} className={styles.day}>
          <H3 className={styles.dayHeading}>{day}</H3>
          <div className={styles.stream}>
            {dayItems.map((item) => (
              <Entry key={item.id} item={item} hero={hero} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
