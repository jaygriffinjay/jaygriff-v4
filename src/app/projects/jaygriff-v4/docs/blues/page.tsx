// goatboat: 7b667507-ca27-4725-9081-9d6c008cc4b4
import NextLink from "next/link";
import { H2, H3, InlineCode, Paragraph, Small } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import styles from "./page.module.css";

const blues = [
  { name: "Current primary", value: "#7eb8ff", className: styles.current },
  { name: "GitHub link", value: "#4493f8", className: styles.github },
  { name: "Deep azure (headings)", value: "oklch(0.6 0.16 255)", className: styles.deepAzure },
  { name: "Code blue", value: "oklch(0.66 0.18 252)", className: styles.code },
  { name: "GitHub classic", value: "#58a6ff", className: styles.githubClassic },
  { name: "Soft sky", value: "#6cb6ff", className: styles.softSky },
];

export default function BluesPage() {
  return (
    <PageLayout>
      <PageHeader />

      <div className={styles.list}>
        {blues.map((blue) => (
          <section key={blue.name} className={blue.className}>
            <div className={styles.label}>
              <span className={styles.swatch} />
              <span className={styles.name}>{blue.name}</span>
              <InlineCode>{blue.value}</InlineCode>
            </div>

            <H2 className={styles.h2}>A big heading in this blue</H2>
            <H3 className={styles.h3}>
              A smaller heading with{" "}
              <NextLink href="/projects/jaygriff-v4/docs/blues" className={styles.link}>
                a link inside it
              </NextLink>
            </H3>

            <Paragraph>
              Body text with{" "}
              <NextLink href="/projects/jaygriff-v4/docs/blues" className={styles.link}>
                an inline link
              </NextLink>{" "}
              and{" "}
              <NextLink href="/projects/jaygriff-v4/docs/blues" className={styles.link}>
                a longer link that keeps going for a while
              </NextLink>
              , next to some <InlineCode>inline code</InlineCode>.{" "}
              <span className={styles.text}>This phrase is the blue as plain text.</span>
            </Paragraph>

            <Small className={styles.meta}>
              Posted Oct 10, 2026 in{" "}
              <NextLink href="/projects/jaygriff-v4/docs/blues" className={styles.link}>
                design
              </NextLink>
            </Small>
          </section>
        ))}
      </div>
    </PageLayout>
  );
}
