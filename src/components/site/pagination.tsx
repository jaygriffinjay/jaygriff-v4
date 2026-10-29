import NextLink from "next/link";
import { pageHref } from "@/lib/page-href";
import { cn } from "@/lib/utils";
import { PageJump } from "./page-jump";
import styles from "./pagination.module.css";
import { StepLink, StepLinks } from "./step-links";

type PaginationProps = {
  page: number;
  pageCount: number;
  /** Path of the list; page links are plain, so every page can be crawled. */
  basePath: string;
  className?: string;
};

// The first and last pages and the current one with its neighbours, with a gap marker between runs
function visiblePages(page: number, count: number) {
  const pages = [...new Set([1, count, page - 1, page, page + 1])].filter((p) => p >= 1 && p <= count).sort((a, b) => a - b);
  return pages.flatMap((p, i) => (i > 0 && p - pages[i - 1] > 1 ? (["gap", p] as const) : [p]));
}

/** Numbered page links with previous and next steps. */
export function Pagination({ page, pageCount, basePath, className }: PaginationProps) {
  if (pageCount <= 1) return null;
  const href = (p: number) => pageHref(basePath, p);

  return (
    <nav aria-label="Pagination" className={cn(styles.nav, className)}>
      <ol className={styles.pages}>
        {visiblePages(page, pageCount).map((p, i) =>
          p === "gap" ? (
            <li key={`gap-${i}`}>
              <PageJump pageCount={pageCount} basePath={basePath} label="Go to a page" className={styles.gap}>
                …
              </PageJump>
            </li>
          ) : (
            <li key={p}>
              {p === page ? (
                <PageJump
                  pageCount={pageCount}
                  basePath={basePath}
                  label={`Page ${p} of ${pageCount}, go to another page`}
                  current
                  className={cn(styles.page, styles.current)}
                >
                  {p}
                </PageJump>
              ) : (
                <NextLink href={href(p)} className={styles.page}>
                  {p}
                </NextLink>
              )}
            </li>
          ),
        )}
      </ol>

      <StepLinks>
        {page > 1 && (
          <StepLink direction="prev" rel="prev" href={href(page - 1)} label="← Previous" title={`Page ${page - 1}`} />
        )}
        {page < pageCount && (
          <StepLink direction="next" rel="next" href={href(page + 1)} label="Next →" title={`Page ${page + 1}`} />
        )}
      </StepLinks>
    </nav>
  );
}
