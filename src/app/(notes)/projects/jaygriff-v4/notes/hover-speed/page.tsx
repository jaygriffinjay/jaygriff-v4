// goatboat: fe83b66b-47a4-4378-b900-4f2760e763ba
import { ChevronsUpDownIcon, InfoIcon, QrCodeIcon } from "lucide-react";
import { H2, Muted, Paragraph, Small } from "@/components/typography";
import { Logo } from "@/components/site/logo";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

const speeds = [
  { label: "Current", className: undefined },
  { label: "Instant", className: styles.t0 },
  { label: "10ms", className: styles.t10 },
  { label: "50ms", className: styles.t50 },
  { label: "100ms", className: styles.t100 },
];

const elements: { name: string; current: string; render: () => React.ReactNode }[] = [
  {
    name: "Inline link",
    current: "120ms. The blue block that fills in behind the text.",
    render: () => (
      <a href="#" className={styles.link}>
        A link
      </a>
    ),
  },
  {
    name: "Button",
    current: "150ms. Shared by every button.",
    render: () => (
      <div className={styles.inline}>
        <Button type="button">Primary</Button>
        <Button type="button" variant="outline">
          Outline
        </Button>
      </div>
    ),
  },
  {
    name: "Tabs",
    current: "150ms. The text color of the tab you point at.",
    render: () => (
      <Tabs defaultValue="one">
        <TabsList variant="line">
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
      </Tabs>
    ),
  },
  {
    name: "Filter chip",
    current: "150ms. The border and the text.",
    render: () => (
      <button type="button" className={styles.chip}>
        next-js
      </button>
    ),
  },
  {
    name: "Contact row",
    current: "150ms. The border.",
    render: () => (
      <a href="#" className={styles.row}>
        Resume
      </a>
    ),
  },
  {
    name: "QR button",
    current: "150ms. The border.",
    render: () => (
      <button type="button" className={styles.qr} aria-label="QR code">
        <QrCodeIcon aria-hidden="true" />
      </button>
    ),
  },
  {
    name: "Page numbers",
    current: "150ms. The highlight behind the number.",
    render: () => (
      <div className={styles.inline}>
        <a href="#" className={styles.page}>
          2
        </a>
        <a href="#" className={styles.page}>
          3
        </a>
      </div>
    ),
  },
  {
    name: "Expand all",
    current: "150ms. The text color.",
    render: () => (
      <button type="button" className={styles.toggle}>
        <ChevronsUpDownIcon aria-hidden="true" />
        Expand all
      </button>
    ),
  },
  {
    name: "Info button",
    current: "150ms. The icon color, on My stack.",
    render: () => (
      <button type="button" className={styles.key} aria-label="What the statuses mean">
        <InfoIcon aria-hidden="true" />
      </button>
    ),
  },
  {
    name: "Footer mark",
    current: "150ms. The brightness.",
    render: () => (
      <a href="#" className={styles.brand} aria-label="Home">
        <Logo className={styles.logo} />
      </a>
    ),
  },
  {
    name: "Back link",
    current: "200ms for the arrow's nudge, 120ms for the link's block.",
    render: () => (
      <a href="#" className={styles.backLink}>
        <span className={styles.arrow} aria-hidden="true">
          ←
        </span>{" "}
        Back
      </a>
    ),
  },
];

/** Every hover fade on the site at its current speed, next to instant, 10ms, 50ms and 100ms. */
export default function HoverSpeedPage() {
  return (
    <PageLayout>
      <PageHeader intro="Each element on the site that fades on hover, shown five times: at its current speed, instant, 10ms, 50ms and 100ms." />
      <Paragraph>
        Hover each one. The first column is exactly what the site does now. In the others every fade inside the column
        is forced to one duration, so the difference you feel is only the speed. Accordion rows and table rows are
        already instant, so they're not here.
      </Paragraph>

      {elements.map(({ name, current, render }) => (
        <section key={name}>
          <H2>{name}</H2>
          <Muted>Now: {current}</Muted>
          <div className={styles.cells}>
            {speeds.map(({ label, className }) => (
              <div key={label} className={cn(styles.cell, className)}>
                <Small>{label}</Small>
                {render()}
              </div>
            ))}
          </div>
        </section>
      ))}
    </PageLayout>
  );
}
