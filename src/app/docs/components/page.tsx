import NextLink from "next/link";
import {
  Blockquote,
  Bold,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Highlight,
  InlineCode,
  Italic,
  List,
  ListItem,
  Paragraph,
  Small,
  Strikethrough,
  Underline,
} from "@/components/typography";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { Aside } from "@/components/site/aside";
import { AsideSection } from "@/components/site/aside-section";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

const sections = [
  { id: "headings", title: "Headings" },
  { id: "text", title: "Text" },
  { id: "links", title: "Links" },
  { id: "blues", title: "Blue candidates" },
  { id: "accents", title: "Accent candidates" },
  { id: "lists", title: "Lists & quotes" },
  { id: "buttons", title: "Buttons" },
  { id: "focus", title: "Focus rings" },
  { id: "secondary-options", title: "Secondary options" },
  { id: "badges", title: "Badges" },
  { id: "cards", title: "Cards & alerts" },
  { id: "card-options", title: "Card options" },
  { id: "forms", title: "Form controls" },
  { id: "tabs", title: "Tabs" },
];

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

// purple candidates for a second theme color, kept at roughly the blue's lightness so they pair evenly
const accentCandidates = [
  { name: "Violet", value: "oklch(0.68 0.17 295)", className: styles.violet },
  { name: "Orchid", value: "oklch(0.70 0.18 320)", className: styles.orchid },
  { name: "Lavender", value: "oklch(0.76 0.11 295)", className: styles.lavender },
  { name: "Indigo", value: "oklch(0.62 0.19 280)", className: styles.indigo },
];

interface AccentCandidateProps {
  name: string;
  value: string;
  className: string;
}

// moodier/darker alternatives to the current link blue; inline code stays as-is for comparison
const blueCandidates = [
  { name: "Current", value: "oklch(0.66 0.18 252)", className: styles.blueCurrent },
  { name: "Deep azure", value: "oklch(0.60 0.16 255)", className: styles.blueDeepAzure },
  { name: "Midnight", value: "oklch(0.55 0.15 258)", className: styles.blueMidnight },
  { name: "Denim", value: "oklch(0.60 0.13 245)", className: styles.blueDenim },
  { name: "Steel", value: "oklch(0.62 0.11 250)", className: styles.blueSteel },
  { name: "Slate", value: "oklch(0.60 0.09 260)", className: styles.blueSlate },
  { name: "Dusk", value: "oklch(0.62 0.14 265)", className: styles.blueDusk },
  { name: "Ocean", value: "oklch(0.60 0.12 235)", className: styles.blueOcean },
  { name: "Cornflower", value: "oklch(0.66 0.11 260)", className: styles.blueCornflower },
  { name: "Storm", value: "oklch(0.58 0.07 250)", className: styles.blueStorm },
];

interface OptionProps {
  name: string;
  note: string;
  className?: string;
}

const focusOptions: OptionProps[] = [
  { name: "Current", note: "thick translucent halo plus a bright border", className: styles.focusCurrent },
  { name: "Crisp outline", note: "2px line with a small gap, no halo", className: styles.focusOutline },
  { name: "Gap ring", note: "border, gap, then ring, like the link hover", className: styles.focusGap },
  { name: "Soft glow", note: "faint halo, no hard edge", className: styles.focusGlow },
  { name: "Neutral", note: "white outline that stays out of the color scheme", className: styles.focusNeutral },
  { name: "Indigo", note: "crisp outline in the second theme color", className: styles.focusIndigo },
];

const secondaryOptions: OptionProps[] = [
  { name: "Current", note: "navy fill from the old template" },
  { name: "Graphite", note: "neutral gray lifted off the page", className: styles.secondaryGraphite },
  { name: "Frost", note: "translucent white, adapts to any background", className: styles.secondaryFrost },
  { name: "Blue tint", note: "faint wash of the link blue with blue text", className: styles.secondaryBlueTint },
  { name: "Indigo tint", note: "faint wash of indigo with indigo text", className: styles.secondaryIndigoTint },
  { name: "Deep blue", note: "solid dark blue with light text", className: styles.secondaryDeepBlue },
];

