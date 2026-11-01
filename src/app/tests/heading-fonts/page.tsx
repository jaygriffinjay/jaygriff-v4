// goatboat: 9fd2c237-fa12-4e61-8fda-3f0a5d887bc3
import NextLink from "next/link";
import { H2, H3, Paragraph, Small } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { cn } from "@/lib/utils";
import { fontGroups } from "./fonts";
import styles from "./page.module.css";

const groups = [
  {
    label: "Already on the site",
    fonts: [
      { name: "Geist (current)", className: styles.geist },
      { name: "JetBrains Mono", className: styles.mono },
    ],
  },
  ...fontGroups,
];

const colorGroups = [
  {
    label: "Heading colors: your picks",
    colors: [
      { name: "#93748A", className: styles.pick1 },
      { name: "#7E5A9B", className: styles.pick2 },
      { name: "#A1869E", className: styles.pick3 },
      { name: "#F6F0ED", className: styles.pick4 },
      { name: "#AE8CA3", className: styles.pick5 },
      { name: "#E0E2DB", className: styles.pick6 },
      { name: "#7B6D8D", className: styles.pick7 },
      { name: "#8B687F", className: styles.pick8 },
      { name: "#55917F", className: styles.pick9 },
      { name: "#B3CBB9", className: styles.pick10 },
    ],
  },
  {
    label: "Heading colors: purples",
    colors: [
      { name: "Pale lavender · oklch(0.88 0.06 285)", className: styles.lavender1 },
      { name: "Soft lavender · oklch(0.82 0.09 285)", className: styles.lavender2 },
      { name: "Light lavender · oklch(0.8 0.1 285) (current)", className: styles.lavender3 },
      { name: "Lavender · oklch(0.76 0.12 285)", className: styles.lavender4 },
      { name: "Violet · oklch(0.72 0.14 283)", className: styles.lavender5 },
      { name: "Deep violet · oklch(0.68 0.16 281)", className: styles.lavender6 },
      { name: "Indigo, the theme color · oklch(0.62 0.19 280)", className: styles.indigo },
      { name: "Dusty lavender · oklch(0.78 0.05 285)", className: styles.dusty1 },
      { name: "Dusty violet · oklch(0.72 0.06 285)", className: styles.dusty2 },
    ],
  },
  {
    label: "Heading colors: grays",
    colors: [
      { name: "Near white · #d6d6dc", className: styles.gray1 },
      { name: "Light gray · #c8c8d0", className: styles.gray2 },
      { name: "Gray · #b8b8c2", className: styles.gray3 },
      { name: "Mid gray · #a9a9b3", className: styles.gray4 },
      { name: "Darker gray · #9a9aa5", className: styles.gray5 },
      { name: "Dark gray · #8b8b96", className: styles.gray6 },
      { name: "Darkest gray · #7c7c88", className: styles.gray7 },
    ],
  },
];

function Sample({ name, className }: { name: string; className: string }) {
  return (
    <section className={cn(styles.sample, className)}>
      <Small className={styles.label}>{name}</Small>
      <Paragraph className={styles.title}>Routes as data</Paragraph>
      <Paragraph className={styles.intro}>Muted intro text, to check the heading doesn&apos;t blend with it.</Paragraph>
      <H2 className={styles.h2}>Every page gets a row</H2>
      <Paragraph>
        The site syncs its code pages to goatboat on every push, so titles, descriptions and the breadcrumb
        trail all come from one place instead of hand-edited lists.
      </Paragraph>
      <H3 className={styles.h3}>What the sync does</H3>
      <Paragraph>
        New folders arrive as drafts and missing ones are flagged, never deleted. Read the{" "}
        <NextLink href="/docs/mvp" className={styles.link}>
          MVP plan
        </NextLink>{" "}
        for the order of work.
      </Paragraph>
    </section>
  );
}

export default function HeadingFontsPage() {
  return (
    <PageLayout>
      <PageHeader />
      {colorGroups.map((group) => (
        <div key={group.label} className={styles.group}>
          <Small className={styles.groupLabel}>{group.label}</Small>
          {group.colors.map((color) => (
            <Sample key={color.name} name={color.name} className={cn(styles.geist, color.className)} />
          ))}
        </div>
      ))}
      {groups.map((group) => (
        <div key={group.label} className={styles.group}>
          <Small className={styles.groupLabel}>{group.label}</Small>
          {group.fonts.map((font) => (
            <Sample key={font.name} {...font} />
          ))}
        </div>
      ))}
    </PageLayout>
  );
}
