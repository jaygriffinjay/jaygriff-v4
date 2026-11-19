"use client";

import { cloneElement, useMemo, useState, type PointerEvent, type ReactElement, type ReactNode } from "react";
import NextLink from "next/link";
import { ArrowDown, ArrowUp, CodeXml } from "lucide-react";
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_equals,
  filterFn_includesString,
  globalFilteringFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { Muted } from "@/components/typography";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ANY, NotesControls, type FilterOption } from "./notes-controls";
import styles from "./notes-table.module.css";

/** What the notes are sorted by: a column and which way it runs. The headings set it. */
type NotesSortKey = "published" | "changed" | "title" | "project";
type NotesSort = { key: NotesSortKey; desc: boolean };

/** Newest first */
const DEFAULT_SORT: NotesSort = { key: "published", desc: true };

const SORT_KEYS: Record<NotesSortKey, string> = { published: "Published", changed: "Changed", title: "Note", project: "Project" };

/** Dates start with the newest, text with A. */
const startsDescending = (key: NotesSortKey) => key === "published" || key === "changed";

/** The sort a click on a heading gives: the other way if it's already the sort, else the heading's own start. */
const sortedBy = (current: NotesSort, key: NotesSortKey): NotesSort =>
  current.key === key ? { key, desc: !current.desc } : { key, desc: startsDescending(key) };

/** The distinct values of a field with how many rows have each, the biggest first. */
const tally = (values: string[]): FilterOption[] => {
  const counts = new Map<string, number>();
  for (const value of values) if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

export type NotesRow = {
  path: string;
  title: string;
  description: string | null;
  /** Space-separated, so the search covers them; not shown */
  tags: string;
  code: boolean;
  project: string;
  /** For linking to the project's notes */
  projectSlug: string;
  section: string;
  publishedAt: string;
  updatedAt: string;
};

const features = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
  filterFns: { equals: filterFn_equals, includesString: filterFn_includesString },
});

