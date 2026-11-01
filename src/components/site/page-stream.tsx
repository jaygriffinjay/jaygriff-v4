import NextLink from "next/link";
import { CodeXml, FolderGit2 } from "lucide-react";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { Bold, H3, Muted, Paragraph } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { excerpt } from "@/lib/excerpt";
import { getContentByPath, type ContentItem } from "@/lib/goatboat";
import { getCurrentPage, isVisible } from "@/lib/page-meta";
import { cn } from "@/lib/utils";
import styles from "./page-stream.module.css";

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

const sectionCount = (item: ContentItem) => (item.toc ?? []).filter((e) => e.depth === 2).length;

/** Entries in groups of one day each, newest first. */
function byDay(items: ContentItem[]) {
  const sorted = [...items].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
  const days = new Map<string, ContentItem[]>();
  for (const item of sorted) days.set(dayOf(item), [...(days.get(dayOf(item)) ?? []), item]);
  return [...days];
}

/** What's left after the opening: [… 1,240 words] for prose, [… 8 sections] for a code page. */
function Remaining({ item, words }: { item: ContentItem; words?: number }) {
  const n = words ?? sectionCount(item);
  if (!n) return null;
  const unit = words !== undefined ? "words" : "sections";
  return (
    <Paragraph>
      [
      <NextLink href={item.path} className={styles.link}>
        … {n.toLocaleString("en-US")} {unit}
      </NextLink>
      ]
    </Paragraph>
  );
}

/** Time · project · #tags · authors under an entry. */
function TagLine({ item }: { item: ContentItem }) {
  const time = timeOf(item);
  const parts = [
    time && (
      <NextLink href={item.path} className={styles.quietLink}>
        {time}
      </NextLink>
    ),
    item.project && (
      <Badge variant="outline">
        <FolderGit2 data-icon="inline-start" />
        {item.project.title}
      </Badge>
    ),
    item.tags?.length && (
      <span className={styles.tags}>
        {item.tags.map((tag) => (
          <NextLink key={tag} href={`/tests/feed?tag=${tag}`} className={styles.link}>
            #{tag}
          </NextLink>
        ))}
      </span>
    ),
    item.authors?.length && <span>{item.authors.join(", ")}</span>,
  ].filter(Boolean);
  if (!parts.length) return null;

  return (
    <Muted className={styles.tagLine}>
      {parts.map((part, i) => (
        <span key={i} className={styles.part}>
          {i > 0 && <span aria-hidden>·</span>}
          {part}
        </span>
      ))}
    </Muted>
  );
}

function Entry({ item }: { item: ContentItem }) {
  const code = item.source === "approute";
  const cut = !code && item.body ? excerpt(item.body) : null;
  const opening = item.intro ?? item.description;

  return (
    <article className={styles.entry}>
      <H3>
        <NextLink href={item.path} className={styles.link}>
          {code && <CodeXml aria-label="Code page" className={styles.glyph} />}
          {item.title}
        </NextLink>
      </H3>
      {cut ? (
        <div className={styles.opening}>
          <MarkdownRenderer source={cut.markdown} />
        </div>
      ) : (
        opening && <Paragraph>{opening}</Paragraph>
      )}
      <Remaining item={item} words={cut?.moreWords} />
      <TagLine item={item} />
    </article>
  );
}

/** The current page's children as one running stream, grouped by day: each child's opening, what's left, and its tags. */
export async function PageStream({ className }: { className?: string }) {
  const page = await getCurrentPage();
  const children = page?.children.filter(isVisible) ?? [];
  const pages = await Promise.all(children.map((child) => getContentByPath(child.path)));
  const items = pages.flatMap((p) => (p && !("redirectTo" in p) ? [p.item] : []));
  if (!items.length) return null;

  return (
    <div className={cn(styles.stream, className)}>
      {byDay(items).map(([day, dayItems]) => (
        <section key={day} className={styles.day}>
          <Paragraph>
            <Bold>{day}</Bold>
          </Paragraph>
          <div className={styles.entries}>
            {dayItems.map((item) => (
              <Entry key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
