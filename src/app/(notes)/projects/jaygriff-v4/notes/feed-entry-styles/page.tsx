// goatboat: c94dbfdd-5d1e-4e16-b3e4-e60d1a0dd7fc
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { excerpt } from "@/lib/excerpt";
import { PageLayout } from "@/components/site/page-layout";
import { H2, H4, Muted, Paragraph, Title } from "@/components/typography";
import type { ContentItem } from "@/lib/goatboat";
import styles from "./page.module.css";

const PATH = "/projects/jaygriff-v4/notes/feed-entry-styles";
const PUBLISHED_AT = "2026-03-10T12:00:00.000Z";

const fixture = (
  id: string,
  title: string,
  type: ContentItem["type"],
  body: string | null,
  tags: string[],
  assets: ContentItem["assets"] = [],
): ContentItem => ({
  id,
  parentId: null,
  slug: id,
  path: PATH,
  type,
  status: "published",
  title,
  description: body ? null : "A short description for this sample entry.",
  intro: null,
  body,
  toc: null,
  format: "md",
  componentKey: null,
  contentHash: null,
  authors: ["Jay Griffin", "Claude Sonnet 4.5"],
  authorship: "human",
  authorshipNote: null,
  tags,
  projectId: null,
  publishedAt: PUBLISHED_AT,
  revisedAt: null,
  sortOrder: 0,
  source: "db",
  file: null,
  missingSince: null,
  createdAt: PUBLISHED_AT,
  updatedAt: PUBLISHED_AT,
  link: null,
  project: { slug: "jaygriff-v4", title: "jaygriff-v4" },
  section: null,
  assets,
});

const sampleImage: ContentItem["assets"][number] = {
  id: 0,
  projectId: null,
  contentId: null,
  url: "/images/paint3.png",
  kind: "image",
  role: "hero",
  alt: "A colorful abstract drawing in a classic painting app",
  width: 1280,
  height: 720,
  sortOrder: 0,
  createdAt: PUBLISHED_AT,
};

const items: ContentItem[] = [
  fixture(
    "frame-artifact",
    "Image-Led Artifact",
    "artifact",
    "A real image-led entry with a short description and several metadata fields.",
    ["visual-design", "experiments", "webgl"],
    [sampleImage],
  ),
  fixture(
    "frame-writing",
    "Writing Entry with a Continuation",
    "post",
    "A writing entry starts with a few paragraphs that introduce the topic before the rest of the article. This fixture has enough words for the feed excerpt to produce a continuation link.\n\n" +
      "The next paragraph gives more detail about the idea and lets us inspect how the separator and shadow sit below the excerpt and metadata.\n\n" +
      "A final paragraph confirms that there is still more writing after the visible portion of the feed item.",
    ["writing", "interface-design", "content-layout"],
  ),
  fixture(
    "frame-page",
    "Project Update Page",
    "page",
    null,
    ["project-update", "notes"],
  ),
];

type RailLength = "none" | "short" | "medium" | "long" | "full";
type RailShadow = "none" | "left" | "bottom" | "both";

type Treatment = {
  title: string;
  horizontal: RailLength;
  vertical: RailLength;
  shadow: RailShadow;
};

const treatments: Treatment[] = [
  { title: "Plain", horizontal: "none", vertical: "none", shadow: "none" },
  { title: "Centered horizontal rule, short", horizontal: "short", vertical: "none", shadow: "none" },
  { title: "Centered horizontal rule, medium", horizontal: "medium", vertical: "none", shadow: "none" },
  { title: "Centered horizontal rule, long", horizontal: "long", vertical: "none", shadow: "none" },
  { title: "Centered horizontal rule, full", horizontal: "full", vertical: "none", shadow: "none" },
  { title: "Centered vertical rail, short", horizontal: "none", vertical: "short", shadow: "none" },
  { title: "Centered vertical rail, medium", horizontal: "none", vertical: "medium", shadow: "none" },
  { title: "Centered vertical rail, long", horizontal: "none", vertical: "long", shadow: "none" },
  { title: "Centered vertical rail, full", horizontal: "none", vertical: "full", shadow: "none" },
  { title: "Shadow on left rail", horizontal: "none", vertical: "full", shadow: "left" },
  { title: "Shadow on bottom rail", horizontal: "full", vertical: "none", shadow: "bottom" },
  { title: "Shadow on both rails", horizontal: "full", vertical: "full", shadow: "both" },
  { title: "Combined medium rails and shadows", horizontal: "medium", vertical: "medium", shadow: "both" },
];