const dateOf = (iso: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Chicago" })
    : "—";

const helper = createColumnHelper<typeof features, NotesRow>();
// ISO dates sort correctly as text; dates start newest first
const columns = helper.columns([
  helper.accessor("title", { sortFn: "alphanumeric", filterFn: "includesString" }),
  helper.accessor("description", { enableSorting: false, filterFn: "includesString" }),
  helper.accessor("tags", { enableSorting: false, filterFn: "includesString" }),
  // A note with no project goes last, whichever way the projects run
  helper.accessor((row) => row.project || undefined, { id: "project", sortFn: "text", sortUndefined: "last", filterFn: "equals", enableGlobalFilter: false }),
  helper.accessor("section", { sortFn: "text", filterFn: "equals", enableGlobalFilter: false }),
  helper.accessor("publishedAt", { sortFn: "text", sortDescFirst: true, enableGlobalFilter: false }),
  helper.accessor("updatedAt", { sortFn: "text", sortDescFirst: true, enableGlobalFilter: false }),
]);

const COLUMN: Record<NotesSortKey, string> = { published: "publishedAt", changed: "updatedAt", title: "title", project: "project" };

/** A heading that sorts the table by its column; tapping it again turns the sort around. */
function SortHead({
  sortKey,
  sort,
  onSort,
  className,
  end,
}: {
  sortKey: NotesSortKey;
  sort: NotesSort;
  onSort: (sort: NotesSort) => void;
  className?: string;
  /** Sits at the right of its column, over right-aligned dates */
  end?: boolean;
}) {
  const active = sort.key === sortKey;
  const Arrow = sort.desc ? ArrowDown : ArrowUp;
  const button = (
    <button type="button" className={cn(styles.sortButton, active && styles.sortActive)} onClick={() => onSort(sortedBy(sort, sortKey))}>
      {SORT_KEYS[sortKey]}
      {active && <Arrow aria-hidden="true" className={styles.arrow} />}
    </button>
  );
  return (
    <TableHead className={className} aria-sort={active ? (sort.desc ? "descending" : "ascending") : undefined}>
      {end ? <span className={styles.alignEnd}>{button}</span> : button}
    </TableHead>
  );
}

/** Wraps an element that may cut its text short; hovering shows `tip`, but only if something is actually cut. */
function Clipped({ element, tip, children }: { element: ReactElement<{ onPointerEnter?: (e: PointerEvent<HTMLElement>) => void }>; tip: ReactNode; children: ReactNode }) {
  const [clipped, setClipped] = useState(false);
  const measure = (e: PointerEvent<HTMLElement>) => setClipped(e.currentTarget.scrollWidth > e.currentTarget.clientWidth);
  return (
    <Tooltip disabled={!clipped}>
      <TooltipTrigger render={cloneElement(element, { onPointerEnter: measure })}>{children}</TooltipTrigger>
      <TooltipContent side="bottom" align="start">
        {tip}
      </TooltipContent>
    </Tooltip>
  );
}

/**
 * Every note in one table: the title, where it lives and its dates.
 * The headings sort it, the search bar narrows it, and the filter button picks a project or section.
 */
export function NotesTable({ rows }: { rows: NotesRow[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<NotesSort>(DEFAULT_SORT);
  const [project, setProject] = useState(ANY);
  const [section, setSection] = useState(ANY);

  const projects = useMemo(() => tally(rows.map((r) => r.project)), [rows]);
  // A picked project narrows the sections to its own, and their counts to its notes
  const sections = useMemo(() => tally(rows.filter((r) => project === ANY || r.project === project).map((r) => r.section)), [rows, project]);
  const pickProject = (next: string) => {
    setProject(next);
    if (next !== ANY && section !== ANY && !rows.some((r) => r.project === next && r.section === section)) setSection(ANY);
  };
  const filtering = project !== ANY || section !== ANY;
  const columnFilters: ColumnFiltersState = [
    ...(project !== ANY ? [{ id: "project", value: project }] : []),
    ...(section !== ANY ? [{ id: "section", value: section }] : []),
  ];

  // Projects share a sort, so the newest of a project's notes come first
  const sorting: SortingState = [
    { id: COLUMN[sort.key], desc: sort.desc },
    ...(sort.key === "project" ? [{ id: "publishedAt", desc: true }] : []),
  ];

  const table = useTable({
    features,
    columns,
    data: rows,
    state: { sorting, columnFilters, globalFilter: query },
    globalFilterFn: "includesString",
  });

  const visible = table.getRowModel().rows;
  const byChanged = sort.key === "changed";

  return (
    <div className={styles.wrap}>
      <NotesControls
        query={query}
        onQuery={setQuery}
        project={project}
        onProject={pickProject}
        projects={projects}
        section={section}
        onSection={setSection}
        sections={sections}
      />

      <div className={styles.status}>
        <Muted>
          {visible.length === rows.length ? `${rows.length} notes` : `${visible.length} of ${rows.length} notes`}
          {filtering && ` · ${[project !== ANY && project, section !== ANY && section].filter(Boolean).join(" · ")}`}
        </Muted>
        {filtering && (
          <button
            type="button"
            className={styles.clear}
            onClick={() => {
              setProject(ANY);
              setSection(ANY);
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      <Table className={styles.table}>
        <TableHeader>
          <TableRow>
            <SortHead sortKey="title" sort={sort} onSort={setSort} className={styles.headTitle} />
            <SortHead sortKey="project" sort={sort} onSort={setSort} className={styles.headWhere} />
            <SortHead sortKey="published" sort={sort} onSort={setSort} className={cn(styles.headDate, byChanged && styles.wideDate)} end />
            <SortHead sortKey="changed" sort={sort} onSort={setSort} className={cn(styles.headDate, !byChanged && styles.wideDate)} end />
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.map((row) => {
            const note = row.original;
            const where = [note.project, note.section].filter(Boolean).join(" · ");
            return (
              <TableRow key={row.id}>
                <TableCell className={styles.titleCell}>
                  <Clipped element={<NextLink href={note.path} className={styles.title} />} tip={note.title}>
                    {note.code && <CodeXml aria-label="Code page" className={styles.glyph} />}
                    {note.title}
                  </Clipped>
                  {where && <Muted className={styles.narrowMeta}>{where}</Muted>}
                </TableCell>
                <TableCell className={styles.whereCell}>
                  {note.project && (
                    <NextLink href={`/projects/${note.projectSlug}/notes`} className={styles.project}>
                      {note.project}
                    </NextLink>
                  )}
                  {note.section && <span className={styles.section}> · {note.section}</span>}
                </TableCell>
                <TableCell className={cn(styles.dateCell, byChanged && styles.wideDate)}>{dateOf(note.publishedAt)}</TableCell>
                <TableCell className={cn(styles.dateCell, !byChanged && styles.wideDate)}>{dateOf(note.updatedAt)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
