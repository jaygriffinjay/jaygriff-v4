// goatboat: d5e3b8eb-8ac8-4997-9465-d3538c2a751e
import { CodeBlock } from "@/components/code-block/CodeBlock";
import {
  Bold,
  H2,
  H3,
  InlineCode,
  List,
  ListItem,
  Paragraph,
} from "@/components/typography";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import styles from "./page.module.css";

const discovered = `src/app/
  page.tsx                      →  /
  docs/page.tsx                 →  /docs
  docs/code-blocks/page.tsx     →  /docs/code-blocks
  tests/page.tsx                →  /tests
  tests/feed/page.tsx           →  /tests/feed
  tests/content/[...path]/…     →  skipped: dynamic, a template rather than a page
  (marketing)/about/page.tsx    →  /about   (route groups don't add a segment)
  _components/…                 →  skipped: private folder`;

const payload = `POST /api/sites/jaygriff/routes/sync
Authorization: Bearer <token>

{
  "routes": [
    { "path": "/tests", "file": "app/tests/page.tsx", "title": "Tests", "description": "Pages that read from the content API." },
    { "path": "/tests/feed", "file": "app/tests/feed/page.tsx", "title": "Content feed", "description": null },
    { "path": "/docs/code-blocks", "file": "app/docs/code-blocks/page.tsx", "title": "Code blocks", "description": "…" }
  ]
}`;

const schema = `export const sites = sqliteTable("sites", {
  id: id(),
  slug: text().notNull().unique(),   // "jaygriff"
  name: text().notNull(),
  baseUrl: text("base_url").notNull(),
});

// New columns on content
siteId: text("site_id").notNull().references(() => sites.id),
source: text({ enum: ["db", "code"] }).notNull().default("db"),
file: text(),                         // set when source = 'code', e.g. app/tests/feed/page.tsx
missingSince: text("missing_since"),  // set by the sync when a code route disappears

// statuses gains "unlisted"; path becomes unique per site
uniqueIndex("uq_content_site_path").on(t.siteId, t.path)`;

const navQuery = `// Everything the nav needs, from one request
const nav = await listContent({ site: "jaygriff", inNav: true }); // top-level rows, by sort_order

// Breadcrumbs for any URL, code page or database page
const { breadcrumbs } = await getContentByPath("/tests/feed");
// → [{ title: "Tests", path: "/tests" }, { title: "Content feed", path: "/tests/feed" }]`;

type Row = readonly string[];

