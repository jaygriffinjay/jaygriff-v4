import type { TocEntry } from "@/lib/goatboat";
import { slugifyHeading } from "@/lib/slugify-heading";
import { Aside } from "./aside";
import { ReportToc } from "./mobile-menu";
import { TocDisclosure } from "./toc-disclosure";

/** The "On this page" side column: the page title, then its headings. Collapsed to a bar on a phone, and also listed in the mobile menu. */
export function PageToc({ title, entries }: { title: string; entries: TocEntry[] }) {
  return (
    <Aside>
      <ReportToc title={title} titleId={slugifyHeading(title)} entries={entries} />
      <TocDisclosure title={title} titleId={slugifyHeading(title)} entries={entries} />
    </Aside>
  );
}

/** Just the "On this page" button, at every width, for pages without the side column. Also listed in the mobile menu. */
export function PageTocButton({ title, entries }: { title: string; entries: TocEntry[] }) {
  return (
    <>
      <ReportToc title={title} titleId={slugifyHeading(title)} entries={entries} />
      <TocDisclosure title={title} titleId={slugifyHeading(title)} entries={entries} buttonOnly />
    </>
  );
}
