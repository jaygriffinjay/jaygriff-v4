// goatboat: 1f36a85a-30dc-4580-a1f9-c65357a4d4b9
import { Blockquote, H2, H3, InlineCode, List, ListItem, Paragraph, Small } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

const options = [
  {
    id: "today",
    name: "A. Today",
    detail: "Line height 1.625, paragraph gap 10 to 16px, list items 4px apart",
    className: styles.today,
  },
  {
    id: "slightly",
    name: "B. Slightly tighter",
    detail: "Line height 1.55, paragraph gap 14px, list items 3px apart",
    className: styles.slightly,
  },
  {
    id: "tight",
    name: "C. Tight",
    detail: "Line height 1.5, paragraph gap 12px, list items 2px apart",
    className: styles.tight,
  },
  {
    id: "tighter",
    name: "D. Tighter",
    detail: "Line height 1.45, paragraph gap 10px, list items 2px apart",
    className: styles.tighter,
  },
  {
    id: "tightest",
    name: "E. Tightest",
    detail: "Line height 1.4, paragraph gap 8px, list items touching",
    className: styles.tightest,
  },
  {
    id: "lines",
    name: "F. Half-line gaps",
    detail: "Line height 1.5, a paragraph gap of half a line, list items 0.15 of a line apart",
    className: styles.lines,
  },
];

function Sample({ detail, className, children }: { detail: string; className: string; children: React.ReactNode }) {
  return (
    <section className={cn(styles.sample, className)}>
      <Small className={styles.detail}>{detail}</Small>
      {children}
    </section>
  );
}

export default function SpacingPage() {
  return (
    <PageLayout>
      <PageHeader />
      {options.map((option) => (
        <Sample key={option.id} detail={option.detail} className={option.className}>
          <H2 className={styles.heading}>{option.name}</H2>
          <Paragraph>
            A page on this site starts life as an idea in a notes file and ends up as a row in a database, and most of
            what happens in between is boring on purpose. The writing lives in one place, the metadata lives in another,
            and a small amount of glue keeps the two honest. That glue is the part worth getting right, because when it
            works nobody notices it, and when it doesn't, a page quietly goes missing from a list and nobody can say why.
          </Paragraph>

          <H3 id={`${option.id}-how`}>How pages get here</H3>
          <Paragraph>
            There are two kinds of pages. Some are written as markdown and stored in the database, and some are written
            as code and live in the repository next to the components they use. Both end up in the same table, which is
            what lets one search find either kind. The difference only shows up when you want to edit one: markdown goes
            through the content tools, and code goes through your editor and a push.
          </Paragraph>
          <Paragraph>
            A code page is identified by the id on the first line of its <InlineCode>page.tsx</InlineCode>, not by where
            it sits, so the folder can move without the page losing its history. The sync sends each page's{" "}
            <InlineCode>path</InlineCode> and <InlineCode>toc</InlineCode> to goatboat on every push to{" "}
            <InlineCode>main</InlineCode>, and anything it stops sending is hidden until the file returns.
          </Paragraph>

          <H3 id={`${option.id}-push`}>Before you push</H3>
          <List>
            <ListItem>Make sure the new page has a title and a one-line description.</ListItem>
            <ListItem>
              Check that nothing was copied along with another page's id, because two files with the same id make
              the stamp refuse to run, and the commit hook fails in the same way, which is confusing the first time it
              happens.
            </ListItem>
            <ListItem>
              Push to <InlineCode>main</InlineCode>.
            </ListItem>
            <ListItem>
              Open the notes list and look for the page. If it isn't there, it probably has no project or section
              yet, which is the most common reason by a wide margin and the easiest to fix.
            </ListItem>
          </List>

          <H3 id={`${option.id}-steps`}>The steps, in order</H3>
          <List ordered>
            <ListItem>
              Write the page as a file under the notes folder, with a title and a few headings so the contents list has
              something to show.
            </ListItem>
            <ListItem>
              Run the stamp so the file gets its id, then push, and wait for the sync to finish, which usually takes
              under a minute.
            </ListItem>
            <ListItem>
              Give it a project, a section and a short description, so it shows up where people will look for it.
            </ListItem>
          </List>
          <Blockquote>
            Most of what makes a page feel well made is spacing, and most of what makes spacing feel wrong is that two
            things are almost the same distance apart.
          </Blockquote>

          <H3 id={`${option.id}-tight`}>When it gets tight</H3>
          <Paragraph>
            This one is the stress test, with as much inline code as a real note ever has. Each of{" "}
            <InlineCode>createContent()</InlineCode>, <InlineCode>updateContent()</InlineCode> and{" "}
            <InlineCode>moveContent()</InlineCode> goes through <InlineCode>ops.ts</InlineCode>, so a change made in{" "}
            <InlineCode>drizzle studio</InlineCode> skips <InlineCode>extractToc(body)</InlineCode> and leaves{" "}
            <InlineCode>content.toc</InlineCode> stale until the next write. The renderer maps{" "}
            <InlineCode>h2</InlineCode> through <InlineCode>h6</InlineCode> to <InlineCode>H2</InlineCode> through{" "}
            <InlineCode>H6</InlineCode>, a fenced block to <InlineCode>CodeBlock</InlineCode> and a link to{" "}
            <InlineCode>NextLink</InlineCode>, and it drops raw <InlineCode>div</InlineCode> and{" "}
            <InlineCode>script</InlineCode> tags before they reach <InlineCode>PageBody</InlineCode>.
          </Paragraph>
          <Paragraph>
            A closing paragraph of plain text, so you can see the gap that follows a stress test and how a normal
            paragraph sits against the heading above it. It should be long enough to wrap onto at least two lines, which
            this one now is.
          </Paragraph>
        </Sample>
      ))}
    </PageLayout>
  );
}
