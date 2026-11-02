// goatboat: 68faf9dd-0992-44b6-ac38-e8bf624034a4
import { H2, InlineCode, Muted, Paragraph } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

const candidates = [
  { name: "Current", value: "#58a6ff", note: "Today's --primary.", className: styles.current },
  { name: "GitHub emphasis", value: "#388bfd", note: "A step deeper and more saturated.", className: styles.githubEmphasis },
  { name: "GitHub blue", value: "#1f6feb", note: "Deeper again; GitHub's button blue.", className: styles.githubBlue },
  { name: "Steel blue", value: "oklch(0.62 0.09 250)", note: "Same lightness range, much less saturated.", className: styles.steel },
  { name: "Slate", value: "oklch(0.52 0.06 260)", note: "Darker and greyer; blue only as a tint.", className: styles.slate },
  { name: "Primary 60%", value: "primary mixed 60% into the page", note: "Today's blue, faded toward the background.", className: styles.primary60 },
  { name: "Primary 40%", value: "primary mixed 40% into the page", note: "Fainter; close to the separator color.", className: styles.primary40 },
  { name: "Indigo", value: "var(--indigo)", note: "The second theme color.", className: styles.indigo },
  { name: "Neutral", value: "foreground at 45%", note: "No blue at all; a brighter border.", className: styles.neutral },
];

const weights = [
  { name: "1px border", note: "Today's weight.", className: styles.border1 },
  { name: "2px ring", note: "The border plus a 1px ring outside it.", className: styles.ring2 },
  { name: "3px ring", note: "The border plus a 2px ring outside it.", className: styles.ring3 },
  { name: "2px inset", note: "Thickens inward, so the shape's outside edge stays put.", className: styles.inset2 },
  { name: "Gap ring", note: "A 2px ring with a gap of page color, like the focus ring.", className: styles.gapRing },
  { name: "Offset outline", note: "A 2px outline floating 3px out, like the link utility's ring.", className: styles.offsetOutline },
  { name: "2px ring + tint", note: "2px ring with a 12% blue wash inside.", className: styles.ringTint },
  { name: "2px ring + glow", note: "2px ring with a soft blue glow around it.", className: styles.ringGlow },
];

/** Candidate colors for the border that appears when hovering a card, pill or bar. */
export default function HoverBordersPage() {
  return (
    <PageLayout>
      <PageHeader />
      <Paragraph>
        Each candidate shows the same three shapes the site uses: a card, a pill and a bar. The left set reacts to
        hover; the right set is pinned in its hover state so the colors can be compared side by side. Today they all
        use <InlineCode>hover:border-primary</InlineCode>.
      </Paragraph>

      {candidates.map(({ name, value, note, className }) => (
        <section key={name} className={className}>
          <H2>{name}</H2>
          <Muted>
            <InlineCode>{value}</InlineCode> {note}
          </Muted>
          <div className={styles.compare}>
            <Shapes />
            <Shapes pinned />
          </div>
        </section>
      ))}

      <H2>Weights</H2>
      <Paragraph>
        All in GitHub blue (<InlineCode>--hover</InlineCode>). None of them shift the layout: the extra weight is drawn
        with <InlineCode>box-shadow</InlineCode> or <InlineCode>outline</InlineCode>, not a wider border.
      </Paragraph>

      {weights.map(({ name, note, className }) => (
        <section key={name} className={cn(styles.weight, className)}>
          <H2>{name}</H2>
          <Muted>{note}</Muted>
          <div className={styles.compare}>
            <Shapes />
            <Shapes pinned />
          </div>
        </section>
      ))}
    </PageLayout>
  );
}

function Shapes({ pinned }: { pinned?: boolean }) {
  const hover = pinned ? styles.pinned : styles.hoverable;
  return (
    <div className={styles.shapes}>
      <a href="#" className={cn(styles.card, hover)}>
        <Paragraph>A card</Paragraph>
        <Muted>Like the prev/next and step links.</Muted>
      </a>
      <div className={styles.pills}>
        <a href="#" className={cn(styles.pill, hover)}>
          next-js
        </a>
        <a href="#" className={cn(styles.pill, hover)}>
          typescript
        </a>
      </div>
      <a href="#" className={cn(styles.bar, hover)}>
        A bar, like the notes bar
      </a>
    </div>
  );
}
