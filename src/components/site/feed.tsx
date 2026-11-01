import Image from "next/image";
import NextLink from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Italic, Lead, Muted } from "@/components/typography";
import type { FeedItem } from "@/lib/goatboat";
import { cn } from "@/lib/utils";
import styles from "./feed.module.css";

/** Content rows as a list, in the order given: cover, type, date, title and summary. */
export function Feed({ items, className }: { items: FeedItem[]; className?: string }) {
  if (!items.length) return <Lead className={styles.empty}>Nothing here yet.</Lead>;

  return (
    <ul className={cn(styles.list, className)}>
      {items.map((item) => (
        <FeedEntry key={item.id} item={item} />
      ))}
    </ul>
  );
}

function FeedEntry({ item }: { item: FeedItem }) {
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
            <NextLink href={item.path} className={styles.date}>
              {format(new Date(item.publishedAt), "MMM d, yyyy")}
            </NextLink>
          )}
        </div>

        {item.type === "link" && item.targetUrl ? (
          <a href={item.targetUrl} className={styles.title}>
            {item.title} ↗
          </a>
        ) : (
          <NextLink href={item.path} className={styles.title}>
            {item.title}
          </NextLink>
        )}

        {item.description && <Muted className={styles.description}>{item.description}</Muted>}
        {item.viaName && (
          <Muted className={styles.via}>
            <Italic>via {item.viaName}</Italic>
          </Muted>
        )}
      </div>
    </li>
  );
}
