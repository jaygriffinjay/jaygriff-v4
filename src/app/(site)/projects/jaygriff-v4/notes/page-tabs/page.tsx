// goatboat: bd6b12a4-fca8-4c6a-b0b0-aafd12d5b536
import { CodeBlock } from "@/components/code-block/CodeBlock";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { PageTabs, type PageTab } from "@/components/site/page-tabs";
import { H2, H3, InlineCode, List, ListItem, Muted, Paragraph } from "@/components/typography";
import styles from "./page.module.css";

const usage = `import { PageTabs } from "@/components/site/page-tabs";

<PageTabs
  tabs={[
    { id: "overview", label: "Overview", children: <Overview /> },
    { id: "details", label: "Details", children: <Details /> },
  ]}
/>`;

const table = `
| Where | Spacing between blocks |
| --- | --- |
| On the page | the page's own flow rhythm |
| In a tab | should be the same |
`;

/** A heading, text, a list, a code block and a table: the blocks whose spacing a tab panel must not change. */
function RhythmSample() {
  return (
    <>
      <H3>A heading</H3>
      <Paragraph>A paragraph straight after the heading, then a list.</Paragraph>
      <List>
        <ListItem>First item</ListItem>
        <ListItem>Second item</ListItem>
      </List>
      <CodeBlock code={'const sample = "a code block";'} language="ts" />
      <MarkdownRenderer source={table} />
      <Paragraph>A last paragraph.</Paragraph>
    </>
  );
}

const tabs: PageTab[] = [
  {
    id: "basics",
    label: "Basics",
    children: (
      <>
        <Paragraph>The first tab, open by default. Switch tabs and watch the address bar: the hash follows.</Paragraph>
        <Muted>Reload the page on another tab and it opens there.</Muted>
      </>
    ),
  },
  {
    id: "rhythm",
    label: "Rhythm",
    children: <RhythmSample />,
  },
  {
    id: "deep-links",
    label: "Deep links",
    children: (
      <>
        <Paragraph>
          These are plain anchors, so the browser fires a hash change that the tabs listen for:{" "}
          <a href="#basics" className={styles.link}>
            jump to Basics
          </a>
          ,{" "}
          <a href="#rhythm" className={styles.link}>
            jump to Rhythm
          </a>
          , and{" "}
          <a href="#not-a-tab" className={styles.link}>
            a hash that isn't a tab
          </a>
          , which is ignored.
        </Paragraph>
        <Muted>
          A router link to a hash would change the URL without that event, so use plain anchors for links between tabs.
        </Muted>
      </>
    ),
  },
  {
    id: "crawlers",
    label: "Crawlers",
    children: (
      <Paragraph>
        Zebra-4 marker: this sentence is in a tab that isn't showing at first, and it's still in the page source, so
        crawlers and find-in-page can see it.
      </Paragraph>
    ),
  },
];

const many: PageTab[] = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"].map((name) => ({
  id: `many-${name}`,
  label: `Tab ${name}`,
  children: <Paragraph>This is the {name} tab. With this many, the bar has to scroll sideways on a phone.</Paragraph>,
}));

/** The PageTabs component: several views of one topic on a page, linkable and crawlable. */
export default function PageTabsPage() {
  return (
    <PageLayout>
      <PageHeader intro="A component for the several-views-of-one-topic tab pattern, and the things that need checking on it." />

      <H2>Using it</H2>
      <Paragraph>
        Each tab is an <InlineCode>id</InlineCode>, a <InlineCode>label</InlineCode> and its content. The ids end up in
        the URL hash.
      </Paragraph>
      <CodeBlock code={usage} language="tsx" />

      <H2>Try it</H2>
      <PageTabs tabs={tabs} />

      <H2>The same blocks outside the tabs</H2>
      <Muted>For comparison with the Rhythm tab: the gaps should match.</Muted>
      <RhythmSample />

      <H2>Many tabs</H2>
      <Muted>Narrow the window: the bar should scroll sideways instead of wrapping or overflowing the page.</Muted>
      <PageTabs tabs={many} />

      <H2>Things to check</H2>
      <List>
        <ListItem>
          <InlineCode>Crawlers.</InlineCode> The Zebra-4 sentence should be in the page source even while its tab is
          closed.
        </ListItem>
        <ListItem>
          <InlineCode>Rhythm.</InlineCode> The blocks in the tab and the same blocks below should have the same gaps.
        </ListItem>
        <ListItem>
          <InlineCode>Deep links.</InlineCode> Load the page with <InlineCode>#rhythm</InlineCode> on the end and it
          should open on that tab. Back and forward shouldn't break it.
        </ListItem>
        <ListItem>
          <InlineCode>Two sets.</InlineCode> Switching the lower set must not change the upper one.
        </ListItem>
        <ListItem>
          <InlineCode>Hidden headings.</InlineCode> A heading inside a closed tab can't be scrolled to, so a contents
          link to it does nothing. Worth remembering before putting headings in tabs.
        </ListItem>
      </List>
    </PageLayout>
  );
}
