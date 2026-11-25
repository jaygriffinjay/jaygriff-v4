// goatboat: de28e155-119b-4abf-9fcf-b976dde0681c
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { InlineCode, Paragraph } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { currentPath } from "@/lib/page-meta";
import styles from "./page.module.css";

const BASE = "/projects/jaygriff-v4/notes/breadcrumb-trail";

// The longest preset is six levels, so deeper paths 404.
// "Go deeper" links stop at two levels: with no limit, each page linked three more, an endless set of URLs
// that a crawler followed for hundreds of thousands of requests. The presets cover the deep cases.
const MAX_DEPTH = 6;
const MAX_LINKED_DEPTH = 2;

// Any depth up to the limit renders, so every crumb in the trail is a working link
const presets = [
  { label: "Short, six levels", path: `${BASE}/one/two/three/four/five/six` },
  {
    label: "Long titles, four levels",
    path: `${BASE}/a-section-with-a-fairly-long-name/another-long-subsection-title/a-page-title-that-keeps-going-and-going/the-final-page-with-the-longest-title-of-all`,
  },
  { label: "Mixed, five levels", path: `${BASE}/projects/goatboat/database/migrations/rollback-and-recovery-procedures` },
];

export default async function BreadcrumbTrailTestPage() {
  const path = await currentPath();
  const depth = path.slice(BASE.length).split("/").filter(Boolean).length;
  if (depth > MAX_DEPTH) notFound();
  const deeper = depth < MAX_LINKED_DEPTH ? ["alpha", "beta", "a-longer-child-page-title"] : [];

  return (
    <PageLayout>
      <PageHeader />
      <Paragraph>
        Any path up to {MAX_DEPTH} levels under <InlineCode>{BASE}</InlineCode> renders this page, titled from its
        last segment, to test breadcrumb trails of different depths.
      </Paragraph>

      <ul className={styles.list}>
        {presets.map((preset) => (
          <li key={preset.path}>
            <NextLink href={preset.path} prefetch={false} rel="nofollow" className={styles.link}>
              {preset.label}
            </NextLink>
          </li>
        ))}
      </ul>

      {deeper.length > 0 && (
        <>
          <Paragraph>Go one level deeper from here:</Paragraph>
          <ul className={styles.list}>
            {deeper.map((slug) => (
              <li key={slug}>
                <NextLink href={`${path}/${slug}`} prefetch={false} rel="nofollow" className={styles.link}>
                  {slug}
                </NextLink>
              </li>
            ))}
          </ul>
        </>
      )}
    </PageLayout>
  );
}
