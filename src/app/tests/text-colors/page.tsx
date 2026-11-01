// goatboat: 0778bf17-9bae-40dd-83c2-41dfda5526d3
import { H2, InlineCode, Paragraph, Small } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { cn } from "@/lib/utils";
import { Comparisons } from "./comparisons";
import styles from "./page.module.css";

const tokens = [
  {
    name: "--foreground",
    value: "#c0c0c8",
    usedBy: "Body text everywhere, outline badges",
    note: "The base. Everything else is judged against it.",
    className: styles.tForeground,
  },
  {
    name: "--heading",
    value: "#d6d6dc",
    usedBy: "H1–H6, page titles",
    note: "Keep: headings need to sit a step brighter.",
    className: styles.tHeading,
  },
  {
    name: "--muted-foreground",
    value: "#c0c0c8",
    usedBy: "Intros, list descriptions, breadcrumbs, card descriptions, placeholders, tab labels",
    note: "Same gray as body text for now.",
    className: styles.tMuted,
  },
  {
    name: "--card-foreground",
    value: "#ebebeb",
    usedBy: "Text inside cards",
    note: "Brighter than body text. Candidate: var(--foreground).",
    className: styles.tCard,
  },
  {
    name: "--popover-foreground",
    value: "#ebebeb",
    usedBy: "Dropdown menus, popovers",
    note: "Brighter than body text. Candidate: var(--foreground).",
    className: styles.tPopover,
  },
  {
    name: "--secondary-foreground",
    value: "#e5e5e5",
    usedBy: "Secondary buttons and badges",
    note: "Almost the old body color. Candidate: var(--foreground) or var(--heading).",
    className: styles.tSecondary,
  },
  {
    name: "--accent-foreground",
    value: "#ffffff",
    usedBy: "Highlighted menu items, ghost-button hover",
    note: "Pure white, the brightest text on the site. Candidate: var(--heading).",
    className: styles.tAccent,
  },
  {
    name: "--primary",
    value: "#58a6ff",
    usedBy: "Links, focus rings, primary buttons",
    note: "Keep.",
    className: styles.tPrimary,
  },
  {
    name: "--code",
    value: "#58a6ff",
    usedBy: "Inline code",
    note: "Same value as --primary on purpose, so the two can diverge later.",
    className: styles.tCode,
  },
];

export default function TextColorsPage() {
  return (
    <PageLayout>
      <PageHeader />

      <H2 className={styles.sectionHeading}>Text color tokens</H2>
      <div className={styles.tokens}>
        {tokens.map((token) => (
          <div key={token.name} className={cn(styles.token, token.className)}>
            <span className={styles.swatch} aria-hidden="true" />
            <div className={styles.tokenText}>
              <div className={styles.tokenName}>
                <InlineCode>{token.name}</InlineCode> <span className={styles.value}>{token.value}</span>
              </div>
              <Paragraph className={styles.sample}>The quick brown fox jumps over the lazy dog.</Paragraph>
              <Small className={styles.meta}>Used by: {token.usedBy}</Small>
              <Small className={styles.meta}>{token.note}</Small>
            </div>
          </div>
        ))}
      </div>

      <H2 className={styles.sectionHeading}>Before and after, per component</H2>
      <Paragraph className={styles.explainer}>
        Every component that uses a token we might consolidate, shown with the current value and the
        consolidated one.
      </Paragraph>
      <Comparisons />
    </PageLayout>
  );
}
