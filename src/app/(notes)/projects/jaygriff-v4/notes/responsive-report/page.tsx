// goatboat: 11f66366-debf-4322-b4ff-ee414c8d4bf3
import { CodeBlock } from "@/components/code-block/CodeBlock";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { Bold, H2, H3, H4, InlineCode, List, ListItem, Muted, Paragraph } from "@/components/typography";

const widths = `
| Width | Written as | Where | What it does |
| --- | --- | --- | --- |
| 30rem | \`@media (width < 30rem)\` | Contact page | A small-phone tweak |
| 40rem | \`sm:\` | About, Contact, My stack, Resume, several note pages | Tailwind's default; two-column grids, a bigger avatar |
| 48rem | \`md:\` | Footer | Footer links go from a grid to a row |
| **56rem** | \`wide:\` and \`56rem\` | Header, menu, contents, tables, code block tabs, page frame | **The phone/desktop switch** |
| 80rem | \`80rem\` | Page layout, shell layout, header | The notes column appears and the frame widens |
| 768px | \`MOBILE_BREAKPOINT\` | \`use-mobile.ts\` | shadcn's own cutoff; nothing in this repo uses it |
`;

const literals = `
| File | Line | Form | Purpose |
| --- | --- | --- | --- |
| \`globals.css\` | 80 | \`--breakpoint-wide: 56rem\` | The definition behind \`wide:\` |
| \`globals.css\` | 90 | \`@media (width < 56rem)\` | Scroll padding under the sticky header |
| \`page-layout.module.css\` | 24 | \`@media (width >= 56rem)\` | Article and contents side by side |
| \`page-layout.module.css\` | 72 | \`@media (width < 56rem)\` | Notes and contents buttons share a row |
| \`mobile-menu.tsx\` | 101 | \`matchMedia("(min-width: 56rem)")\` | Close the menu if the window grows |
| \`CodeBlockClient.tsx\` | 103 | \`matchMedia("(min-width: 56rem)")\` | Swap an open lightbox and drawer |
| \`CodeBlockClient.tsx\` | 139 | \`matchMedia("(min-width: 56rem)")\` | Choose lightbox or drawer on expand |
| \`page-layout.module.css\` | 50, 113 | \`@media (width >= 80rem)\` | Notes column, wider gaps |
| \`layout.module.css\` | 16 | \`@media (width >= 80rem)\` | Shell widens |
| \`header.module.css\` | 7 | \`@media (width >= 80rem)\` | Header makes room for the notes column |
`;

const devices = `
| File | Rule | Meaning |
| --- | --- | --- |
| \`CodeBlockClient.module.css\` (2) | \`@media (hover: none)\` | Buttons stay visible; the floating background stays |
| \`header.module.css\` | \`@media (hover: none)\` | No hover treatment on the site name |
| \`page-jump.module.css\` (2) | \`@media (hover: none)\` | A Go arrow, and 16px text so iOS doesn't zoom |
| \`content.module.css\` (goatboat) | \`@media (hover: none)\` | Edit buttons stay visible |
`;

const concepts = `
| Name | Meaning | CSS | JavaScript | Used for |
| --- | --- | --- | --- | --- |
| \`wide\` | Window is 56rem or more | \`wide:\` and \`max-wide:\` | \`queries.wide\` | Page layout: header, menu, contents, tables, explorer |
| \`notes\` | Window is 80rem or more | \`notes:\` and \`max-notes:\` | \`queries.notes\` | The notes column and the wider frame |
| \`touch\` | Main input is a finger: no hover and a coarse pointer | \`touch:\` | \`queries.touch\` | The drawer, always-visible buttons, 16px inputs, Go arrows |
`;

const toolForQuestion = `
| Question | Use | Because |
| --- | --- | --- |
| How much room does the page have? | \`wide\` or \`notes\` | Chrome and page frames follow the window |
| How much room does this component have? | A container query | A card in a column shouldn't care how wide the window is |
| What is the person holding? | \`touch\` | Behaviour follows the input, not the width |
| Does the person want less motion? | \`prefers-reduced-motion\` | A setting, unrelated to the rest |
`;

