import NextLink from "next/link";
import { H2, InlineCode, Paragraph, Small } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

const groups = [
  {
    label: "Grays, getting darker",
    colors: [
      { name: "#ebebeb (current)", className: styles.gray1 },
      { name: "#dcdce2", className: styles.gray2 },
      { name: "#cfcfd6", className: styles.gray3 },
      { name: "#c4c4cc (close to the muted text)", className: styles.gray4 },
      { name: "#b8b8c2", className: styles.gray5 },
      { name: "#acacb6", className: styles.gray6 },
      { name: "#a0a0aa", className: styles.gray7 },
    ],
  },
  {
    label: "Purple-grays, around #7b6d8d",
    colors: [
      { name: "#d4ccde", className: styles.purple1 },
      { name: "#c6bdd2", className: styles.purple2 },
      { name: "#b5aac3", className: styles.purple3 },
      { name: "#a397b3", className: styles.purple4 },
      { name: "#8f82a0", className: styles.purple5 },
      { name: "#7b6d8d (the heading color you tried)", className: styles.purple6 },
    ],
  },
];

function Sample({ name, className }: { name: string; className: string }) {
  return (
    <section className={cn(styles.sample, className)}>
      <Small className={styles.label}>{name}</Small>
      <H2 className={styles.heading}>Every page gets a row</H2>
      <Paragraph className={styles.intro}>Muted intro text, as used under page titles and in lists.</Paragraph>
      <Paragraph className={styles.body}>
        The site syncs its code pages to goatboat on every push, so titles, descriptions and the breadcrumb
        trail all come from one place. Read the{" "}
        <NextLink href="/docs/mvp" className={styles.link}>
          MVP plan
        </NextLink>{" "}
        for the order of work.
      </Paragraph>
      <Paragraph className={styles.body}>
        New folders arrive as drafts with a title made from their slug, so <InlineCode>code-blocks</InlineCode>{" "}
        becomes &ldquo;Code blocks&rdquo; until someone writes a real one.
      </Paragraph>
    </section>
  );
}

export default function BodyTextPage() {
  return (
    <PageLayout>
      <PageHeader />
      {groups.map((group) => (
        <div key={group.label} className={styles.group}>
          <Small className={styles.groupLabel}>{group.label}</Small>
          {group.colors.map((color) => (
            <Sample key={color.name} {...color} />
          ))}
        </div>
      ))}
    </PageLayout>
  );
}