function DataTable({ head, rows }: { head: Row; rows: Row[] }) {
  return (
    <Table className={styles.table}>
      <TableHeader>
        <TableRow>
          {head.map((cell) => (
            <TableHead key={cell}>{cell}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row[0]}>
            {row.map((cell, i) => (
              <TableCell key={i} className={styles.cell}>
                {cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function RoutesAsDataPage() {
  return (
    <PageLayout>
      <PageHeader />

      <H2 className={styles.section}>The problem</H2>
      <Paragraph>
        The site has two kinds of pages, and only one of them is data. Pages stored in the database have a title,
        a parent, tags and a publish date, so breadcrumbs and feeds already work for them. Pages written as{" "}
        <InlineCode>page.tsx</InlineCode> files in the repo have none of that. They exist only as folders.
      </Paragraph>
      <List className={styles.list}>
        <ListItem>The nav is a hand-edited array, so every new section means editing code.</ListItem>
        <ListItem>
          Breadcrumbs can&apos;t label <InlineCode>/docs/code-stress</InlineCode>, because nothing says it&apos;s
          called &ldquo;Code stress test&rdquo;.
        </ListItem>
        <ListItem>
          Nothing at runtime can ask &ldquo;what pages exist?&rdquo;, so a sitemap, a search index or
          &ldquo;recently updated&rdquo; can only see half the site.
        </ListItem>
      </List>

      <H2 className={styles.section}>The idea</H2>
      <Paragraph>
        A TSX page keeps rendering from the repo, exactly as it does now. What changes is that it also gets a row
        in the database holding its <Bold>metadata</Bold>: title, parent, tags, visibility, position in the nav.
        The code is the body; the row is everything about it. A new <InlineCode>source</InlineCode> column says
        which kind of page a row is.
      </Paragraph>
      <DataTable
        head={["source", "Body lives in", "The row exists because", "Rendered by"]}
        rows={[
          ["db", "The row's body", "Someone created it in goatboat", "The catch-all route"],
          ["code", "A page.tsx in the repo", "The file exists, and the sync registered it", "Next.js, as today"],
        ]}
      />

      <H2 className={styles.section}>One tree per site</H2>
      <Paragraph>
        A path like <InlineCode>/docs</InlineCode> only means something on a particular site, and the plan is for
        one database to serve several sites. So a new <InlineCode>sites</InlineCode> table, a{" "}
        <InlineCode>site_id</InlineCode> on every content row, and paths that are unique per site instead of
        globally. Every existing row becomes part of the <InlineCode>jaygriff</InlineCode> site.
      </Paragraph>
      <CodeBlock className={styles.code} code={schema} language="ts" filename="schema.ts (additions)" />

      <H2 className={styles.section}>The sync</H2>
      <H3 className={styles.subsection}>1. Discover</H3>
      <Paragraph>
        A script in the site walks <InlineCode>src/app</InlineCode> and turns every{" "}
        <InlineCode>page.tsx</InlineCode> into a path, following Next&apos;s own rules.
      </Paragraph>
      <CodeBlock className={styles.code} code={discovered} language="text" filename="discovery" />

      <H3 className={styles.subsection}>2. Read metadata from code</H3>
      <Paragraph>
        Each page&apos;s <InlineCode>export const metadata = {"{ title, description }"}</InlineCode> is
        Next&apos;s own convention, so it also gives the page a real <InlineCode>&lt;title&gt;</InlineCode> and
        description for search engines. The script reads it from the source text without running the page.
      </Paragraph>

      <H3 className={styles.subsection}>3. Send the full list to goatboat</H3>
      <CodeBlock className={styles.code} code={payload} language="http" filename="request.http" />

      <H3 className={styles.subsection}>4. Goatboat reconciles</H3>
      <DataTable
        head={["Case", "What happens"]}
        rows={[
          ["A path in the list with no row", "Create a code row. Parent comes from the path; title and description from metadata"],
          ["A path in the list that already has a row", "Update only the file pointer. Everything else is left alone"],
          ["A code row whose path is no longer in the list", "Set missing_since. Never deleted automatically"],
          ["A path that's back after going missing", "Clear missing_since"],
        ]}
      />

      <H2 className={styles.section}>Who owns what</H2>
      <Paragraph>
        This is the rule that keeps the sync safe to run any number of times: code decides whether a page exists;
        the database decides everything said about it.
      </Paragraph>
      <DataTable
        head={["Field", "Owner", "Why"]}
        rows={[
          ["path, file", "Code", "The file system is the truth about which pages exist"],
          ["Initial title and description", "Code, once", "Sensible defaults when the row is created"],
          ["Title and description afterwards", "Database", "Editable in goatboat; the sync never overwrites them"],
          ["Nav placement and order", "Database", "Reorder the nav without touching code"],
          ["Tags, visibility, dates", "Database", "Same as every other piece of content"],
        ]}
      />

      <H2 className={styles.section}>What the site gets</H2>
      <CodeBlock className={styles.code} code={navQuery} language="ts" filename="usage.ts" />
      <List className={styles.list}>
        <ListItem>
          <Bold>Nav</Bold> from top-level rows marked for the nav, ordered in goatboat.
        </ListItem>
        <ListItem>
          <Bold>Breadcrumbs</Bold> for every URL with one call, because every URL has a row.
        </ListItem>
        <ListItem>
          <Bold>Sitemap, search, &ldquo;recently updated&rdquo;</Bold> covering both kinds of page.
        </ListItem>
        <ListItem>
          <Bold>Unlisted pages</Bold>: a new status for pages that are reachable by URL but left out of feeds and
          the sitemap and marked <InlineCode>noindex</InlineCode>. That&apos;s what <InlineCode>/tests</InlineCode>{" "}
          needs.
        </ListItem>
      </List>

      <H2 className={styles.section}>Open questions</H2>
      <Paragraph>Things worth deciding before building, and where the design could be wrong.</Paragraph>
      <List className={styles.list}>
        <ListItem>
          <Bold>Title drift.</Bold> After creation the database owns the title, so renaming a page in its{" "}
          <InlineCode>metadata</InlineCode> won&apos;t change the row. The page&apos;s{" "}
          <InlineCode>&lt;title&gt;</InlineCode> and its breadcrumb label can then disagree, unless pages read their
          title from the row too.
        </ListItem>
        <ListItem>
          <Bold>When the sync runs.</Bold> On production deploys only, a page you just created locally has no row
          until you deploy, so dev needs a fallback label. Running it during dev too means writing to the shared
          database from your laptop.
        </ListItem>
        <ListItem>
          <Bold>Builds depending on goatboat.</Bold> If the sync runs in the build and goatboat is down, the
          deploy should still succeed. The sync has to be allowed to fail without failing the build.
        </ListItem>
        <ListItem>
          <Bold>Missing pages pile up.</Bold> Flagging instead of deleting is safe, but something has to show
          them to you so you can clean up.
        </ListItem>
        <ListItem>
          <Bold>Dynamic routes are invisible.</Bold> <InlineCode>[...path]</InlineCode> and similar are templates,
          so they get no row. The pages they render are database rows already, so that&apos;s probably fine.
        </ListItem>
        <ListItem>
          <Bold>One site per row.</Bold> <InlineCode>site_id</InlineCode> means a post lives on exactly one site.
          Cross-posting later would need a join table instead.
        </ListItem>
      </List>

      <H2 className={styles.section}>Alternatives considered</H2>
      <DataTable
        head={["Alternative", "Why not"]}
        rows={[
          ["A hand-maintained route map in the site", "The same manual editing as the nav, just moved to another file"],
          ["Derive everything from URL segments", "Gives parents but not labels, tags or visibility"],
          ["Put every page in the database, no app routes", "Bespoke pages still need code; the component registry covers some, not all"],
        ]}
      />
    </PageLayout>
  );
}
