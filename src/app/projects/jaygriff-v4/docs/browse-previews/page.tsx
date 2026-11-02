// goatboat: 3db11c67-70dc-4c49-ab7a-f4a9beb4e1d3
import NextLink from "next/link";
import { CodeXml, FolderGit2 } from "lucide-react";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { Bold, H2, H3, InlineCode, Muted, Paragraph } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { getContentByPath, listProjects, type ContentItem } from "@/lib/goatboat";
import { isVisible } from "@/lib/page-meta";
import { excerpt, plainExcerpt, wordsIn } from "@/lib/excerpt";
import styles from "./page.module.css";

const SAMPLE_PARENTS = ["/projects/goatboat/docs", "/projects/jaygriff-v4/docs"];

async function loadEntries() {
  const parents = await Promise.all(SAMPLE_PARENTS.map((path) => getContentByPath(path)));
  const paths = parents.flatMap((p) => (p && !("redirectTo" in p) ? p.children.filter(isVisible).map((c) => c.path) : []));
  const pages = await Promise.all(paths.map((path) => getContentByPath(path)));
  return pages.flatMap((p) => (p && !("redirectTo" in p) ? [p.item] : []));
}

// Jay is in Central time; the server's own zone (UTC on Vercel) would shift times and even days
const TIME_ZONE = "America/Chicago";

const dateOf = (item: ContentItem) =>
  item.publishedAt
    ? new Date(item.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: TIME_ZONE,
      })
    : null;

const sectionsOf = (item: ContentItem) => (item.toc ?? []).filter((e) => e.depth === 2).map((e) => e.text);

const headingsLine = (item: ContentItem, shown = 4) => {
  const names = sectionsOf(item);
  if (!names.length) return null;
  const rest = names.length - shown;
  return names.slice(0, shown).join(" · ") + (rest > 0 ? ` · ${rest} more` : "");
};

const moreWords = (n: number) => `${n.toLocaleString("en-US")} more words`;

function ProjectBadge({ title }: { title: string }) {
  return (
    <Badge variant="outline">
      <FolderGit2 data-icon="inline-start" />
      {title}
    </Badge>
  );
}

type CodeMark = "sections" | "count" | "file" | "none";