const matrix = `
| | Narrow window | Wide window |
| --- | --- | --- |
| **Mouse** | Phone layout, lightbox | Desktop layout, lightbox |
| **Touch** | Phone layout, drawer | Desktop layout, drawer (tablet, or a phone in landscape) |
`;

const tokens = `/* globals.css */

/* Layout switches. Every width comes from here: CSS uses the variants, TypeScript uses src/lib/media.ts */
@theme static {
  --breakpoint-wide: 56rem; /* phone layout below, desktop layout from here */
  --breakpoint-notes: 80rem; /* the project's notes get their own column */
}

/* The main input is a finger. Not "any" touch: a laptop with a touch screen still has a trackpad as its main input */
@custom-variant touch (@media (hover: none) and (pointer: coarse));`;

const media = `// src/lib/media.ts
import { useSyncExternalStore } from "react";

// Keep in step with --breakpoint-* in globals.css; scripts/check-media.mts fails the commit if they differ
export const queries = {
  wide: "(min-width: 56rem)",
  notes: "(min-width: 80rem)",
  touch: "(hover: none) and (pointer: coarse)",
} as const;

type Query = keyof typeof queries;

/** For event handlers and effects: the answer right now. */
export const matches = (query: Query) => window.matchMedia(queries[query]).matches;

/** For render: updates when the answer changes. The server and first render say no, so there's no mismatch. */
export function useMedia(query: Query) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(queries[query]);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => matches(query),
    () => false,
  );
}`;

const cssUsage = `/* a CSS module, replacing @media (width >= 56rem) */
.columnsWithAside {
  @variant wide {
    @apply grid-cols-[minmax(0,var(--container-content))_var(--container-aside)];
  }
}

/* replacing @media (hover: none) */
.go {
  display: none;

  @variant touch {
    @apply inline-flex items-center;
  }
}`;

const expand = `// CodeBlockClient.tsx: the expand button
onClick={() => setView(matches("touch") ? "drawer" : "lightbox")}

// and the effect that swapped an open view when the window crossed 56rem is deleted`;

const literalFixes = `
| File | Now | Change to |
| --- | --- | --- |
| \`globals.css\` line 90 | \`@media (width < 56rem)\` on \`html\` | \`max-wide:\` variant |
| \`page-layout.module.css\` lines 24, 72 | \`@media (width >= 56rem)\`, \`(width < 56rem)\` | \`@variant wide\`, \`@variant max-wide\` |
| \`page-layout.module.css\` lines 50, 113 | \`@media (width >= 80rem)\` | \`@variant notes\` |
| \`layout.module.css\` line 16, \`header.module.css\` line 7 | \`@media (width >= 80rem)\` | \`@variant notes\` |
| \`mobile-menu.tsx\` line 101 | \`matchMedia("(min-width: 56rem)")\` | \`useMedia("wide")\`, closing in an effect when it turns true |
| \`CodeBlockClient.tsx\` lines 103, 139 | Two \`matchMedia\` calls | \`matches("touch")\` on click; delete the swap effect |
`;

const touchFixes = `
| File | Now | Change to |
| --- | --- | --- |
| \`CodeBlockClient.module.css\` (2) | \`@media (hover: none)\` | \`@variant touch\` |
| \`header.module.css\` | \`@media (hover: none)\` | \`@variant touch\` |
| \`page-jump.module.css\` (2) | \`@media (hover: none)\` | \`@variant touch\` |
`;

