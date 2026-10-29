import type { TocEntry } from "@/lib/goatboat";
import { slugifyHeading } from "@/lib/slugify-heading";
import { Aside } from "./aside";
import { AsideSection } from "./aside-section";
import { TableOfContents } from "./table-of-contents";

/** The "On this page" side column: the page title, then its headings. */
export function PageToc({ title, entries }: { title: string; entries: TocEntry[] }) {
  return (
    <Aside>
      <AsideSection title="On this page">
        <TableOfContents title={title} titleId={slugifyHeading(title)} entries={entries} />
      </AsideSection>
    </Aside>
  );
}
