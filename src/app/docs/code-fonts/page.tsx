import { H1, H2, Paragraph, Small } from "@/components/typography";
import { PageLayout } from "@/components/site/page-layout";
import { CodeBlock } from "@/components/code-block/CodeBlock";
import { sampleProject } from "../code-blocks/sample-files";
import { cn } from "@/lib/utils";
import { testFontVariables } from "./fonts";
import styles from "./page.module.css";

const sample = sampleProject[0].content;

const sizes = [
  { label: "12px", className: styles.size12 },
  { label: "13px", className: styles.size13 },
  { label: "14px", className: styles.size14 },
  { label: "15px (current)", className: styles.size15 },
  { label: "16px", className: styles.size16 },
];

const fonts = [
  { label: "JetBrains Mono (current)", className: styles.jetbrains },
  { label: "Geist Mono", className: styles.geist },
  { label: "Menlo (your VS Code; Mac only)", className: styles.menlo },
  { label: "SF Mono / system ui-monospace", className: styles.system },
  { label: "Fira Code", className: styles.fira },
  { label: "IBM Plex Mono", className: styles.plex },
  { label: "Source Code Pro", className: styles.source },
  { label: "Roboto Mono", className: styles.roboto },
  { label: "Inconsolata", className: styles.inconsolata },
  { label: "Ubuntu Mono", className: styles.ubuntu },
];

export default function CodeFontsPage() {
  return (
    <PageLayout>
      <div className={testFontVariables}>
        <H1 className={styles.title}>Code fonts</H1>
        <Paragraph className={styles.intro}>
          The same snippet at different sizes and in different monospace fonts. Look at 0 vs O,
          l vs 1, braces, and how wide each line runs.
        </Paragraph>

        <H2 className={styles.heading}>Sizes (JetBrains Mono)</H2>
        {sizes.map((size) => (
          <section key={size.label} className={cn(styles.sample, size.className)}>
            <Small className={styles.label}>{size.label}</Small>
            <CodeBlock code={sample} language="tsx" className={styles.block} />
          </section>
        ))}

        <H2 className={styles.heading}>Fonts at 15px</H2>
        {fonts.map((font) => (
          <section key={font.label} className={cn(styles.sample, font.className)}>
            <Small className={styles.label}>{font.label}</Small>
            <CodeBlock code={sample} language="tsx" className={styles.block} />
          </section>
        ))}
      </div>
    </PageLayout>
  );
}
