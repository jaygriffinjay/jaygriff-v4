"use client";

import { useMemo, useState } from "react";
import NextLink from "next/link";
import { CodeXml, Search, SlidersHorizontal } from "lucide-react";
import { CapsLabel, Muted, Small } from "@/components/typography";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import styles from "./notes-finder.module.css";

export type Note = {
  path: string;
  title: string;
  description: string | null;
  tags: string[];
  code: boolean;
  project: string;
  /** For linking to the project's notes */
  projectSlug: string;
  section: string;
  publishedAt: string;
  updatedAt: string;
};

type Sort = "published" | "changed" | "title";
type Kind = "all" | "code" | "md";

// The menu's "no filter" choice, which can't be an empty string
const ANY = "*";
const TZ = "America/Chicago";

const SORTS: Record<Sort, string> = { published: "Newest first", changed: "Recently changed", title: "A to Z" };
const KINDS: Record<Kind, string> = { all: "All pages", code: "Code pages", md: "Markdown pages" };

const dateOf = (iso: string, options: Intl.DateTimeFormatOptions) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { ...options, timeZone: TZ }) : "";
const day = (iso: string) => dateOf(iso, { month: "short", day: "numeric", year: "numeric" }) || "—";
const month = (iso: string) => dateOf(iso, { month: "long", year: "numeric" }) || "Undated";

/** Every note as a list: recent first, one search bar, one menu for sorting and filtering. */
export function NotesFinder({ notes }: { notes: Note[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("published");
  const [project, setProject] = useState(ANY);
  const [section, setSection] = useState(ANY);
  const [kind, setKind] = useState<Kind>("all");

  const projects = useMemo(() => [...new Set(notes.map((n) => n.project).filter(Boolean))].sort(), [notes]);
  const sections = useMemo(() => [...new Set(notes.map((n) => n.section).filter(Boolean))].sort(), [notes]);
  // What the search looks through, lowercased once
  const indexed = useMemo(
    () => notes.map((note) => ({ note, text: [note.title, note.description, note.tags.join(" "), note.project, note.section].join(" ").toLowerCase() })),
    [notes],
  );

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const dateKey = sort === "changed" ? "updatedAt" : "publishedAt";
  const shown = indexed
    .filter(({ note, text }) => {
      if (project !== ANY && note.project !== project) return false;
      if (section !== ANY && note.section !== section) return false;
      if (kind !== "all" && note.code !== (kind === "code")) return false;
      return terms.every((t) => text.includes(t));
    })
    .map(({ note }) => note)
    .sort(sort === "title" ? (a, b) => a.title.localeCompare(b.title) : (a, b) => b[dateKey].localeCompare(a[dateKey]));

  // Under month headings when the list runs by date; one plain list when it runs A to Z
  const groups: { label: string | null; notes: Note[] }[] = [];
  for (const note of shown) {
    const label = sort === "title" ? null : month(note[dateKey]);
    const last = groups.at(-1);
    if (last && last.label === label) last.notes.push(note);
    else groups.push({ label, notes: [note] });
  }

  const filtersOn = [project !== ANY, section !== ANY, kind !== "all"].filter(Boolean).length;
  const changes = filtersOn + (sort !== "published" ? 1 : 0);
  const reset = () => {
    setSort("published");
    setProject(ANY);
    setSection(ANY);
    setKind("all");
  };
  const using = [sort !== "published" && SORTS[sort], project !== ANY && project, section !== ANY && section, kind !== "all" && KINDS[kind]].filter(Boolean);

  return (
    <div className={styles.wrap}>
      <div className={styles.controls}>
        <label className={styles.search}>
          <Search aria-hidden="true" className={styles.searchIcon} />
          <input
            type="search"
            className={styles.input}
            placeholder="Search titles, summaries and tags"
            aria-label="Search titles, summaries and tags"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        <DropdownMenu>
          <DropdownMenuTrigger render={<button type="button" className={styles.menuButton} />}>
            <span className={styles.menuLabel}>
              <SlidersHorizontal aria-hidden="true" className={styles.menuIcon} />
              Sort & filter
            </span>
            {changes > 0 && <span className={styles.count}>{changes}</span>}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={sort} onValueChange={(v) => setSort(v as Sort)}>
                {(Object.keys(SORTS) as Sort[]).map((key) => (
                  <DropdownMenuRadioItem key={key} value={key}>
                    {SORTS[key]}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <FilterMenu label="Project" all="All projects" value={project} options={projects} onChange={setProject} />
            <FilterMenu label="Section" all="All sections" value={section} options={sections} onChange={setSection} />
            <FilterMenu
              label="Kind"
              all={KINDS.all}
              value={kind === "all" ? ANY : KINDS[kind]}
              options={[KINDS.code, KINDS.md]}
              onChange={(v) => setKind(v === KINDS.code ? "code" : v === KINDS.md ? "md" : "all")}
            />
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={changes === 0} onClick={reset}>
              Reset
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className={styles.status}>
        <Muted>
          {shown.length === notes.length ? `${notes.length} notes` : `${shown.length} of ${notes.length} notes`}
          {using.length > 0 && ` · ${using.join(" · ")}`}
        </Muted>
        {changes > 0 && (
          <button type="button" className={styles.reset} onClick={reset}>
            Reset
          </button>
        )}
      </div>

      {shown.length === 0 ? (
        <Muted>No notes match.</Muted>
      ) : (
        groups.map((group) => (
          <section key={group.label ?? "all"} className={styles.group}>
            {group.label && <CapsLabel className={styles.month}>{group.label}</CapsLabel>}
            <ul className={styles.list}>
              {group.notes.map((note) => (
                <li key={note.path}>
                  <NoteRow note={note} dateKey={dateKey} />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

/** One filter in the menu: a submenu of choices, with the choice in effect beside its name. */
function FilterMenu({
  label,
  all,
  value,
  options,
  onChange,
}: {
  label: string;
  all: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        {label}
        <span className={styles.current}>{value === ANY ? "Any" : value}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          <DropdownMenuRadioItem value={ANY}>{all}</DropdownMenuRadioItem>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option} value={option}>
              {option}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}

/** A note on one line: its title and as much of its summary as fits, then its project and date. */
function NoteRow({ note, dateKey }: { note: Note; dateKey: "publishedAt" | "updatedAt" }) {
  return (
    <div className={styles.row}>
      <span className={styles.text}>
        <NextLink href={note.path} className={styles.title}>
          {note.code && <CodeXml aria-label="Code page" className={styles.glyph} />}
          {note.title}
        </NextLink>
        {note.description && <Small className={styles.summary}>{note.description}</Small>}
      </span>
      <span className={styles.meta}>
        {note.project && (
          <NextLink href={`/projects/${note.projectSlug}/notes`} className={styles.project}>
            {note.project}
          </NextLink>
        )}
        <Small className={styles.date}>{day(note[dateKey])}</Small>
      </span>
    </div>
  );
}
