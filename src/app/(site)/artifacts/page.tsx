// goatboat: 6ba9ef70-d36c-4760-875f-7322137a2cc1
import Image from "next/image";
import NextLink from "next/link";
import { H3, Paragraph } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { Badge } from "@/components/ui/badge";
import { listContent, type FeedItem } from "@/lib/goatboat";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

const tagHref = (tag?: string) => (tag ? `/artifacts?tag=${encodeURIComponent(tag)}` : "/artifacts");

/** Every published artifact as a card, filterable by tag. */
export default async function ArtifactsPage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await searchParams;
  const all = await listContent({ type: "artifact" });
  const tags = [...new Set(all.flatMap((item) => item.tags ?? []))].sort();
  const items = tag ? all.filter((item) => item.tags?.includes(tag)) : all;

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
          {items.map((item) => (
            <ArtifactCard key={item.id} item={item} />
          ))}
        </ul>
      )}
    </PageLayout>
  );
}

function ArtifactCard({ item }: { item: FeedItem }) {
  return (
    <li>
      <NextLink href={item.path} className={styles.card}>
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
        <div className={styles.cardBody}>
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
        </div>
      </NextLink>
    </li>
  );
}
