// goatboat: b00209fe-92a9-4881-8d51-57c8fee238b3
import { Lead } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { slugifyHeading } from "@/lib/slugify-heading";
import { StatusKey, StatusLegend } from "./StatusKey";
import { ToolSections } from "./ToolSections";
import { STATUS_ORDER } from "./tool-status";
import { SECTIONS, type Tool } from "./tools";
import styles from "./page.module.css";

const byStatus = (tools: Tool[]) =>
  [...tools].sort((a, b) => STATUS_ORDER[a.status ?? "active"] - STATUS_ORDER[b.status ?? "active"]);

// The categories as table-of-contents entries; the headings below get the same ids from their text
const TOC = SECTIONS.map((section) => ({ depth: 2, text: section.label, id: slugifyHeading(section.label) }));

export default function MyStackPage() {
  return (
    <PageLayout hideRelated tocButton={{ title: "My stack", entries: TOC }}>
      <PageHeader separator={false} />
      <div className={styles.intro}>
        <StatusLegend />
        <Lead>The tools and software I use</Lead>
      </div>

      <div className={styles.page}>
        <StatusKey />

        <ToolSections
          sections={SECTIONS.map((section) => ({ id: section.id, label: section.label, tools: byStatus(section.tools) }))}
        />
      </div>
    </PageLayout>
  );
}
