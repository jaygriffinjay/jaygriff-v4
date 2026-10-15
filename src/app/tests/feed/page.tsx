import NextLink from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Paragraph } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { contentTypes, listContent, type FeedItem } from "@/lib/goatboat";
import { cn } from "@/lib/utils";
import { TagLinks } from "../_components/tag-links";
import styles from "./page.module.css";

const filters = [undefined, ...contentTypes];

const feedHref = (type?: string, tag?: string) => {
  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (tag) params.set("tag", tag);
  const query = params.toString();
  return query ? `/tests/feed?${query}` : "/tests/feed";
};

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; tag?: string }>;
}) {
  const { type: param, tag } = await searchParams;
  const type = contentTypes.find((t) => t === param);
  const items = await listContent({ type, tag });

  return (
    <PageLayout>
      <PageHeader />
      <Paragraph className={styles.intro}>
        {tag && `#${tag} · `}{items.length} items.{" "}
        {tag && (
          <NextLink href={feedHref(type)} className={styles.clear}>
            Clear tag
          </NextLink>
        )}
      </Paragraph>

      <nav aria-label="Filter by type" className={styles.filters}>
        {filters.map((filter) => (
          <NextLink
            key={filter ?? "all"}
            href={feedHref(filter, tag)}
            aria-current={filter === type ? "page" : undefined}
            className={cn(styles.filter, filter === type && styles.filterActive)}
          >
            {filter ?? "all"}
          </NextLink>
        ))}
      </nav>

      <ul className={styles.list}>
        {items.map((item) => (
          <FeedEntry key={item.id} item={item} />
        ))}
      </ul>
    </PageLayout>
  );
}

function FeedEntry({ item }: { item: FeedItem }) {
  const permalink = `/tests/content${item.path}`;

  return (
    <li className={styles.item}>
      {item.cover && (
        <Image
          src={item.cover.url}
          alt={item.cover.alt ?? ""}
          width={item.cover.width ?? 1200}
          height={item.cover.height ?? 630}
          unoptimized
          className={styles.cover}
        />
      )}

      <div className={styles.body}>
        <div className={styles.meta}>
          <Badge variant="outline">{item.type}</Badge>
          {item.publishedAt && (
            <NextLink href={permalink} className={styles.date}>
              {format(new Date(item.publishedAt), "MMM d, yyyy")}
            </NextLink>
          )}
        </div>

        {item.type === "link" && item.targetUrl ? (
          <a href={item.targetUrl} className={styles.itemTitle}>
            {item.title} ↗
          </a>
        ) : (
          <NextLink href={permalink} className={styles.itemTitle}>
            {item.title}
          </NextLink>
        )}

        {item.description && <Paragraph className={styles.description}>{item.description}</Paragraph>}

        {item.viaName && <Paragraph className={styles.via}>via {item.viaName}</Paragraph>}

        {item.tags && item.tags.length > 0 && <TagLinks tags={item.tags} className={styles.tags} />}
      </div>
    </li>
  );
}