const cardOptions: OptionProps[] = [
  { name: "Current", note: "navy fill, 24px corners, faint ring" },
  { name: "Tonal", note: "page color lifted a step, 12px corners", className: styles.cardTonal },
  { name: "Outline", note: "no fill, just a hairline border", className: styles.cardOutline },
  { name: "Glass", note: "translucent fill with a top highlight", className: styles.cardGlass },
  { name: "Accent edge", note: "tonal with a blue left edge, like inline code", className: styles.cardAccentEdge },
  { name: "Sunken", note: "darker than the page, set in", className: styles.cardSunken },
];

function OptionLabel({ name, note }: OptionProps) {
  return (
    <div className={styles.optionLabel}>
      <Bold>{name}</Bold>
      <Small className={styles.optionNote}>{note}</Small>
    </div>
  );
}

function FocusOption(option: OptionProps) {
  return (
    <div className={cn(styles.option, option.className)}>
      <OptionLabel {...option} />
      <div className={styles.row}>
        <Button variant="outline" className={styles.forced}>
          Focused
        </Button>
        <Input className={cn(styles.focusInput, styles.forced)} placeholder="Focused input" />
        <Button variant="outline">Tab to me</Button>
        <Button>Tab to me</Button>
      </div>
    </div>
  );
}

function SecondaryOption(option: OptionProps) {
  return (
    <div className={cn(styles.option, option.className)}>
      <OptionLabel {...option} />
      <div className={styles.row}>
        <Button variant="secondary">Secondary</Button>
        <Button variant="secondary" size="sm">
          Small
        </Button>
        <Badge variant="secondary">Badge</Badge>
        <Badge variant="secondary">Another tag</Badge>
      </div>
    </div>
  );
}

function CardOption(option: OptionProps) {
  return (
    <Card className={option.className}>
      <CardHeader>
        <CardTitle>{option.name}</CardTitle>
        <CardDescription>{option.note}</CardDescription>
      </CardHeader>
      <CardContent>
        <Paragraph>
          Card body with a{" "}
          <NextLink href="#card-options" className={styles.link}>
            link
          </NextLink>{" "}
          and some <InlineCode>inline code</InlineCode>.
        </Paragraph>
      </CardContent>
      <CardFooter className={styles.row}>
        <Button size="sm">Action</Button>
        <Button size="sm" variant="ghost">
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}

function BlueCandidate({ name, value, className }: AccentCandidateProps) {
  return (
    <div className={cn(styles.blueCandidate, className)}>
      <div className={styles.swatchRow}>
        <span className={styles.swatch} aria-hidden />
        <div>
          <H3 className={styles.blueName}>{name}</H3>
          <Small className={styles.candidateValue}>{value}</Small>
        </div>
      </div>

      <nav aria-label={`${name} nav sample`} className={styles.blueNav}>
        {["Home", "Projects", "Posts", "About"].map((label) => (
          <NextLink key={label} href="#blues" className={styles.blueNavLink}>
            {label}
          </NextLink>
        ))}
      </nav>

      <H4 className={styles.blueHeading}>A heading set in {name.toLowerCase()}</H4>
      <H4>
        A heading with{" "}
        <NextLink href="#blues" className={styles.blueLink}>
          a link inside it
        </NextLink>
      </H4>

      <Paragraph>
        Body text with{" "}
        <NextLink href="#blues" className={styles.blueLink}>
          an inline link
        </NextLink>
        , then{" "}
        <NextLink href="#blues" className={styles.blueLink}>
          a longer link that runs on for a bit
        </NextLink>
        , next to some <InlineCode>inline code</InlineCode> for comparison.{" "}
        <span className={styles.blueText}>This phrase is the color as plain text.</span>
      </Paragraph>

      <Small className={styles.blueMeta}>
        Posted Oct 9, 2026 in{" "}
        <NextLink href="#blues" className={styles.blueLink}>
          Web
        </NextLink>
        ,{" "}
        <NextLink href="#blues" className={styles.blueLink}>
          software engineering
        </NextLink>
      </Small>
    </div>
  );
}

function AccentCandidate({ name, value, className }: AccentCandidateProps) {
  return (
    <Card className={cn(styles.candidateCard, className)}>
      <CardHeader>
        <div className={styles.swatchRow}>
          <span className={styles.swatch} aria-hidden />
          <div>
            <CardTitle className={styles.candidateName}>{name}</CardTitle>
            <CardDescription className={styles.candidateValue}>{value}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className={styles.candidateBody}>
        <Paragraph>
          A{" "}
          <NextLink href="#accents" className={styles.candidateLink}>
            {name.toLowerCase()} link
          </NextLink>{" "}
          next to a{" "}
          <NextLink href="#accents" className={styles.link}>
            blue link
          </NextLink>
          .
        </Paragraph>
        <div className={styles.row}>
          <span className={styles.chip}>Tag</span>
          <span className={styles.chip}>Another tag</span>
        </div>
      </CardContent>
    </Card>
  );
}

function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className={styles.section}>
      <H2 className={styles.sectionTitle}>{title}</H2>
      {children}
    </section>
  );
}

