// goatboat: 6ba9ef70-d36c-4760-875f-7322137a2cc1
import Image from "next/image";
import NextLink from "next/link";
import { H3, Paragraph } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { Artifact } from "@/components/site/artifact";
import { Badge } from "@/components/ui/badge";
import { getContentByPath, listContent, type FeedItem } from "@/lib/goatboat";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

const tagHref = (tag?: string) => (tag ? `/artifacts?tag=${encodeURIComponent(tag)}` : "/artifacts");

/** Where an artifact's html file is hosted, for its card's expand button. Nothing when it has none. The list doesn't carry it, so each artifact's own page data is asked, as the arcade does. */
async function htmlOf(path: string) {
  const page = await getContentByPath(path);
  if (!page || "redirectTo" in page) return null;
  return page.item.assets.find((a) => a.kind === "html" && a.role === "hero")?.url ?? null;
}

/** Every published artifact as a card, filterable by tag. */
export default async function ArtifactsPage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await searchParams;
  const all = await listContent({ type: "artifact" });
  const tags = [...new Set(all.flatMap((item) => item.tags ?? []))].sort();
  const items = tag ? all.filter((item) => item.tags?.includes(tag)) : all;
  const sources = await Promise.all(items.map((item) => htmlOf(item.path)));

  return (
    <PageLayout hideRelated hideToc>
      <PageHeader intro="Small interactive things, each one a single page of its own, grouped by what I was testing." />

      {tags.length > 0 && (
        <nav aria-label="Filter by tag" className={styles.filters}>
          {[undefined, ...tags].map((filter) => (
            <NextLink
              key={filter ?? "all"}
              href={tagHref(filter)}
              aria-current={filter === tag ? "page" : undefined}
              className={cn(styles.filter, filter === tag && styles.filterActive)}
            >
              {filter ?? "all"}
            </NextLink>
          ))}
        </nav>
      )}

      {items.length === 0 ? (
        <Paragraph>{tag ? `Nothing tagged ${tag}.` : "No artifacts yet."}</Paragraph>
      ) : (
        <ul className={styles.grid}>
          {items.map((item, i) => (
            <ArtifactCard key={item.id} item={item} src={sources[i]} />
          ))}
        </ul>
      )}
    </PageLayout>
  );
}

function ArtifactCard({ item, src }: { item: FeedItem; src: string | null }) {
  const cover = (
    // The title below links to the page too, so the picture's link stays out of the tab order
    <NextLink href={item.path} className={styles.coverLink} tabIndex={-1} aria-hidden="true">
      {item.cover ? (
        <Image
          src={item.cover.url}
          alt={item.cover.alt ?? ""}
          width={item.cover.width ?? 640}
          height={item.cover.height ?? 360}
          sizes="(min-width: 56rem) 18rem, (min-width: 40rem) calc(50vw - 1.5rem), calc(100vw - 2rem)"
          unoptimized={item.cover.url.endsWith(".svg")}
          className={styles.cover}
        />
      ) : (
        <div className={styles.noCover} />
      )}
    </NextLink>
  );

  return (
    <li className={styles.card}>
      {/* An artifact with an html file gets the expand button on its picture; it loads that file right here. No page link is given, so expanded it's just a Minimize button: this list is already the way to more artifacts */}
      {src ? <Artifact src={src} title={item.title} poster={cover} /> : cover}
      <NextLink href={item.path} className={styles.cardLink}>
        <H3 className={styles.cardTitle}>{item.title}</H3>
        {item.description && <Paragraph className={styles.cardDescription}>{item.description}</Paragraph>}
        {item.tags && item.tags.length > 0 && (
          <div className={styles.cardTags}>
            {item.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </NextLink>
    </li>
  );
}
