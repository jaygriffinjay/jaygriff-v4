// goatboat: de28e155-119b-4abf-9fcf-b976dde0681c
import NextLink from "next/link";
import { InlineCode, Paragraph } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { currentPath } from "@/lib/page-meta";
import styles from "./page.module.css";

const BASE = "/projects/jaygriff-v4/docs/breadcrumb-trail";

// Any depth renders, so every crumb in the trail is a working link
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
  const deeper = ["alpha", "beta", "a-longer-child-page-title"];

  return (
    <PageLayout>
      <PageHeader />
      <Paragraph>
        Any path under <InlineCode>{BASE}</InlineCode> renders this page, titled from its last segment, to test
        breadcrumb trails of any depth.
      </Paragraph>

      <ul className={styles.list}>
        {presets.map((preset) => (
          <li key={preset.path}>
            <NextLink href={preset.path} className={styles.link}>
              {preset.label}
            </NextLink>
          </li>
        ))}
      </ul>

      <Paragraph>Go one level deeper from here:</Paragraph>
      <ul className={styles.list}>
        {deeper.map((slug) => (
          <li key={slug}>
            <NextLink href={`${path}/${slug}`} className={styles.link}>
              {slug}
            </NextLink>
          </li>
        ))}
      </ul>
    </PageLayout>
  );
}
