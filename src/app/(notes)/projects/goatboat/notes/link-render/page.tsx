// goatboat: 4d0f69e1-1101-4cd3-badb-a6a537ed5b02
import { H2, Paragraph } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import styles from "./page.module.css";

// Dummy links: the notes are the point, so each has a few paragraphs of them
const links = [
  {
    id: "1",
    title: "Appraisal by AI: Model-driven victim prioritization in the VOLTA infostealer",
    url: "https://blog.talosintelligence.com/appraisal-by-ai-model-driven-victim-prioritization-in-the-volta-infostealer/",
    host: "blog.talosintelligence.com",
    via: "Cisco Talos",
    date: "Oct 31, 2026",
    notes: [
      "Dummy notes, first paragraph. This is where my own take goes, in my own words, at whatever length it needs.",
      "A second paragraph, to see how multi-paragraph notes sit under each layout.",
    ],
  },
  {
    id: "2",
    title: "A short title",
    url: "https://example.com/short",
    host: "example.com",
    via: null,
    date: "Oct 12, 2026",
    notes: ["One line of notes."],
  },
  {
    id: "3",
    title: "A much longer link title that keeps going to see how each layout wraps a title across lines",
    url: "https://example.com/a-very-long-path/with/several/segments/to/see/how/urls/behave",
    host: "example.com",
    via: "Some newsletter",
    date: "Sep 30, 2026",
    notes: [
      "Notes that run a bit longer, to see how a block of text reads when it is the main thing on the row. Dummy text, dummy text, dummy text, dummy text, dummy text, dummy text.",
    ],
  },
];

export default function LinkRenderTestPage() {
  return (
    <PageLayout>
      <PageHeader />

      <H2>A: notes first, source underneath</H2>
      <ul className={styles.list}>
        {links.map((link) => (
          <li key={link.id} className={styles.entryA}>
            {link.notes.map((note) => (
              <Paragraph key={note}>{note}</Paragraph>
            ))}
            <a href={link.url} className={styles.sourceCard}>
              <span className={styles.sourceTitle}>{link.title} ↗</span>
              <span className={styles.sourceMeta}>
                {link.host}
                {link.via && ` · via ${link.via}`} · {link.date}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <H2>B: title first, notes as an indented block</H2>
      <ul className={styles.list}>
        {links.map((link) => (
          <li key={link.id} className={styles.entryB}>
            <a href={link.url} className={styles.titleLink}>
              {link.title} ↗
            </a>
            <span className={styles.sourceMeta}>
              {link.host}
              {link.via && ` · via ${link.via}`} · {link.date}
            </span>
            <div className={styles.notesBlock}>
              {link.notes.map((note) => (
                <Paragraph key={note}>{note}</Paragraph>
              ))}
            </div>
          </li>
        ))}
      </ul>

      <H2>C: compact, one source line above the notes</H2>
      <ul className={styles.list}>
        {links.map((link) => (
          <li key={link.id} className={styles.entryC}>
            <span className={styles.sourceLine}>
              <a href={link.url} className={styles.inlineLink}>
                {link.host} ↗
              </a>{" "}
              · {link.date}
            </span>
            {link.notes.map((note) => (
              <Paragraph key={note}>{note}</Paragraph>
            ))}
          </li>
        ))}
      </ul>
    </PageLayout>
  );
}
