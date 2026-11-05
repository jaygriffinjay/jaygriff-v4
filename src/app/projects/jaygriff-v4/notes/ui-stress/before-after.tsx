import { CapsLabel, H3, Muted, Small } from "@/components/typography";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { cn } from "@/lib/utils";
import styles from "./before-after.module.css";

const LONG_WORD = "supercalifragilistic".repeat(8);

const cases: { title: string; note: string; source: string; hover?: boolean; narrow?: boolean }[] = [
  {
    title: "A link that is only code",
    note: "Before: nothing said it was a link, and on hover the light blue code vanished into the blue block. After: it ends in a small box-and-arrow icon and turns dark on hover.",
    source: "[`useState`](/about)",
    hover: true,
  },
  {
    title: "Bold and code inside a longer link",
    note: "Before: the bold stayed white on hover. After: it turns dark with the rest. The code word has no icon, since the link is more than code.",
    source: "[a link with **bold** and `code` in it](/about)",
    hover: true,
  },
  {
    title: "One very long word",
    note: "Before: it spilled out of its box (and, on a real page, widened the whole page). After: it wraps. The dashed box stands in for the page column.",
    source: LONG_WORD,
    narrow: true,
  },
];

/** Each fixed bug twice, side by side. "Before" is reconstructed with CSS that undoes the fix, since the old code is gone. */
export function BeforeAfter() {
  return (
    <>
      {cases.map(({ title, note, source, hover, narrow }) => (
        <section key={title} className={styles.case}>
          <H3>{title}</H3>
          <Muted>{note}</Muted>
          <div className={styles.grid}>
            {(["before", "after"] as const).map((side) => (
              <div key={side} className={cn(styles.column, side === "before" && styles.before)}>
                <CapsLabel>{side}</CapsLabel>
                <div className={cn(styles.sample, narrow && styles.narrow, narrow && side === "before" && styles.noWrap)}>
                  {hover && <Small>At rest</Small>}
                  <MarkdownRenderer source={source} />
                </div>
                {hover && (
                  <div className={cn(styles.sample, styles.pinned)}>
                    <Small>Hovered</Small>
                    <MarkdownRenderer source={source} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
