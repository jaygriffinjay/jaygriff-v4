import { cache } from "react";
import { getDocsNav, type DocsNav, type DocsPage } from "@/lib/goatboat";
import { getCurrentPage } from "@/lib/page-meta";

/** The current page's project docs, when the page sits in a docs section. Null if goatboat fails, so pages still render. */
export const getCurrentDocs = cache(async () => {
  const item = (await getCurrentPage())?.item;
  if (!item?.project || !item.section) return null;
  try {
    const nav = await getDocsNav(item.project.slug);
    return nav && { nav, item };
  } catch (err) {
    console.error(err);
    return null;
  }
});

/** Every page in nav order, each with its section, so prev/next can run across sections. */
export const docsSequence = (nav: DocsNav) =>
  nav.sections.flatMap((section) => section.pages.map((page) => ({ ...page, section })));

/** Where a project's docs start: its first page. */
export const docsStart = (nav: DocsNav): DocsPage | undefined => nav.sections[0]?.pages[0];
