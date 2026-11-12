// goatboat: e710c805-96a5-46a9-a32e-e09190af5ff8
import { ChevronsUpDownIcon, LayersIcon, ListIcon } from "lucide-react";
import { Bold, CapsLabel, Muted, Paragraph, Small } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import styles from "./page.module.css";

const PROJECT = "goatboat";
const SECTION = "Tests";

/** Ideas for the button that opens a project's notes panel, each shown with the contents button it sits next to on a phone. */
export default function NotesBarIdeasPage() {
  return (
    <PageLayout>
      <PageHeader />
      <Paragraph>
        Mockups only: none of these open anything. Each idea shows the notes button with the contents button under it,
        the way the two stack on a phone today.
      </Paragraph>

      <Idea name="Today" note="Full width, three lines tall.">
        <button type="button" className={styles.todayBar}>
          <span className={styles.todayText}>
            <CapsLabel>Notes</CapsLabel>
            <span className={styles.todayProject}>
              <Bold>{PROJECT}</Bold>
            </span>
            <Small>{SECTION}</Small>
          </span>
          <ChevronsUpDownIcon aria-hidden="true" className={styles.todayIcon} />
        </button>
        <TocBar />
      </Idea>

      <Idea name="1. Slim bar" note="Full width, one line, the same size as the contents bar.">
        <button type="button" className={styles.slimBar}>
          <CapsLabel>Also in {PROJECT}</CapsLabel>
          <span className={styles.slimMeta}>{SECTION}</span>
          <ChevronsUpDownIcon aria-hidden="true" className={styles.icon} />
        </button>
        <TocBar />
      </Idea>

      <Idea name="2. Pill buttons, stacked" note="Each button only as wide as its label.">
        <div className={styles.stack}>
          <button type="button" className={styles.pill}>
            <LayersIcon aria-hidden="true" />
            Also in this project
          </button>
          <button type="button" className={styles.pill}>
            <ListIcon aria-hidden="true" />
            On this page
          </button>
        </div>
      </Idea>

      <Idea name="3. Pill buttons, side by side" note="One row; wraps on a narrow phone.">
        <div className={styles.row}>
          <button type="button" className={styles.pill}>
            <LayersIcon aria-hidden="true" />
            Also in {PROJECT}
          </button>
          <button type="button" className={styles.pill}>
            <ListIcon aria-hidden="true" />
            On this page
          </button>
        </div>
      </Idea>

      <Idea name="4. Rounded-rect buttons, side by side" note="Same row, squarer corners like the cards.">
        <div className={styles.row}>
          <button type="button" className={styles.rect}>
            Also in {PROJECT}
            <ChevronsUpDownIcon aria-hidden="true" className={styles.icon} />
          </button>
          <button type="button" className={styles.rect}>
            On this page
            <ChevronsUpDownIcon aria-hidden="true" className={styles.icon} />
          </button>
        </div>
      </Idea>

      <Idea name="5. Split row" note="Full width, but one bar split into two halves.">
        <div className={styles.split}>
          <button type="button" className={styles.splitHalf}>
            <LayersIcon aria-hidden="true" />
            Also in {PROJECT}
          </button>
          <button type="button" className={styles.splitHalf}>
            <ListIcon aria-hidden="true" />
            On this page
          </button>
        </div>
      </Idea>

      <Idea name="6. Text controls" note="No box at all: muted text and an icon, like the About page's expand all.">
        <div className={styles.row}>
          <button type="button" className={styles.textControl}>
            <LayersIcon aria-hidden="true" />
            Also in {PROJECT}
          </button>
          <button type="button" className={styles.textControl}>
            <ListIcon aria-hidden="true" />
            On this page
          </button>
        </div>
      </Idea>

      <Idea name="7. Breadcrumb chip" note="Names where you are; tapping it opens the rest.">
        <div className={styles.row}>
          <button type="button" className={styles.pill}>
            <span className={styles.chipProject}>{PROJECT}</span>
            <span className={styles.chipSlash} aria-hidden="true">
              /
            </span>
            {SECTION}
            <ChevronsUpDownIcon aria-hidden="true" className={styles.icon} />
          </button>
          <button type="button" className={styles.pill}>
            On this page
            <ChevronsUpDownIcon aria-hidden="true" className={styles.icon} />
          </button>
        </div>
      </Idea>
    </PageLayout>
  );
}

function Idea({ name, note, children }: { name: string; note: string; children: React.ReactNode }) {
  return (
    <section className={styles.idea}>
      <Paragraph>
        <Bold>{name}</Bold>
      </Paragraph>
      <Muted>{note}</Muted>
      <div className={styles.sample}>{children}</div>
    </section>
  );
}

/** Today's contents bar, for scale. */
function TocBar() {
  return (
    <button type="button" className={styles.tocBar}>
      <CapsLabel>On this page</CapsLabel>
      <span className={styles.slimMeta}>4 sections</span>
      <ChevronsUpDownIcon aria-hidden="true" className={styles.icon} />
    </button>
  );
}
