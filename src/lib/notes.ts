import { cache } from "react";
import { getNotesNav, listProjects, type NotesNav, type NotesPage } from "@/lib/goatboat";
import { getCurrentPage, isVisible } from "@/lib/page-meta";

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

/** Every visible project that has notes, with its notes nav, in project order. */
export async function listAllNotes() {
  const projects = (await listProjects()).filter(isVisible);
  const navs = await Promise.all(projects.map((p) => getNotesNav(p.slug)));
  return navs.filter((nav): nav is NotesNav => !!nav && nav.sections.length > 0);
}

/** Every notes page across projects, each with its project and section, in nav order. */
export const allNotesPages = (navs: NotesNav[]) =>
  navs.flatMap((nav) => notesSequence(nav).map((page) => ({ ...page, project: nav.project })));
