// goatboat: 8a9a9c66-42ef-4194-aabd-a5e0ceb77f70
import { H2, H3, InlineCode, Muted, Paragraph } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { cn } from "@/lib/utils";
import { AllAccordions, AllTables, Demo } from "./demos";
import { Playground } from "./playground";
import styles from "./page.module.css";

const colors = [
  { name: "No background", value: "transparent", note: "Accordion rows only turn their text blue. Table rows get nothing.", className: styles.none },
  { name: "Muted 30%", value: "muted at 30%", note: "The faintest step above the page.", className: styles.muted30 },
  { name: "Muted 50%", value: "muted at 50%", note: "What table rows use today.", className: styles.muted50 },
  { name: "Muted", value: "--muted, solid", note: "A clearer step, still the page's own hue.", className: styles.muted100 },
  { name: "White 4%", value: "foreground at 4%", note: "A neutral wash, no hue.", className: styles.white4 },
  { name: "White 7%", value: "foreground at 7%", note: "The same, a little stronger.", className: styles.white7 },
  { name: "Blue 5%", value: "primary at 5%", note: "A hint of the link blue.", className: styles.blue5 },
  { name: "Blue 8%", value: "primary at 8%", note: "Still quiet, but clearly blue.", className: styles.blue8 },
  { name: "Blue 12%", value: "primary at 12%", note: "The most you'd want behind text.", className: styles.blue12 },
  { name: "Card", value: "--card, solid", note: "The card color: slightly lighter than the page.", className: styles.card },
];

const shapes = [
  { name: "Rounded, past the text", note: "The highlight reaches 12px beyond the text on each side, so the text stays where it is.", className: styles.rounded },
  { name: "Square, past the text", note: "The same reach with square corners, like a table row.", className: styles.square },
  { name: "Flush with the text", note: "The highlight stops at the text's edge. Tables don't change: their cells already have padding.", className: styles.flush },
  { name: "Left accent", note: "Square, with a 2px blue bar on the left edge. On the table it sits on the first cell.", className: styles.accent },
];

/** Background highlights for hovered accordion rows and table rows, side by side with the same rows pinned to their hover state. */
export default function HoverHighlightsPage() {
  return (
    <PageLayout>
      <PageHeader intro="A very slight highlight on hover for accordion questions and table rows. The left set reacts to the pointer; in the right set the second row is pinned to its hover state." />
      <Paragraph>
        Each candidate sets one color, <InlineCode>--row-hover</InlineCode>, that the mock-ups use. The accordion keeps
        its blue text on hover, as it has today. Accordions use Muted 50% already; the first sections below look for
        something a little brighter, for accordions and for plain square table rows.
      </Paragraph>

      <H2>Brighter hovers</H2>
      <Paragraph>
        Twenty surfaces, from Muted 50% up past Accent, the choice for accordions. Table rows need to go brighter than
        that, so the last eight are lifted or tinted versions. Each is the color of a row in its hover state, so the
        whole list can be compared at once.
      </Paragraph>

      <H3>Accordion rows, all at once</H3>
      <Muted>Every row is held in its hover state, with its own color. The first row has none.</Muted>
      <AllAccordions />

      <H3>Table rows, all at once</H3>
      <Muted>Square rows, as the site's tables are. The first row has no highlight.</Muted>
      <AllTables />

      <H3>Try one</H3>
      <Muted>Choose a color, then hover the accordion and the table.</Muted>
      <Playground />

      <H2>Colors</H2>
      {colors.map(({ name, value, note, className }) => (
        <section key={name} className={cn(styles.section, className)}>
          <H2>{name}</H2>
          <Muted>
            <InlineCode>{value}</InlineCode> {note}
          </Muted>
          <div className={styles.compare}>
            <Demo />
            <Demo pinned />
          </div>
        </section>
      ))}

      <H2>Shapes</H2>
      <Paragraph>
        All in Blue 8%. What changes is how far the highlight reaches and how its edges look.
      </Paragraph>
      {shapes.map(({ name, note, className }) => (
        <section key={name} className={cn(styles.section, styles.shapeColor, className)}>
          <H2>{name}</H2>
          <Muted>{note}</Muted>
          <div className={styles.compare}>
            <Demo />
            <Demo pinned />
          </div>
        </section>
      ))}
    </PageLayout>
  );
}
