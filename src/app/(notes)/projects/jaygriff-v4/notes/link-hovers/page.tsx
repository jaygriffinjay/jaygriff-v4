// goatboat: ee18a484-254b-4821-969a-5106c1d576bf
import NextLink from "next/link";
import { H2, InlineCode, Paragraph } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import styles from "./page.module.css";

const variants = [
  { name: "Current: solid fill", note: "Today's link utility: the blue fills in behind dark text.", className: styles.current },
  { name: "Border, full blue", note: "Blue text; a 1px blue box appears on hover. Same idea as the prev/next boxes.", className: styles.border100 },
  { name: "Border, 70% blue", note: "Same box, a little softer.", className: styles.border70 },
  { name: "Border, 50% blue", note: "Softer again; mixes toward gray on the navy page.", className: styles.border50 },
  { name: "Border, 30% blue", note: "Barely there; mostly the text carries the hover.", className: styles.border30 },
  { name: "Faint border always, full on hover", note: "A 25% box at rest that sharpens to full blue on hover.", className: styles.restingBorder },
  { name: "Border plus faint tint", note: "Full blue box with a 10% blue wash inside.", className: styles.borderTint },
  { name: "Gray text, blue on hover", note: "Like the prev/next titles: text and box turn blue together.", className: styles.grayToBlue },
  { name: "Underline only", note: "A 40% blue line under the text at rest, full blue on hover.", className: styles.underline },
];

function Sample({ name, note, className }: { name: string; note: string; className: string }) {
  return (
    <section className={styles.sample}>
      <H2 className={styles.name}>{name}</H2>
      <Paragraph className={styles.note}>{note}</Paragraph>
      <Paragraph>
        Body text with{" "}
        <NextLink href="#" className={className}>
          an inline link
        </NextLink>{" "}
        in the middle of a sentence, and{" "}
        <NextLink href="#" className={className}>
          a longer link that might wrap onto the next line on a narrow screen
        </NextLink>
        .
      </Paragraph>
      <ul className={styles.list}>
        <li>
          <NextLink href="#" className={className}>
            Getting started
          </NextLink>
        </li>
        <li>
          <NextLink href="#" className={className}>
            Code blocks
          </NextLink>
        </li>
      </ul>
    </section>
  );
}

export default function LinkHoversPage() {
  return (
    <PageLayout>
      <PageHeader />
      <Paragraph className={styles.intro}>
        Hover each link (or Tab to it) to compare. Every box variant uses <InlineCode>outline</InlineCode>, so the
        border never shifts the text.
      </Paragraph>
      {variants.map((v) => (
        <Sample key={v.name} {...v} />
      ))}
    </PageLayout>
  );
}
