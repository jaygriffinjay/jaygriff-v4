import NextLink from "next/link";
import { cn } from "@/lib/utils";
import styles from "./tag-links.module.css";

export const tagHref = (tag: string) => `/projects/goatboat/notes/feed?tag=${encodeURIComponent(tag)}`;

export function TagLinks({ tags, className }: { tags: string[]; className?: string }) {
  return (
    <ul className={cn(styles.tags, className)}>
      {tags.map((tag) => (
        <li key={tag}>
          <NextLink href={tagHref(tag)} className={styles.tag}>
            #{tag}
          </NextLink>
        </li>
      ))}
    </ul>
  );
}