const tierFixes = `
| File | Now | Suggested |
| --- | --- | --- |
| \`about/page.module.css\`, \`contact/page.module.css\` | \`sm:size-48\` on the avatar | \`wide:size-48\` |
| \`contact/page.module.css\` | \`@media (width < 30rem)\` | Make the small layout the default and drop the query |
| \`my-stack/page.module.css\` | \`sm:flex …\`, \`sm:w-96\` | \`wide:\` |
| \`resume/page.module.css\` | \`sm:flex-row\`, \`sm:w-32\` | \`wide:\` |
| \`footer.module.css\` | \`md:flex …\` | \`wide:\` |
| \`Container.module.css\` | \`max-sm:mb-48\` | \`max-wide:mb-48\` |
| Notes pages with \`sm:grid-cols-2\` (goatboat content, projects, components, hover-borders, text-colors, before-after) | \`sm:\` | \`wide:\`, or a container query if the grid sits in a narrow column |
`;

const slices = `
| Slice | What | Visible change | How to check |
| --- | --- | --- | --- |
| 1 | Add \`--breakpoint-notes\`, the \`touch\` variant and \`src/lib/media.ts\`. Convert one CSS module to \`@variant wide\` as a trial | None | The converted page looks the same at 55rem and 57rem |
| 2 | Swap every 56rem and 80rem literal for the names | None | Page layout, header and menu at 55, 57, 79 and 81rem |
| 3 | Lightbox on desktop, drawer on touch | Code block on narrow desktop windows | Expand a block in a narrow desktop window; then in device mode |
| 4 | \`hover: none\` becomes \`touch\` | None | Device mode: Go arrow, 16px input, always-visible buttons |
| 5 | Remove the 30, 40 and 48rem tiers | Pages between 640 and 896px | Each affected page in that range |
| 6 | Add the guard script and the written rule | None | A commit with a stray literal fails |
| 7 | Delete the dead hook | None | Nothing imports it |
`;

const guard = `// scripts/check-media.mts: what it checks
// 1. --breakpoint-* in globals.css equal the widths in src/lib/media.ts
// 2. No "@media (width" or "matchMedia(" with a literal width outside globals.css and media.ts
// 3. No sm:, md:, lg: or xl: outside src/components/ui (shadcn keeps its own)
// 4. No "(hover: none)" outside globals.css and media.ts`;

const rule = `# .github/instructions/responsive.instructions.md (new)

- Page layout follows the window: use wide: or notes:, never a width in rem or px.
- A component's own layout follows its container: use a container query.
- Behaviour that depends on how the person is holding the device uses touch:.
- In JavaScript, use matches() or useMedia() from @/lib/media.`;

