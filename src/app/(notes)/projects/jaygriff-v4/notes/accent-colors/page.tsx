// goatboat: 8023141a-5955-425d-a7df-092723ed0cb8
import NextLink from "next/link";
import { InlineCode, Muted, Paragraph } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { QuestionList, type Question } from "@/components/site/question-list";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

const candidates = [
  { name: "Heading white (today)", value: "#d6d6dc", note: "The baseline: same color as the questions.", className: styles.white },
  { name: "Amber", value: "#d29922", note: "GitHub's attention color. Warm, so it can't be read as a link.", className: styles.amber },
  { name: "Gold", value: "#e3b341", note: "Brighter, yellower amber.", className: styles.gold },
  { name: "Orange", value: "#f0883e", note: "GitHub's severe color. Loud; the strongest pull away from blue.", className: styles.orange },
  { name: "Peach", value: "oklch(0.82 0.08 60)", note: "Soft and warm; close to white in weight.", className: styles.peach },
  { name: "Green", value: "#56d364", note: "GitHub's success green, lightened.", className: styles.green },
  { name: "Teal", value: "oklch(0.8 0.1 185)", note: "Cool but clearly not blue.", className: styles.teal },
  { name: "Lavender (today)", value: "#bc8cff", note: "GitHub's purple, light. The current --lavender.", className: styles.lavender },
  { name: "Lavender, lighter", value: "#d2a8ff", note: "GitHub's paler purple: lighter, a little less saturated.", className: styles.lavenderLight },
  { name: "Lavender, chroma 0.12", value: "oklch(0.74 0.12 303)", note: "Same hue and lightness, saturation cut by a quarter.", className: styles.lavender12 },
  { name: "Lavender, chroma 0.09", value: "oklch(0.75 0.09 303)", note: "About half the saturation; softer, still clearly purple.", className: styles.lavender09 },
  { name: "Lavender, chroma 0.06", value: "oklch(0.76 0.06 303)", note: "Dusty; purple-tinted grey.", className: styles.lavender06 },
  { name: "Lilac, pale", value: "oklch(0.82 0.07 305)", note: "Lighter and soft; close to heading white with a purple cast.", className: styles.lilac },
  { name: "Goatboat purple", value: "oklch(0.68 0.19 293)", note: "Goatboat's dark-mode --primary, the color of its title.", className: styles.goatboat },
  { name: "Indigo", value: "oklch(0.62 0.19 280)", note: "The theme's old second color.", className: styles.indigo },
  { name: "Pink", value: "#f778ba", note: "GitHub's sponsor pink.", className: styles.pink },
];

const questions: Question[] = [
  {
    question: "What kind of developer are you?",
    answer: (
      <>
        Full-stack TypeScript, mostly. Most of it is linked from{" "}
        <NextLink href="#" className={styles.link}>
          projects
        </NextLink>
        .
      </>
    ),
  },
  { question: "What are you focused on right now?", answer: <>This website, and AI-native tools.</> },
];

/** Candidate colors for section headings like the About page's, judged next to the questions and the link blue. */
export default function AccentColorsPage() {
  return (
    <PageLayout>
      <PageHeader />
      <Paragraph>
        Each candidate colors a section heading the size of an <InlineCode>H2</InlineCode>, over the same question list
        the About page uses. Open the first question to see the link blue on screen with the heading.
      </Paragraph>

      {candidates.map(({ name, value, note, className }) => (
        <section key={name} className={cn(styles.sample, className)}>
          <Muted>
            {name}: <InlineCode>{value}</InlineCode>. {note}
          </Muted>
          <h2 className={styles.heading}>About me</h2>
          <QuestionList items={questions} />
        </section>
      ))}
    </PageLayout>
  );
}
