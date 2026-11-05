import { Highlight, H3, Muted, Paragraph } from "@/components/typography";
import { cn } from "@/lib/utils";
import styles from "./highlight-designs.module.css";

const options: { id: keyof typeof styles; name: string; note: string }[] = [
  { id: "sliced", name: "Rounded, sliced (before)", note: "The old look. The corners round only at the very start and end of the highlight, so a wrapped line ends square and the next begins square." },
  { id: "cloned", name: "Rounded, repeated", note: "Every line gets its own rounded ends and side padding, the way inline code does." },
  { id: "sharpSliced", name: "Sharp, sliced", note: "No radius. Padding only at the very start and end." },
  { id: "sharpCloned", name: "Sharp, repeated (now)", note: "No radius, with side padding on every wrapped line. Reads like a true highlighter, and is what the site uses." },
  { id: "roundedMore", name: "Rounder, repeated", note: "A larger radius on every line." },
  { id: "sharpFlush", name: "Sharp, no side padding", note: "A bare band behind the text, no padding at either end." },
];

/** The highlight's corners and wrapping, each in a narrow column so the text has to break across lines. */
export function HighlightDesigns() {
  return (
    <>
      <Paragraph>
        A highlight is a tinted background behind a run of text. Where it wraps onto a second line, the background
        either keeps its rounded ends on each line or loses them. Each design is shown in a narrow column, then in a
        full-width line.
      </Paragraph>
      {options.map(({ id, name, note }) => (
        <section key={id} className={styles.option}>
          <H3>{name}</H3>
          <Muted>{note}</Muted>
          <Paragraph className={styles.narrow}>
            Narrow:{" "}
            <Highlight className={cn(styles[id])}>
              a highlighted run of words long enough to wrap onto three lines
            </Highlight>{" "}
            and then plain text again.
          </Paragraph>
          <Paragraph>
            Wide: some words, then <Highlight className={cn(styles[id])}>a shorter highlight</Highlight>, then more words.
          </Paragraph>
        </section>
      ))}
    </>
  );
}
