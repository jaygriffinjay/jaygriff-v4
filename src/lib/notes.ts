import { cache } from "react";
import { getNotesNav, type NotesNav, type NotesPage } from "@/lib/goatboat";
import { getCurrentPage } from "@/lib/page-meta";

/** The current page's project notes, when the page sits in a notes section. Null if goatboat fails, so pages still render. */
export const getCurrentNotes = cache(async () => {
  const item = (await getCurrentPage())?.item;
  if (!item?.project || !item.section) return null;
  try {
    const nav = await getNotesNav(item.project.slug);
    return nav && { nav, item };
  } catch (err) {
    console.error(err);
    return null;
  }
});

/** Every page in nav order, each with its section, so prev/next can run across sections. */
export const notesSequence = (nav: NotesNav) =>
  nav.sections.flatMap((section) => section.pages.map((page) => ({ ...page, section })));

/** Where a project's notes start: its first page. */
export const notesStart = (nav: NotesNav): NotesPage | undefined => nav.sections[0]?.pages[0];
