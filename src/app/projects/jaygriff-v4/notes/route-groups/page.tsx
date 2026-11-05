// goatboat: 6ba51cbf-1755-4b12-8308-c1efe54a1472
import { Bold, H2, H3, InlineCode, List, ListItem, Muted, Paragraph } from "@/components/typography";
import { CodeBlock } from "@/components/code-block/CodeBlock";
import type { CodeFile } from "@/components/code-block/types";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorsDemo } from "./errors-demo";
import { LoadingDemo } from "./loading-demo";
import { OptInDemo } from "./optin-demo";
import { RouteSimulator } from "./route-simulator";
import { UrlDemo } from "./url-demo";
import styles from "./page.module.css";

const before: CodeFile = {
  content: `src/app/
├── layout.tsx          html, body, header, footer, page frame
├── page.tsx            /
├── about/page.tsx      /about
├── notes/page.tsx      /notes
└── contact/page.tsx    /contact (still wrapped in all the chrome)`,
};

const after: CodeFile = {
  content: `src/app/
├── layout.tsx          html, body, fonts, metadata. Nothing visual.
├── (site)/
│   ├── layout.tsx      header, footer, page frame
│   ├── page.tsx        /
│   ├── about/page.tsx  /about
│   └── notes/page.tsx  /notes
└── (bare)/
    └── contact/page.tsx  /contact, with no chrome at all`,
};

const approaches = `
| | Route groups | A client component that hides the chrome |
| --- | --- | --- |
| How | Chrome lives in \`(site)/layout.tsx\`; bare pages sit in a group without it | A small client component in the root layout calls \`usePathname()\` and renders the chrome only on non-bare paths |
| Chrome in the HTML of bare pages | None | None (it renders nothing on those paths) |
| Cost | Move about 40 page folders into \`(site)\`, and fix each CSS module's \`@reference\` depth | A few lines, nothing moves |
| New bare page later | Create a folder in \`(bare)\` | Add its path to a list |
| Layout in the right place | Yes: the folder says which pages have chrome | No: the root layout knows about specific pages |
| Page URLs | Unchanged | Unchanged |
`;