/** The call to action under an entry: date, authors, project, then how much is left. */
function EntryFooter({
  item,
  left,
  codeMark = "count",
  showDate = true,
}: {
  item: ContentItem;
  /** words not shown in the excerpt; undefined for code pages */
  left?: number;
  codeMark?: CodeMark;
  showDate?: boolean;
}) {
  const sections = sectionsOf(item).length;
  const cta =
    left !== undefined
      ? left > 0
        ? `… ${moreWords(left)}`
        : "read it"
      : codeMark === "count" && sections
        ? `${sections} sections`
        : "open it";

  const parts = [
    showDate && dateOf(item) && <span key="date">{dateOf(item)}</span>,
    item.authors?.length && <span key="authors">{item.authors.join(", ")}</span>,
    left === undefined && codeMark === "file" && item.file && (
      <InlineCode key="file">{item.file.replace(/^src\//, "")}</InlineCode>
    ),
    <NextLink key="cta" href={item.path} className={styles.more}>
      {cta} →
    </NextLink>,
  ].filter(Boolean);

  return (
    <Muted className={styles.footer}>
      {item.project && <ProjectBadge title={item.project.title} />}
      {parts.map((part, i) => (
        <span key={i} className={styles.part}>
          {i > 0 && <span aria-hidden>·</span>}
          {part}
        </span>
      ))}
    </Muted>
  );
}

function Title({ item, codeMark }: { item: ContentItem; codeMark?: "glyph" }) {
  return (
    <H3 className={styles.entryTitle}>
      <NextLink href={item.path} className={styles.titleLink}>
        {codeMark === "glyph" && !item.body && <CodeXml aria-label="Code page" className={styles.glyph} />}
        {item.title}
      </NextLink>
    </H3>
  );
}

/** What a code page shows in place of an excerpt. */
function CodeOpening({ item, codeMark = "count" }: { item: ContentItem; codeMark?: CodeMark | "glyph" }) {
  return (
    <>
      <Paragraph>{item.intro ?? item.description}</Paragraph>
      {codeMark === "sections" && headingsLine(item) && <Muted>{headingsLine(item)}</Muted>}
    </>
  );
}

/** A: plain running text, cut mid-thought. */
function RunningText({ item }: { item: ContentItem }) {
  const text = item.body ? plainExcerpt(item.body) : null;
  return (
    <article className={styles.entry}>
      <Title item={item} />
      {text ? <Paragraph>{text.text}…</Paragraph> : <CodeOpening item={item} />}
      <EntryFooter item={item} left={text?.moreWords} />
    </article>
  );
}

/** B: the real first blocks, rendered. */
function RenderedOpening({ item }: { item: ContentItem }) {
  const cut = item.body ? excerpt(item.body) : null;
  return (
    <article className={styles.entry}>
      <Title item={item} />
      {cut ? (
        <div className={styles.rendered}>
          <MarkdownRenderer source={cut.markdown} />
        </div>
      ) : (
        <CodeOpening item={item} />
      )}
      <EntryFooter item={item} left={cut?.moreWords} />
    </article>
  );
}

/** C: one paragraph per page, title run in at the start. */
function RunIn({ item }: { item: ContentItem }) {
  const text = item.body ? plainExcerpt(item.body, 50) : null;
  return (
    <article className={styles.runInEntry}>
      <Paragraph>
        <NextLink href={item.path} className={styles.titleLink}>
          <Bold>{item.title}.</Bold>
        </NextLink>{" "}
        {text ? `${text.text}…` : (item.intro ?? item.description)}
      </Paragraph>
      <EntryFooter item={item} left={text?.moreWords} />
    </article>
  );
}

/** F: the date hangs in a column to the left, the entry flows on the right. */
function DateGutter({ item }: { item: ContentItem }) {
  const cut = item.body ? excerpt(item.body) : null;
  return (
    <article className={styles.gutterEntry}>
      <Muted className={styles.gutterDate}>{dateOf(item)}</Muted>
      <div className={styles.entry}>
        <Title item={item} />
        {cut ? (
          <div className={styles.rendered}>
            <MarkdownRenderer source={cut.markdown} />
          </div>
        ) : (
          <CodeOpening item={item} />
        )}
        <EntryFooter item={item} left={cut?.moreWords} showDate={false} />
      </div>
    </article>
  );
}

const CODE_MARKS: { mark: CodeMark | "glyph"; name: string; note: string }[] = [
  { mark: "sections", name: "Section names", note: "The first few section names under the intro, as a table of contents in one line." },
  { mark: "file", name: "Source file", note: "The page's file in the footer: honest about what it is, and a hint for developers." },
  { mark: "glyph", name: "Code glyph", note: "A small </> before the title; nothing else changes." },
  { mark: "none", name: "No mark", note: "Just the intro and a plain link; a code page reads like any other." },
  { mark: "count", name: "Section count", note: "The call to action says how many sections there are, as prose says how many words." },
];

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

/** Entries in groups of one day each, newest day first. */
function byDay(items: ContentItem[]) {
  const sorted = [...items].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
  const days = new Map<string, ContentItem[]>();
  for (const item of sorted) days.set(dayOf(item), [...(days.get(dayOf(item)) ?? []), item]);
  return [...days];
}

const timeOf = (item: ContentItem) =>
  item.publishedAt
    ? new Date(item.publishedAt)
        .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: TIME_ZONE })
        .toLowerCase()
    : null;

/** How the end of an entry is punctuated: the word count, and the line of date, project and tags under it. */
type Delims = {
  /** between items on the tag line */
  sep: string;
  /** "comma": css, layout; "hash": #css #layout */
  tags: "comma" | "hash";
  /** [… 1,240 words], (1,240 more words), … 1,240 more words →, + 1,240 words */
  count: "brackets" | "parens" | "arrow" | "plus";
  /** the count leads the tag line instead of sitting on its own line */
  inline?: boolean;
  /** a # before the time or date, as a permalink */
  hash?: boolean;
  /** the tag line as a sentence: "4:45 pm in Goatboat, tagged css and layout" */
  sentence?: boolean;
};

const SLASHES: Delims = { sep: "/", tags: "comma", count: "brackets" };

// Picked so far: bracketed count, middle dots, hashtags, exact time
const CHOSEN: Delims = { sep: "·", tags: "hash", count: "brackets" };

/** What's left after the opening: words for prose, sections for a code page. */
function CountLink({ item, left, count }: { item: ContentItem; left?: number; count: Delims["count"] }) {
  const sections = sectionsOf(item).length;
  const n = left !== undefined ? left : sections;
  const unit = left !== undefined ? "words" : "sections";
  if (!n) return <NextLink href={item.path} className={styles.titleLink}>read it</NextLink>;

  const amount = `${n.toLocaleString("en-US")} ${unit}`;
  const more = `${n.toLocaleString("en-US")} more ${unit}`;
  const link = (text: string) => (
    <NextLink href={item.path} className={styles.titleLink}>
      {text}
    </NextLink>
  );
  if (count === "parens") return <span>({link(more)})</span>;
  if (count === "arrow") return link(`… ${more} →`);
  if (count === "plus") return link(`+ ${amount}`);
  return <span>[{link(`… ${amount}`)}]</span>;
}