function EntryExample({ item, treatment }: { item: ContentItem; treatment: Treatment }) {
  const image = item.assets.find((asset) => asset.kind === "image" && asset.role === "hero") ??
    item.assets.find((asset) => asset.kind === "image" && asset.role === "thumbnail");
  const cut = item.body ? excerpt(item.body) : null;
  const time = item.publishedAt
    ? new Date(item.publishedAt)
        .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Chicago" })
        .toLowerCase()
    : null;
  const leftShadow = treatment.shadow === "left" || treatment.shadow === "both";
  const bottomShadow = treatment.shadow === "bottom" || treatment.shadow === "both";

  return (
    <article className={styles.entry}>
      <div className={styles.frame}>
        {treatment.vertical !== "none" && (
          <span
            aria-hidden="true"
            className={styles.verticalRail}
            data-length={treatment.vertical}
            data-shadow={leftShadow ? "true" : undefined}
          />
        )}
        {treatment.horizontal !== "none" && (
          <span
            aria-hidden="true"
            className={styles.horizontalRail}
            data-length={treatment.horizontal}
            data-shadow={bottomShadow ? "true" : undefined}
          />
        )}
        {image && (
          <Image
            src={image.url}
            alt={image.alt ?? item.title}
            width={image.width ?? 1280}
            height={image.height ?? 720}
            sizes="(min-width: 56rem) 42rem, calc(100vw - 3rem)"
            unoptimized={image.url.startsWith("/") || image.url.endsWith(".svg")}
            className={styles.image}
          />
        )}
        <div className={styles.content}>
          <div className={styles.titleRow}>
            <H4 className={styles.title}>{item.title}</H4>
            <Badge variant="outline">{item.type}</Badge>
          </div>
          {cut ? (
            <div className={styles.body}>
              <MarkdownRenderer source={cut.markdown} />
            </div>
          ) : (
            item.description && <Paragraph className={styles.description}>{item.description}</Paragraph>
          )}
          {cut && cut.moreWords > 0 && (
            <Muted className={styles.more}>[… {cut.moreWords.toLocaleString("en-US")} words]</Muted>
          )}
          <Muted className={styles.metadata}>
            {item.authors?.length ? <span>{item.authors.join(", ")}</span> : null}
            {time && <span>{time}</span>}
            {item.project && <span className={styles.project}>{item.project.title}</span>}
            {!!item.tags?.length && <span className={styles.tags}>{item.tags.map((tag) => `#${tag}`).join(" ")}</span>}
          </Muted>
        </div>
      </div>
    </article>
  );
}

export default function FeedEntryStylesPage() {
  return (
    <PageLayout outsideTree hideRelated hideToc>
      <div className={styles.page}>
        <header className={styles.intro}>
          <Title>Feed Entry Frame Tests</Title>
          <Paragraph>
            Compare separators, positional drop shadows and combinations on the same image, post and page entries.
          </Paragraph>
          <Muted>All treatments are test-only; the production feed remains undecorated by default.</Muted>
        </header>
        {treatments.map((treatment) => (
          <section key={treatment.title} className={styles.variant}>
            <H2 className={styles.heading}>{treatment.title}</H2>
            <div className={styles.entries}>
              {items.map((item) => (
                <EntryExample key={item.id} item={item} treatment={treatment} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageLayout>
  );
}