function ComponentsAside() {
  return (
    <Aside>
      <AsideSection title="On this page">
        <ul className={styles.tocList}>
          {sections.map((section) => (
            <li key={section.id}>
              <NextLink href={`#${section.id}`} className={styles.link}>
                {section.title}
              </NextLink>
            </li>
          ))}
        </ul>
      </AsideSection>
    </Aside>
  );
}

export default function ComponentsPage() {
  return (
    <PageLayout aside={<ComponentsAside />}>
      <NextLink href="/docs/components/library" className={styles.libraryBanner}>
        <span>Component library: every component with the real theme</span>
        <span aria-hidden>→</span>
      </NextLink>
      <article className={styles.article}>
        <PageHeader className={styles.intro} />

        <Section id="headings" title="Headings">
          <div className={styles.stack}>
            <H1>Heading 1</H1>
            <H2>Heading 2</H2>
            <H3>Heading 3</H3>
            <H4>Heading 4</H4>
            <H5>Heading 5</H5>
            <H6>Heading 6</H6>
          </div>
        </Section>

        <Section id="text" title="Text">
          <Paragraph>
            A paragraph with <Bold>bold</Bold>, <Italic>italic</Italic>,{" "}
            <Underline>underlined</Underline>, <Strikethrough>struck</Strikethrough>, and{" "}
            <Highlight>highlighted</Highlight> text, plus some <InlineCode>inline code</InlineCode>.
          </Paragraph>
          <Paragraph>
            Long-form body copy should stay comfortable to read on a phone. This sentence is
            here to show how a few lines of text wrap and how the line height feels across a
            full paragraph.
          </Paragraph>
          <Small>Small text for captions and metadata.</Small>
        </Section>

        <Section id="links" title="Links">
          <Paragraph>
            Links are just a color until you hover them, like{" "}
            <NextLink href="/" className={styles.link}>
              this one to the home page
            </NextLink>{" "}
            or{" "}
            <NextLink href="https://github.com/jaygriffinjay" className={styles.link}>
              my GitHub
            </NextLink>
            . A link that wraps across lines keeps its highlight on every line:{" "}
            <NextLink href="/docs/components" className={styles.link}>
              this deliberately long link text should wrap onto a second line on most screens
            </NextLink>
            .
          </Paragraph>
        </Section>

        <Section id="blues" title="Blue candidates">
          <Paragraph className={styles.lede}>
            Darker and moodier blues for links, headings, and nav. Hover a link to see its fill.
          </Paragraph>
          <div className={styles.blueCandidates}>
            {blueCandidates.map((candidate) => (
              <BlueCandidate key={candidate.name} {...candidate} />
            ))}
          </div>
        </Section>

        <Section id="accents" title="Accent candidates">
          <Paragraph className={styles.lede}>
            Possible second theme colors, shown on links, cards, and tags next to the blue.
          </Paragraph>
          <div className={styles.candidates}>
            {accentCandidates.map((candidate) => (
              <AccentCandidate key={candidate.name} {...candidate} />
            ))}
          </div>
        </Section>

        <Section id="lists" title="Lists & quotes">
          <List>
            <ListItem>Unordered item one</ListItem>
            <ListItem>Unordered item two</ListItem>
            <ListItem>Unordered item three</ListItem>
          </List>
          <List ordered>
            <ListItem>Ordered step one</ListItem>
            <ListItem>Ordered step two</ListItem>
            <ListItem>Ordered step three</ListItem>
          </List>
          <Blockquote>
            A blockquote for pulling out something worth repeating.
          </Blockquote>
        </Section>

        <Section id="buttons" title="Buttons">
          <div className={styles.row}>
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className={styles.row}>
            <Button size="xs">Extra small</Button>
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Section>

        <Section id="focus" title="Focus rings">
          <Paragraph>
            A focus ring is the outline that appears around a button, input, or link when you
            reach it with the <Kbd>Tab</Kbd> key. Clicking doesn&apos;t show it. It tells
            keyboard users where they are on the page. Click this paragraph, then press{" "}
            <Kbd>Tab</Kbd> to move through these:
          </Paragraph>
          <div className={styles.row}>
            <Button>Button</Button>
            <Button variant="outline">Outline</Button>
            <Input className={styles.focusInput} placeholder="An input" />
            <NextLink href="#focus" className={styles.link}>
              A link
            </NextLink>
          </div>

          <Paragraph className={styles.lede}>
            Options. The first two controls in each row are always shown focused; tab into the
            others to see the real thing.
          </Paragraph>
          <div className={styles.options}>
            {focusOptions.map((option) => (
              <FocusOption key={option.name} {...option} />
            ))}
          </div>
        </Section>

        <Section id="secondary-options" title="Secondary options">
          <Paragraph className={styles.lede}>
            Secondary is the fill for secondary buttons and badges.
          </Paragraph>
          <div className={styles.options}>
            {secondaryOptions.map((option) => (
              <SecondaryOption key={option.name} {...option} />
            ))}
          </div>
        </Section>

        <Section id="badges" title="Badges">
          <div className={styles.row}>
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </Section>

        <Section id="cards" title="Cards & alerts">
          <Card>
            <CardHeader>
              <CardTitle>Card title</CardTitle>
              <CardDescription>A short description of what this card holds.</CardDescription>
            </CardHeader>
            <CardContent>
              <Paragraph>Card body content goes here.</Paragraph>
            </CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>
          <Alert>
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>This is the default alert style.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>This is the destructive alert style.</AlertDescription>
          </Alert>
        </Section>

        <Section id="card-options" title="Card options">
          <div className={styles.candidates}>
            {cardOptions.map((option) => (
              <CardOption key={option.name} {...option} />
            ))}
          </div>
        </Section>

        <Section id="forms" title="Form controls">
          <div className={styles.field}>
            <Label htmlFor="demo-email">Email</Label>
            <Input id="demo-email" type="email" placeholder="you@example.com" />
          </div>
          <div className={styles.field}>
            <Label htmlFor="demo-message">Message</Label>
            <Textarea id="demo-message" placeholder="Say something" />
          </div>
          <div className={styles.inline}>
            <Checkbox id="demo-checkbox" />
            <Label htmlFor="demo-checkbox">Checkbox</Label>
          </div>
          <div className={styles.inline}>
            <Switch id="demo-switch" />
            <Label htmlFor="demo-switch">Switch</Label>
          </div>
          <Separator />
          <Paragraph>
            Keyboard hint: press <Kbd>⌘</Kbd> <Kbd>K</Kbd>
          </Paragraph>
        </Section>

        <Section id="tabs" title="Tabs">
          <Tabs defaultValue="one">
            <TabsList>
              <TabsTrigger value="one">First</TabsTrigger>
              <TabsTrigger value="two">Second</TabsTrigger>
            </TabsList>
            <TabsContent value="one">
              <Paragraph>Content for the first tab.</Paragraph>
            </TabsContent>
            <TabsContent value="two">
              <Paragraph>Content for the second tab.</Paragraph>
            </TabsContent>
          </Tabs>
        </Section>
      </article>
    </PageLayout>
  );
}