function TagList({ item, style }: { item: ContentItem; style: Delims["tags"] }) {
  const tags = item.tags ?? [];
  return (
    <span className={style === "hash" ? styles.hashTags : undefined}>
      {tags.map((tag, i) => (
        <span key={tag}>
          {style === "comma" && i > 0 && ", "}
          <NextLink href={`/projects/goatboat/docs/feed?tag=${tag}`} className={styles.tagLink}>
            {style === "hash" ? `#${tag}` : tag}
          </NextLink>
        </span>
      ))}
    </span>
  );
}

/** The small line under a stream entry: time or date, project, tags, authors. */
function TagLine({
  item,
  left,
  showDate = true,
  delims = SLASHES,
}: {
  item: ContentItem;
  left?: number;
  showDate?: boolean;
  delims?: Delims;
}) {
  const when = showDate ? dateOf(item) : timeOf(item);
  const whenLink = when && (
    <NextLink href={item.path} className={styles.quietLink}>
      {delims.hash && "# "}
      {when}
    </NextLink>
  );

  if (delims.sentence) {
    const tags = item.tags ?? [];
    return (
      <Muted className={styles.tagLine}>
        <span>
          {whenLink}
          {item.project && (
            <>
              {" in "}
              <ProjectBadge title={item.project.title} />
            </>
          )}
          {tags.length > 0 && (
            <>
              {", tagged "}
              <TagList item={item} style={delims.tags} />
            </>
          )}
        </span>
      </Muted>
    );
  }

  const parts = [
    delims.inline && <CountLink key="count" item={item} left={left} count={delims.count} />,
    whenLink,
    item.project && <ProjectBadge key="project" title={item.project.title} />,
    item.tags?.length && <TagList key="tags" item={item} style={delims.tags} />,
    item.authors?.length && <span key="authors">{item.authors.join(", ")}</span>,
  ].filter(Boolean);

  return (
    <Muted className={styles.tagLine}>
      {parts.map((part, i) => (
        <span key={i} className={styles.part}>
          {i > 0 && <span aria-hidden>{delims.sep}</span>}
          {part}
        </span>
      ))}
    </Muted>
  );
}

/** G/H: stream entry: title, rendered opening, what's left, then the tag line. */
function StreamEntry({
  item,
  showDate,
  delims = SLASHES,
}: {
  item: ContentItem;
  showDate?: boolean;
  delims?: Delims;
}) {
  const cut = item.body ? excerpt(item.body) : null;
  return (
    <article className={styles.streamEntry}>
      <Title item={item} codeMark="glyph" />
      {cut ? (
        <div className={styles.rendered}>
          <MarkdownRenderer source={cut.markdown} />
        </div>
      ) : (
        <CodeOpening item={item} codeMark="none" />
      )}
      {!delims.inline && (
        <Paragraph>
          <CountLink item={item} left={cut?.moreWords} count={delims.count} />
        </Paragraph>
      )}
      <TagLine item={item} left={cut?.moreWords} showDate={showDate} delims={delims} />
    </article>
  );
}