/** What Next's docs say about layouts and route groups, and how I'd use them to build pages with no site chrome. */
export default function RouteGroupsPage() {
  return (
    <PageLayout>
      <PageHeader intro="How Next.js layouts and route groups decide what wraps a page, and how I'd make a page with no site chrome." />

      <H2>The problem</H2>
      <Paragraph>
        Every page on this site sits inside one root layout that draws the header, the page frame and the footer. I
        want <InlineCode>/contact</InlineCode> to be just a name, a picture and four links, so it has to escape all of
        that without breaking anything else.
      </Paragraph>

      <H2>What the docs say</H2>
      <Paragraph>
        Read from the Next docs that ship in <InlineCode>node_modules/next/dist/docs</InlineCode>, since this version
        has breaking changes.
      </Paragraph>
      <List>
        <ListItem>
          <Bold>Layouts don't re-render on navigation.</Bold> They keep their state and stay interactive while the
          page inside them changes. (Layouts and Pages.)
        </ListItem>
        <ListItem>
          <Bold>So a layout can't read the current path.</Bold> The docs say layouts don't access the pathname
          because it would go stale. To use the path, read it in a Client Component with{" "}
          <InlineCode>usePathname()</InlineCode>. (Layout file convention.)
        </ListItem>
        <ListItem>
          <Bold>Route groups are folders in parentheses.</Bold> They organise files and add nothing to the URL, and
          they can opt some pages into a layout while keeping others out. (Route Groups.)
        </ListItem>
        <ListItem>
          <Bold>Multiple root layouts are allowed, with a catch.</Bold> Navigating between two different root layouts
          triggers a full page load instead of a soft navigation. (Route Groups, Layout file convention.)
        </ListItem>
        <ListItem>
          <Bold>Two groups can't claim the same URL,</Bold> and without a top-level layout the home route has to live
          inside one of the groups.
        </ListItem>
        <ListItem>
          <Bold>loading, error and not-found are folder conventions,</Bold> and a route group is a folder. The docs
          show a <InlineCode>loading.tsx</InlineCode> moved into an <InlineCode>(overview)</InlineCode> group so only
          the overview page gets the skeleton. (Project structure.)
        </ListItem>
        <ListItem>
          <Bold>Within one segment the order is</Bold> layout, template, error, loading, not-found, page, each wrapping
          the next. So <InlineCode>error.tsx</InlineCode> and <InlineCode>loading.tsx</InlineCode> don't wrap the layout
          beside them. A broken root layout needs <InlineCode>global-error.tsx</InlineCode>, which brings its own{" "}
          <InlineCode>html</InlineCode> and <InlineCode>body</InlineCode>. (error.js, loading.js, not-found.js.)
        </ListItem>
        <ListItem>
          <Bold>With several root layouts there's no single layout to build a 404 from,</Bold> which is what the
          experimental <InlineCode>global-not-found.js</InlineCode> is for. One root layout with nested groups doesn't
          need it. (not-found.js.)
        </ListItem>
      </List>

      <H2>Try it</H2>
      <Paragraph>
        Toy models of those rules, not Next itself. One tab per idea.
      </Paragraph>
      <Tabs defaultValue="layouts">
        <TabsList variant="line">
          <TabsTrigger value="layouts">Layouts</TabsTrigger>
          <TabsTrigger value="urls">URLs</TabsTrigger>
          <TabsTrigger value="opt-in">Opt in</TabsTrigger>
          <TabsTrigger value="loading">Loading</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
        </TabsList>

        <TabsContent value="layouts" className={styles.panel}>
          <Paragraph>
            Bump the counters, then click between routes. Then switch to two root layouts and cross from{" "}
            <InlineCode>/notes</InlineCode> to <InlineCode>/contact</InlineCode> to see what the full page load costs.
          </Paragraph>
          <RouteSimulator />
        </TabsContent>

        <TabsContent value="urls" className={styles.panel}>
          <Paragraph>
            A group is only a folder with parentheses. Wrap a folder and its name vanishes from the URL. Wrap both,
            add the extra file, and two groups end up claiming <InlineCode>/about</InlineCode>.
          </Paragraph>
          <UrlDemo />
        </TabsContent>

        <TabsContent value="opt-in" className={styles.panel}>
          <Paragraph>
            A group can give a layout to some routes and not others. Click a route to move it in or out of{" "}
            <InlineCode>(shop)</InlineCode>. Its URL never changes; only whether the shop layout wraps it.
          </Paragraph>
          <OptInDemo />
        </TabsContent>

        <TabsContent value="loading" className={styles.panel}>
          <Paragraph>
            A <InlineCode>loading.tsx</InlineCode> covers every page under its folder. Put it in a group and it covers
            only the pages in that group. Switch where it lives, then go to each page.
          </Paragraph>
          <LoadingDemo />
        </TabsContent>

        <TabsContent value="errors" className={styles.panel}>
          <Paragraph>
            Break something and see which file catches it, and what stays on screen. Toggle the files to change who is
            nearest. Try breaking the layout with only <InlineCode>dashboard/error.tsx</InlineCode> in place.
          </Paragraph>
          <ErrorsDemo />
        </TabsContent>
      </Tabs>

      <H2>The plan</H2>
      <Paragraph>
        Keep one root layout for the <InlineCode>html</InlineCode> and <InlineCode>body</InlineCode>, and put the
        chrome in a nested layout for one group. That's an ordinary nested layout, so navigating between the groups
        stays a soft navigation. Only separate root layouts reload the page.
      </Paragraph>
      <H3>Before</H3>
      <CodeBlock files={[before]} />
      <H3>After</H3>
      <CodeBlock files={[after]} />
      <Muted>
        The route sync already skips group folders when working out a page's URL, and pages are identified by the ID
        on their first line, so moving files doesn't change any page's identity.
      </Muted>

      <H2>The cheaper alternative</H2>
      <Paragraph>
        Because a client component can read the path, a small component in the root layout could simply render the
        chrome only on paths that aren't in a list of bare ones. It's smaller, but the root layout then has to know
        about specific pages.
      </Paragraph>
      <MarkdownRenderer source={approaches} />
    </PageLayout>
  );
}