/** A report on how the site separates phones from desktops today, and the plan to centralize it. */
export default function ResponsiveReportPage() {
  return (
    <PageLayout>
      <PageHeader intro="How the site decides between desktop and mobile today, what's wrong with it, and a plan for one central place to control it." />

      <H2>Summary</H2>
      <H3>The short answer</H3>
      <Paragraph>
        The site decides desktop versus mobile by window width alone. One width, 56rem, is the real switch, with a
        second at 80rem for the notes column. The only device check is <InlineCode>(hover: none)</InlineCode>, used five
        times as "a touch screen", and none of it is connected to the width rules.
      </Paragraph>

      <H3>What's wrong with that</H3>
      <List>
        <ListItem>
          <Bold>The numbers are copied.</Bold> 56rem is typed in seven places, in CSS and in JavaScript, held together
          by comments.
        </ListItem>
        <ListItem>
          <Bold>Width stands in for device.</Bold> A narrow desktop window gets the drawer, and a wide tablet doesn't.
        </ListItem>
        <ListItem>
          <Bold>Too many tiers.</Bold> 30, 40, 48, 56 and 80rem are all in use, and only two are on purpose.
        </ListItem>
      </List>

      <H3>What I'd do</H3>
      <Paragraph>
        Name three things once: <InlineCode>wide</InlineCode> (window is 56rem or more), <InlineCode>notes</InlineCode>{" "}
        (80rem or more) and <InlineCode>touch</InlineCode> (the main input is a finger). CSS uses them as variants,
        TypeScript through one small file, and a script checks they agree. Then move every raw width and every{" "}
        <InlineCode>hover: none</InlineCode> over to the names, and make the code block choose its drawer by{" "}
        <InlineCode>touch</InlineCode>.
      </Paragraph>

      <H2>Findings</H2>
      <H3>How the site decides today</H3>
      <Paragraph>
        Layout is decided by window width, with one main switch at 56rem and a second one at 80rem. Device type isn't
        checked at all; the closest thing is <InlineCode>(hover: none)</InlineCode>, used in a few places to mean "a
        touch screen". There's no <InlineCode>pointer</InlineCode> check, no orientation check and no user-agent check
        anywhere.
      </Paragraph>

      <H3>Every width threshold</H3>
      <MarkdownRenderer source={widths} />

      <H3>Where 56rem and 80rem are written</H3>
      <Paragraph>
        The <InlineCode>wide:</InlineCode> variant comes from one definition, but the same widths are also typed out by
        hand, in CSS and in JavaScript. A comment in each place says to keep it in step with the others.
      </Paragraph>
      <MarkdownRenderer source={literals} />

      <H4>Where the wide: variant is used</H4>
      <List>
        <ListItem>Header: sticky bar with a menu below it, a static intro block above it.</ListItem>
        <ListItem>Mobile menu: the hamburger button is hidden from it up.</ListItem>
        <ListItem>Contents: the "On this page" button below it, the contents column above.</ListItem>
        <ListItem>Notes table: columns that appear only from it up.</ListItem>
        <ListItem>Code block: the file tab strip below it, the explorer column above.</ListItem>
        <ListItem>Page frame side padding, and the scroll offset when jumping to a heading.</ListItem>
        <ListItem>Two test pages (browse previews, wrap indent).</ListItem>
      </List>

      <H3>Device checks</H3>
      <MarkdownRenderer source={devices} />
      <Paragraph>
        All five mean the same thing: this device can't hover. They're written out by hand each time, and none of them
        is connected to the width rules above.
      </Paragraph>

      <H3>What expanding a code block does</H3>
      <Paragraph>
        The expand button reads <InlineCode>matchMedia("(min-width: 56rem)")</InlineCode> when clicked: wide opens the
        lightbox, narrow opens the drawer. While one is open, another listener swaps it for the other if the window
        crosses 56rem. So a narrow desktop window gets the drawer, and a phone in landscape or an iPad at 1024px gets
        the lightbox.
      </Paragraph>

      <H3>Smaller findings</H3>
      <List>
        <ListItem>
          <InlineCode>use-mobile.ts</InlineCode> (768px) is a leftover from adding shadcn. Nothing in this repo calls
          it. goatboat's sidebar does use its copy.
        </ListItem>
        <ListItem>
          Headings, spacing and code text are scaled continuously with <InlineCode>clamp()</InlineCode> between a 375px
          and a 1024px window. That's not a breakpoint, but the range is only written in comments, nine times.
        </ListItem>
        <ListItem>
          Container queries are rare: the code block's wrapped-line indent, the wrap-indent test page, and shadcn's card
          and field.
        </ListItem>
        <ListItem>
          shadcn's own files in <InlineCode>ui/</InlineCode> use <InlineCode>sm:</InlineCode> and{" "}
          <InlineCode>md:</InlineCode> for details like dialog width and pagination labels.
        </ListItem>
        <ListItem>
          <InlineCode>prefers-reduced-motion</InlineCode> is checked in three scroll handlers and two CSS files; that
          one is a user setting, not a device or a width, so it isn't part of this.
        </ListItem>
        <ListItem>
          The JavaScript checks run only inside effects and click handlers, never during render, so there's no
          hydration mismatch.
        </ListItem>
        <ListItem>
          goatboat has the same pattern on a smaller scale: <InlineCode>use-mobile.ts</InlineCode> at 768px for the
          sidebar, <InlineCode>sm:</InlineCode> and <InlineCode>md:</InlineCode> in shadcn files, one{" "}
          <InlineCode>hover: none</InlineCode>.
        </ListItem>
      </List>

      <H2>Problems</H2>
      <H3>One number, many copies</H3>
      <Paragraph>
        56rem is written in at least seven places, 80rem in four more. CSS media queries can't read a variable, so the
        only protection is a comment saying "keep in step". Change one and nothing tells you about the others.
      </Paragraph>

      <H3>Width stands in for device</H3>
      <Paragraph>
        The code block picks the drawer by window width, but a drawer is a touch idea. A narrow desktop window gets it,
        and a tablet wider than 56rem doesn't. Anything that should follow the device has no way to say so.
      </Paragraph>

      <H3>Too many tiers</H3>
      <Paragraph>
        The site has thresholds at 30, 40, 48, 56 and 80rem, plus 768px in a hook nobody calls. Only 56 and 80 are
        deliberate. The rest came from copying Tailwind defaults or shadcn files, so between 40 and 56rem some pages are
        in their phone layout and others aren't.
      </Paragraph>

      <H3>Touch has no name</H3>
      <Paragraph>
        Each <InlineCode>@media (hover: none)</InlineCode> is typed out on its own. There's no name for "touch", so
        there's no way to ask "where do we treat touch differently?" except searching.
      </Paragraph>

      <H3>The swap listener</H3>
      <Paragraph>
        While a code block view is open, a listener turns the lightbox into the drawer (or back) when the window crosses
        56rem. Those are two different components, so the open block is mounted again and view state, like whether lines
        are wrapped, may reset. With a device-based rule this listener has no job: a device doesn't change type
        mid-session.
      </Paragraph>

      <H3>Hard to test</H3>
      <Paragraph>
        A responsive change today means dragging the window across several widths. Once width and device are separate,
        there are four combinations to look at, and nothing says which ones a page has been checked in.
      </Paragraph>

      <H3>Smaller problems</H3>
      <List>
        <ListItem>
          <Bold>The fluid range lives in comments.</Bold> Nine <InlineCode>clamp()</InlineCode> values share a 375 to
          1024px range that's only written in their comments.
        </ListItem>
        <ListItem>
          <Bold>Raw hover rules.</Bold> A CSS module's <InlineCode>:hover</InlineCode> applies on touch screens too,
          where it sticks after a tap. Tailwind's <InlineCode>hover:</InlineCode> variant only applies on devices that
          can hover.
        </ListItem>
        <ListItem>
          <Bold>A dead hook.</Bold> <InlineCode>use-mobile.ts</InlineCode> invites someone to use a third definition of
          mobile.
        </ListItem>
        <ListItem>
          <Bold>Nothing enforces any of this.</Bold> New code can add a seventh breakpoint and nothing complains.
        </ListItem>
      </List>

      <H2>Proposal</H2>
      <H3>The idea</H3>
      <Paragraph>
        Name three things and define each once. Everything else asks for them by name. Nobody writes{" "}
        <InlineCode>56rem</InlineCode> or <InlineCode>hover: none</InlineCode> again.
      </Paragraph>
      <MarkdownRenderer source={concepts} />

      <H3>Which tool for which question</H3>
      <MarkdownRenderer source={toolForQuestion} />
      <Paragraph>
        This is the rule that keeps the number of tiers down. If a component only cares about its own width, it
        shouldn't be asking the window.
      </Paragraph>

      <H3>The four combinations</H3>
      <Paragraph>
        Because width and touch are separate, a page is in one of four situations. This is also the test matrix.
      </Paragraph>
      <MarkdownRenderer source={matrix} />
      <Paragraph>
        The explorer and the file tabs stay width-based, since that's about room. Only the choice of lightbox or drawer
        follows touch.
      </Paragraph>

      <H3>In CSS</H3>
      <Paragraph>
        Register the widths and the touch variant once, in <InlineCode>globals.css</InlineCode>.
      </Paragraph>
      <CodeBlock code={tokens} language="css" />
      <Paragraph>
        CSS modules then use the variants where they now use raw media queries. Tailwind's{" "}
        <InlineCode>@variant</InlineCode> goes inside a rule, so each query block becomes a nested one.
      </Paragraph>
      <CodeBlock code={cssUsage} language="css" />
      <Muted>
        Worth proving on one file first: <InlineCode>@variant</InlineCode> next to <InlineCode>@reference</InlineCode> in
        a module should work, but it's the one part of this I haven't run.
      </Muted>

      <H3>In TypeScript</H3>
      <Paragraph>
        One small file holds the queries, with one function for handlers and one hook for render. CSS can't share a
        number with TypeScript, so a check script compares the two and fails the commit if they drift. That replaces
        today's comments with something that can fail.
      </Paragraph>
      <CodeBlock code={media} language="ts" />

      <H4>Why not read the width from the CSS variable?</H4>
      <Paragraph>
        It's possible: <InlineCode>getComputedStyle</InlineCode> on the root returns{" "}
        <InlineCode>--breakpoint-wide</InlineCode>, which would make the CSS the only source. The cost is a runtime
        read, a fallback while the page loads, and a theme variable that must be forced into the output. A checked
        constant is simpler and fails earlier.
      </Paragraph>

      <H3>The code block, in one line</H3>
      <CodeBlock code={expand} language="tsx" />
      <Paragraph>
        Lightbox on every desktop width, drawer only when the main input is a finger. The lightbox already caps at 94%
        of the window's width, so it should hold up in a narrow desktop window.
      </Paragraph>

      <H3>Edge cases</H3>
      <List>
        <ListItem>
          <Bold>iPad.</Bold> It reports touch, so it gets the drawer even at 1024px. With a trackpad attached, the
          browser reports the trackpad as the main input and it gets the lightbox.
        </ListItem>
        <ListItem>
          <Bold>Touch laptop.</Bold> The main input is the trackpad, so it counts as mouse.
        </ListItem>
        <ListItem>
          <Bold>Phone in landscape.</Bold> Touch, so the drawer. Wide enough for the desktop layout, which is fine: the
          layout and the drawer are separate decisions.
        </ListItem>
        <ListItem>
          <Bold>Desktop dev tools in device mode.</Bold> They switch the browser to touch, so the drawer can be tested
          without a phone.
        </ListItem>
      </List>

      <H2>Fixes</H2>
      <H3>Swap the copies for the names</H3>
      <Paragraph>No visible change. Once the tokens and variants exist, each literal becomes a name.</Paragraph>
      <MarkdownRenderer source={literalFixes} />

      <H3>Make the drawer a touch decision</H3>
      <Paragraph>
        The change you asked for. In <InlineCode>CodeBlockClient.tsx</InlineCode>, expanding chooses the drawer on touch
        and the lightbox otherwise, and the swap listener goes. Lightbox on every desktop width, drawer only on a phone
        or tablet.
      </Paragraph>

      <H3>Name the touch rule</H3>
      <Paragraph>No visible change on any device that behaves the same as before.</Paragraph>
      <MarkdownRenderer source={touchFixes} />
      <Muted>
        One difference to watch: <InlineCode>hover: none</InlineCode> alone also matches some stylus and game-console
        browsers. The combined rule is a little stricter.
      </Muted>

      <H3>Remove the extra tiers</H3>
      <Paragraph>
        This is the only step that changes how pages look. Anything at 40 or 48rem moves to 56rem, so between those
        widths a page keeps its phone layout for longer. Look at each in a window between 640 and 896px.
      </Paragraph>
      <MarkdownRenderer source={tierFixes} />

      <H3>Delete the dead hook</H3>
      <Paragraph>
        <InlineCode>src/hooks/use-mobile.ts</InlineCode> has no users in this repo. Deleting it removes a third meaning
        of "mobile". If a shadcn component is added later that needs it, re-adding the component will bring it back.
      </Paragraph>

      <H3>Leave alone</H3>
      <Paragraph>
        The shadcn files in <InlineCode>ui/</InlineCode> keep their own <InlineCode>sm:</InlineCode> and{" "}
        <InlineCode>md:</InlineCode> classes, as the project rules say, and the fluid <InlineCode>clamp()</InlineCode>{" "}
        scale stays as it is. Both work, and neither causes the problems above.
      </Paragraph>

      <H2>Factoring</H2>
      <H3>The order</H3>
      <Paragraph>
        Seven small slices, each working on its own. The first two change nothing visible, so they can be checked in a
        few minutes. The two that change what a person sees are 3 and 5, and they're kept apart on purpose.
      </Paragraph>
      <MarkdownRenderer source={slices} />

      <H3>The guard</H3>
      <Paragraph>
        The rules only last if something enforces them. A small script, run by the same pre-commit hook that stamps
        pages, checks the four things below.
      </Paragraph>
      <CodeBlock code={guard} language="ts" />

      <H3>The written rule</H3>
      <Paragraph>
        A short instruction file, so that every new page and every assistant gets it without being told. The build-ui
        skill would get one line pointing at it.
      </Paragraph>
      <CodeBlock code={rule} language="md" />

      <H3>What gets easier</H3>
      <List>
        <ListItem>
          <Bold>Changing the switch width.</Bold> One line in <InlineCode>globals.css</InlineCode> and one in{" "}
          <InlineCode>media.ts</InlineCode>, and the script tells you if you forgot the second.
        </ListItem>
        <ListItem>
          <Bold>Asking "where do we treat touch differently?"</Bold> Search for <InlineCode>touch</InlineCode>.
        </ListItem>
        <ListItem>
          <Bold>Writing a new page.</Bold> There are two layout names and one device name to choose from, instead of
          five widths and a media query to remember.
        </ListItem>
        <ListItem>
          <Bold>Testing.</Bold> Four combinations, written down, with the dev tools' device mode covering touch.
        </ListItem>
      </List>

      <H3>goatboat</H3>
      <Paragraph>
        goatboat has its own copy of the same problem on a smaller scale: a 768px hook for the sidebar and a few{" "}
        <InlineCode>sm:</InlineCode> classes. It's an admin tool, so I'd leave it until this site's version has settled,
        then copy the same tokens across.
      </Paragraph>

      <H2>Decisions</H2>
      <H3>Before slice 1</H3>
      <List>
        <ListItem>
          <Bold>iPad gets the drawer.</Bold> It reports touch even at 1024px wide. I think that's right, since a
          lightbox on a tablet is an awkward target. Agree?
        </ListItem>
        <ListItem>
          <Bold>Drop the 40rem tier?</Bold> Moving two-column grids and the avatar from 40rem to 56rem means pages
          between 640 and 896px stay single column for longer. The alternative is to keep one in-between tier, or switch
          those grids to container queries.
        </ListItem>
        <ListItem>
          <Bold>Keep shadcn's classes?</Bold> Resetting Tailwind's default breakpoints would make any leftover{" "}
          <InlineCode>sm:</InlineCode> class do nothing, shadcn's included. I'd keep the defaults and let the guard
          script ban them everywhere except <InlineCode>ui/</InlineCode>.
        </ListItem>
        <ListItem>
          <Bold>The name "notes".</Bold> It's the width where the notes column appears, so{" "}
          <InlineCode>notes:</InlineCode> reads naturally, but it's also a section of the site.{" "}
          <InlineCode>rail:</InlineCode> or <InlineCode>frame:</InlineCode> are options.
        </ListItem>
        <ListItem>
          <Bold>CSS-first or constant-plus-check.</Bold> I'd use a TypeScript constant with a script that checks it
          against the CSS. Reading the width from the CSS variable at runtime also works.
        </ListItem>
      </List>
      <Paragraph>
        One thing to confirm by trying rather than deciding: that <InlineCode>@variant</InlineCode> works in a CSS
        module with <InlineCode>@reference</InlineCode>. Slice 1 starts with that.
      </Paragraph>
    </PageLayout>
  );
}
