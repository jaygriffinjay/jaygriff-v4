import NextLink from "next/link";
import { Bold, H2, H3, InlineCode, Muted, Paragraph } from "@/components/typography";
import { cn } from "@/lib/utils";
import styles from "./link-code-designs.module.css";

const options: { id: string; name: string; note: string }[] = [
  { id: "text", name: "Underline the text", note: "A plain 1px underline under the code text, 2px below. The first version, before the icons." },
  { id: "thick", name: "Thick underline", note: "2px, a little further down. Heavier, harder to miss." },
  { id: "dotted", name: "Dotted underline", note: "Softer than a solid line, and distinct from a normal underline." },
  { id: "dashed", name: "Dashed underline", note: "Between dotted and solid." },
  { id: "chipEdge", name: "Line on the chip's bottom edge", note: "A 1px line drawn along the bottom of the code background, so the chip itself looks underlined." },
  { id: "chipUnder", name: "Line just under the chip", note: "A 1px line hugging the outside of the chip's bottom edge: lower than the others." },
  { id: "tint", name: "Blue-tinted chip, no underline", note: "The code background takes a blue tint instead of an underline." },
  { id: "arrow", name: "Trailing arrow, no underline", note: "A small ↗ after the code, the same kind of cue as the arrows on your contact links." },
];

const arrows: { id: string; name: string; note: string }[] = [
  { id: "arrowGlyph", name: "↗, spaced (the one above)", note: "The text arrow glyph in the code's own font, a space after the code. The baseline for the rest." },
  { id: "arrowTight", name: "↗, no space", note: "Tucked right up against the last letter." },
  { id: "arrowRight", name: "→ instead", note: "A plain right arrow: reads as 'go to' rather than 'leaves'." },
  { id: "arrowRaised", name: "↗, small and raised", note: "Superscript-sized, like a footnote mark." },
  { id: "arrowMuted", name: "↗, dimmed", note: "The arrow at 60% strength, so the code stays the main thing." },
  { id: "arrowIconUp", name: "Icon arrow, up-right", note: "A drawn arrow (Lucide's ArrowUpRight) instead of a font glyph, so it has the same weight whatever the font." },
  { id: "arrowIconRight", name: "Icon arrow, right", note: "Lucide's ArrowRight, drawn the same way." },
  { id: "arrowOutside", name: "↗ outside the chip", note: "The arrow follows the chip instead of sitting inside it, still part of the link's hover block." },
  { id: "arrowNudge", name: "↗ that nudges on hover", note: "The arrow slides up and right when you really hover it. The held hover below can't show the movement, so hover the first line." },
];

type Design = { id: string; name: string; note: string; icon?: "after" | "before" };

const icons: Design[] = [
  { id: "iconChain", icon: "after", name: "Chain link, after", note: "The classic link icon (Lucide's Link) after the code." },
  { id: "iconChainLead", icon: "before", name: "Chain link, before", note: "The same icon in front of the code, the way a hyperlink is often marked." },
  { id: "iconChainQuiet", icon: "after", name: "Chain link, quiet", note: "Smaller and at 60% strength, so the code stays the main thing." },
  { id: "iconLinkTwo", icon: "after", name: "Single chain link", note: "Lucide's Link2: one flat link, a cleaner shape at small sizes." },
  { id: "iconExternal", icon: "after", name: "Box with an arrow leaving it", note: "The usual 'opens elsewhere' icon. It says more than an arrow, but is a heavier shape." },
  { id: "iconCorner", icon: "after", name: "Turning arrow", note: "A corner arrow, like 'continue here'." },
  { id: "iconChevron", icon: "after", name: "Small chevron", note: "The lightest mark: just a small › after the code." },
  { id: "iconCircle", icon: "after", name: "Arrow in a circle", note: "A round 'go' button feel, still outlined." },
];

function Option({ id, name, note, icon }: Design) {
  return (
    <section className={styles.option}>
      <H3>{name}</H3>
      <Muted>{note}</Muted>
      <Paragraph>
        At rest: call{" "}
        <NextLink href="/about" className={cn(styles.link, icon === "after" && styles.icon, icon === "before" && styles.iconLead, styles[id])}>
          <InlineCode>useState</InlineCode>
        </NextLink>{" "}
        inside a sentence, with more <Bold>text</Bold> around it.
      </Paragraph>
      <Paragraph>
        Hovered: call{" "}
        <NextLink
          href="/about"
          className={cn(styles.link, styles.pinned, icon === "after" && styles.icon, icon === "before" && styles.iconLead, styles[id])}
        >
          <InlineCode>useState</InlineCode>
        </NextLink>{" "}
        inside a sentence, with more <Bold>text</Bold> around it.
      </Paragraph>
    </section>
  );
}

/** The ways inline code could show it's a link when the whole link is code. Each at rest and in its hover look. */
export function LinkCodeDesigns() {
  return (
    <>
      <Paragraph>
        These apply only when the link's whole text is code, like <InlineCode>useState</InlineCode> alone. A link that
        mixes code with other words gets no mark. The box with an arrow leaving it (in "Other link icons") won and is now what the site uses; the rest are kept for comparison. Each option shows the link at rest, then held in its hover look.
      </Paragraph>
      {options.map((option) => (
        <Option key={option.id} {...option} />
      ))}

      <H2>More arrow designs</H2>
      <Paragraph>Variations on the trailing arrow, which is the one to beat.</Paragraph>
      {arrows.map((option) => (
        <Option key={option.id} {...option} />
      ))}

      <H2>Other link icons</H2>
      <Paragraph>
        Icons that mean "link" rather than "go", drawn as masks so they take the text colour and turn dark on hover with
        everything else.
      </Paragraph>
      {icons.map((option) => (
        <Option key={option.id} {...option} />
      ))}
    </>
  );
}