/** A by-day stream of a few entries. */
function DayStream({ items, delims }: { items: ContentItem[]; delims?: Delims }) {
  return (
    <div className={styles.feed}>
      {byDay(items).map(([day, dayItems]) => (
        <section key={day} className={styles.day}>
          <Paragraph>
            <Bold>{day}</Bold>
          </Paragraph>
          <div className={styles.streamFeed}>
            {dayItems.map((item) => (
              <StreamEntry key={item.id} item={item} showDate={false} delims={delims} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

const DELIMS: { name: string; note: string; delims: Delims }[] = [
  { name: "Slashes", note: "The current one: [… N words] on its own line, then time / project / tags.", delims: SLASHES },
  { name: "Middle dots", note: "Same layout, softer separators.", delims: { ...SLASHES, sep: "·" } },
  { name: "Pipes", note: "Harder separators, more like a status bar.", delims: { ...SLASHES, sep: "|" } },
  { name: "Permalink hash", note: "A # before the time marks it as the entry's link.", delims: { ...SLASHES, hash: true } },
  { name: "Hashtags", note: "Tags written #like #this, with no commas between them.", delims: { ...SLASHES, tags: "hash" } },
  { name: "Parentheses", note: "(N more words) instead of brackets.", delims: { ...SLASHES, count: "parens" } },
  { name: "Plus count", note: "+ N words, the shortest count.", delims: { ...SLASHES, count: "plus" } },
  {
    name: "Count in the line",
    note: "No separate count line: the count leads the tag line, as an arrow link.",
    delims: { ...SLASHES, sep: "·", count: "arrow", inline: true },
  },
  {
    name: "Sentence",
    note: "The tag line reads as a sentence: 4:45 pm in Goatboat, tagged css, layout.",
    delims: { ...SLASHES, sentence: true },
  },
];

export default async function BrowsePreviewsPage() {
  const [entries, projects] = await Promise.all([loadEntries(), listProjects()]);
  const prose = entries.filter((e) => e.body).slice(0, 3);
  const code = entries.filter((e) => !e.body);
  const sample = [...prose, ...code.slice(0, 2)];
  const small = [...prose.slice(0, 2), ...code.slice(0, 1)];
  const codeSample = code.find((e) => sectionsOf(e).length > 2) ?? code[0];
  // the entries with the most to show on a tag line, so the delimiters have something to separate
  const richness = (e: ContentItem) => (e.tags?.length ?? 0) + (e.project ? 2 : 0);
  const pair = [
    [...entries.filter((e) => e.body)].sort((a, b) => richness(b) - richness(a))[0],
    codeSample,
  ].filter(Boolean);

  return (
    <PageLayout hideRelated>
      <PageHeader intro="A few pages from /docs and /tests shown several ways, to pick how the docs and tests homepages should read. No boxes: one connected run of text, with date, author, project and what's left at the bottom of each entry." />

      <H2>Chosen so far</H2>
      <Muted>Bracketed word count, middle dots, hashtags and the exact time, in the by-day stream.</Muted>
      <DayStream items={small} delims={CHOSEN} />

      <H2>Delimiters</H2>
      <Muted>
        The by-day stream with one article and one code page, punctuated different ways. The day heading
        carries the date, so each entry's line shows the time.
      </Muted>
      {DELIMS.map(({ name, note, delims }) => (
        <section key={name} className={styles.option}>
          <H3>{name}</H3>
          <Muted className={styles.optionLabel}>{note}</Muted>
          <DayStream items={pair} delims={delims} />
        </section>
      ))}

      <H2>G. Stream, by day</H2>
      <Muted>
        Entries grouped under a day heading, the word count in brackets right where the
        opening stops, then a small date / project / tags line and a hairline before the next entry.
      </Muted>
      <DayStream items={small} />

      <H2>H. Stream, no days</H2>
      <Muted>The same entries without day headings; the date leads the tag line instead.</Muted>
      <div className={styles.streamFeed}>
        {small.map((item) => (
          <StreamEntry key={item.id} item={item} />
        ))}
      </div>

      <H2>A. Running text</H2>
      <Muted>The opening as plain text, cut mid-thought.</Muted>
      <div className={styles.feed}>
        {sample.map((item) => (
          <RunningText key={item.id} item={item} />
        ))}
      </div>

      <H2>B. Rendered opening</H2>
      <Muted>The real first blocks, lists and code included.</Muted>
      <div className={styles.feed}>
        {sample.map((item) => (
          <RenderedOpening key={item.id} item={item} />
        ))}
      </div>

      <H2>C. Run-in titles</H2>
      <Muted>One paragraph per page with the title in bold at the start. The densest option.</Muted>
      <div className={styles.runInFeed}>
        {sample.map((item) => (
          <RunIn key={item.id} item={item} />
        ))}
      </div>

      <H2>D. Hairline rules</H2>
      <Muted>Rendered openings with a thin rule between entries instead of a gap.</Muted>
      <div className={styles.ruledFeed}>
        {sample.map((item) => (
          <RenderedOpening key={item.id} item={item} />
        ))}
      </div>

      <H2>E. Book breaks</H2>
      <Muted>Running text separated by a centered ⁂, like sections of a chapter.</Muted>
      <div className={styles.dinkusFeed}>
        {sample.map((item) => (
          <RunningText key={item.id} item={item} />
        ))}
      </div>

      <H2>F. Date gutter</H2>
      <Muted>The date hangs to the left on wide screens; on phones it sits above the title.</Muted>
      <div className={styles.feed}>
        {sample.map((item) => (
          <DateGutter key={item.id} item={item} />
        ))}
      </div>

      {codeSample && (
        <>
          <H2>Marking code pages</H2>
          <Muted>One code page, {codeSample.title}, with each way of telling it apart from an article.</Muted>
          <div className={styles.feed}>
            {CODE_MARKS.map(({ mark, name, note }) => (
              <div key={mark} className={styles.option}>
                <Muted className={styles.optionLabel}>
                  <Bold>{name}.</Bold> {note}
                </Muted>
                <article className={styles.entry}>
                  <Title item={codeSample} codeMark={mark === "glyph" ? "glyph" : undefined} />
                  <CodeOpening item={codeSample} codeMark={mark} />
                  <EntryFooter item={codeSample} codeMark={mark === "glyph" ? "none" : mark} />
                </article>
              </div>
            ))}
          </div>
        </>
      )}

      <H2>Project badge</H2>
      <Muted>How a page's project shows in its footer, using the real projects.</Muted>
      <div className={styles.badges}>
        {projects.map((project) => (
          <ProjectBadge key={project.slug} title={project.title} />
        ))}
      </div>
    </PageLayout>
  );
}
