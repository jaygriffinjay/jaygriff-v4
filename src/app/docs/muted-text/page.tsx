import NextLink from "next/link";
import { H2, Paragraph, Small } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

const groups = [
  {
    label: "Styles, all in oklch(0.8 0.08 272)",
    samples: [
      { name: "★ Regular", className: styles.base },
      { name: "Smaller (14px)", className: cn(styles.base, styles.small) },
      { name: "Italic", className: cn(styles.base, styles.italic) },
      { name: "Small italic", className: cn(styles.base, styles.small, styles.italic) },
      { name: "Light weight", className: cn(styles.base, styles.light) },
      { name: "Small + light weight", className: cn(styles.base, styles.small, styles.light) },
      { name: "Medium weight", className: cn(styles.base, styles.medium) },
      { name: "Tagline style: small, caps, spaced", className: cn(styles.base, styles.tagline) },
    ],
  },
  {
    label: "Color nudges, regular style",
    samples: [
      { name: "Lighter · oklch(0.83 0.07 272)", className: styles.nudge1 },
      { name: "Darker · oklch(0.77 0.09 272)", className: styles.nudge2 },
      { name: "More color · oklch(0.8 0.1 272)", className: styles.nudge3 },
      { name: "Less color · oklch(0.8 0.06 272)", className: styles.nudge4 },
      { name: "Bluer · oklch(0.8 0.08 264)", className: styles.nudge5 },
    ],
  },
];

function Sample({ name, className }: { name: string; className: string }) {
  return (
    <section className={cn(styles.sample, className)}>
      <Small className={styles.label}>{name}</Small>

      <Paragraph className={styles.title}>Routes as data</Paragraph>
      <Paragraph className={cn(styles.muted, styles.intro)}>
        Proposal: give every page, including TSX ones, a row in the content database.
      </Paragraph>

      <Paragraph className={styles.body}>
        The site syncs its code pages to goatboat on every push, so titles and descriptions come from one
        place. Read the{" "}
        <NextLink href="/docs/mvp" className={styles.link}>
          MVP plan
        </NextLink>{" "}
        for the order of work.
      </Paragraph>

      <H2 className={styles.h2}>Related pages</H2>
      <ul className={styles.list}>
        <li>
          <NextLink href="/docs/blues" className={styles.listLink}>
            Blue tester
          </NextLink>
          <Paragraph className={cn(styles.muted, styles.description)}>
            Candidate blues side by side across headings, links, and text.
          </Paragraph>
        </li>
        <li>
          <NextLink href="/docs/code-blocks" className={styles.listLink}>
            Code blocks
          </NextLink>
          <Paragraph className={cn(styles.muted, styles.description)}>
            The VS Code-style code block: snippets, multi-file tabs, explorer, wrap, copy.
          </Paragraph>
        </li>
      </ul>

      <Small className={cn(styles.muted, styles.meta)}>Published Oct 15, 2026 · 4 min read</Small>
    </section>
  );
}

export default function MutedTextPage() {
  return (
    <PageLayout>
      <PageHeader />
      {groups.map((group) => (
        <div key={group.label} className={styles.group}>
          <Small className={styles.groupLabel}>{group.label}</Small>
          {group.samples.map((sample) => (
            <Sample key={sample.name} {...sample} />
          ))}
        </div>
      ))}
    </PageLayout>
  );
}
