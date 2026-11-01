// goatboat: b00209fe-92a9-4881-8d51-57c8fee238b3
import { H2 } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { PageToc } from "@/components/site/page-toc";
import { slugifyHeading } from "@/lib/slugify-heading";
import { ToolCard } from "./ToolCard";
import { StatusKey } from "./StatusKey";
import { STATUS_ORDER } from "./tool-status";
import { SECTIONS, type Tool } from "./tools";
import styles from "./page.module.css";

const byStatus = (tools: Tool[]) =>
  [...tools].sort((a, b) => STATUS_ORDER[a.status ?? "active"] - STATUS_ORDER[b.status ?? "active"]);

// The categories as table-of-contents entries; the headings below get the same ids from their text
const TOC = SECTIONS.map((section) => ({ depth: 2, text: section.label, id: slugifyHeading(section.label) }));

export default function MyStackPage() {
  return (
    <PageLayout hideRelated aside={<PageToc title="My stack" entries={TOC} />} asideOnMobile="top">
      <PageHeader intro="The tools and software I use" separator={false} />

      <div className={styles.page}>
        <StatusKey />

        {SECTIONS.map((section) => {
          const tools = byStatus(section.tools);
          // Halves, not alternating, so the two columns stack back into order on a phone
          const half = Math.ceil(tools.length / 2);
          const columns = [tools.slice(0, half), tools.slice(half)];

          return (
            <section key={section.id} className={styles.sectionBody}>
              <H2 className={styles.sectionHeading}>{section.label}</H2>
              <div className={styles.toolGrid}>
                {columns.map((column, index) => (
                  <div key={index} className={styles.toolColumn}>
                    {column.map((tool) => (
                      <ToolCard key={tool.title} {...tool} />
                    ))}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </PageLayout>
  );
}
