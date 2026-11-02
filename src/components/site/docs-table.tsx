"use client";

import { useMemo, useState } from "react";
import NextLink from "next/link";
import { ArrowDown, ArrowUp, CodeXml, Search, X } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import styles from "./docs-table.module.css";

export type DocsRow = {
  path: string;
  title: string;
  description: string | null;
  code: boolean;
  project: string;
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

const helper = createColumnHelper<typeof features, DocsRow>();
// ISO dates sort correctly as text; dates start newest first
const columns = helper.columns([
  helper.accessor("title", { sortFn: "alphanumeric", filterFn: "includesString" }),
  helper.accessor("description", { enableSorting: false, filterFn: "includesString" }),
  helper.accessor("project", { sortFn: "text", filterFn: "equals", enableGlobalFilter: false }),
  helper.accessor("section", { sortFn: "text", filterFn: "equals", enableGlobalFilter: false }),
  helper.accessor("publishedAt", { sortFn: "text", sortDescFirst: true, enableGlobalFilter: false }),
  helper.accessor("updatedAt", { sortFn: "text", sortDescFirst: true, enableGlobalFilter: false }),
]);

const HEADERS: Record<string, string> = {
  title: "Page",
  description: "Summary",
  project: "Project",
  section: "Section",
  publishedAt: "Published",
  updatedAt: "Changed",
};

const NEWEST: SortingState = [{ id: "publishedAt", desc: true }];

/**
 * Every docs page and test in one table, all in the browser: search, filter by project, section and kind,
 * and sort by several columns at once. Each column heading tapped adds to the sort, in order.
 */
export function DocsTable({ rows }: { rows: DocsRow[] }) {
  const [sorting, setSorting] = useState<SortingState>(NEWEST);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [kind, setKind] = useState<"all" | "code" | "md">("all");

  const data = useMemo(() => (kind === "all" ? rows : rows.filter((r) => r.code === (kind === "code"))), [rows, kind]);
  const projects = useMemo(() => [...new Set(rows.map((r) => r.project))], [rows]);
  const sections = useMemo(() => [...new Set(rows.map((r) => r.section))], [rows]);

  const table = useTable({
    features,
    columns,
    data,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    enableMultiSort: true,
    // Every tap adds to the sort, so it works on phones without Shift
    isMultiSortEvent: () => true,
    maxMultiSortColCount: 3,
  });

  const filterOf = (id: string) => columnFilters.find((f) => f.id === id)?.value as string | undefined;
  const setFilter = (id: string, value?: string) =>
    setColumnFilters((prev) => [...prev.filter((f) => f.id !== id), ...(value ? [{ id, value }] : [])]);
  const visible = table.getRowModel().rows;
  // On phones only one date fits: the one sorted by first, else Published
  const byChanged = sorting.find((s) => s.id === "publishedAt" || s.id === "updatedAt")?.id === "updatedAt";

  const chip = (active: boolean, onClick: () => void, label: string) => (
    <button
      key={label}
      type="button"
      className={cn(styles.chip, active && styles.chipActive)}
      aria-pressed={active}
      onClick={onClick}
    >
      {label}
    </button>
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.filters}>
        <label className={styles.search}>
          <Search aria-hidden="true" className={styles.searchIcon} />
          <Input
            type="search"
            placeholder="Search titles and summaries"
            aria-label="Search titles and summaries"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </label>
        <div className={styles.filterRow}>
          <Muted className={styles.filterLabel}>Project</Muted>
          {chip(!filterOf("project"), () => setFilter("project"), "All")}
          {projects.map((p) => chip(filterOf("project") === p, () => setFilter("project", p), p))}
        </div>
        <div className={styles.filterRow}>
          <Muted className={styles.filterLabel}>Section</Muted>
          {chip(!filterOf("section"), () => setFilter("section"), "All")}
          {sections.map((s) => chip(filterOf("section") === s, () => setFilter("section", s), s))}
        </div>
        <div className={styles.filterRow}>
          <Muted className={styles.filterLabel}>Kind</Muted>
          {chip(kind === "all", () => setKind("all"), "All")}
          {chip(kind === "code", () => setKind("code"), "Code")}
          {chip(kind === "md", () => setKind("md"), "Markdown")}
        </div>
      </div>

      <div className={styles.status}>
        <Muted>
          {visible.length} {visible.length === 1 ? "page" : "pages"}
          {sorting.length > 0 && (
            <>
              {" · sorted by "}
              {sorting.map((s) => `${HEADERS[s.id]} ${s.desc ? "↓" : "↑"}`).join(", then ")}
            </>
          )}
        </Muted>
        {(sorting.length !== 1 || sorting[0].id !== "publishedAt" || !sorting[0].desc) && (
          <button type="button" className={styles.reset} onClick={() => setSorting(NEWEST)}>
            <X aria-hidden="true" className={styles.resetIcon} />
            Newest first
          </button>
        )}
      </div>

      <Table className={styles.table}>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => {
                const id = header.column.id;
                const sorted = header.column.getIsSorted();
                const index = header.column.getSortIndex();
                const className = cn(
                  id === "description" && styles.descriptionHead,
                  (id === "project" || id === "section") && styles.fit,
                  (id === "publishedAt" || id === "updatedAt") && styles.date,
                  id === "publishedAt" && byChanged && styles.wideDate,
                  id === "updatedAt" && !byChanged && styles.wideDate,
                );
                if (!header.column.getCanSort())
                  return (
                    <TableHead key={header.id} className={className}>
                      {HEADERS[id]}
                    </TableHead>
                  );
                const Arrow = sorted === "asc" ? ArrowUp : ArrowDown;
                return (
                  <TableHead
                    key={header.id}
                    className={className}
                    aria-sort={sorted ? (sorted === "asc" ? "ascending" : "descending") : undefined}
                  >
                    <button
                      type="button"
                      className={cn(styles.sortButton, sorted && styles.sortActive)}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {HEADERS[id]}
                      {sorted && <Arrow aria-hidden="true" className={styles.arrow} />}
                      {sorted && sorting.length > 1 && <span className={styles.sortIndex}>{index + 1}</span>}
                    </button>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {visible.map((row) => {
            const page = row.original;
            return (
              <TableRow key={row.id}>
                <TableCell className={styles.pageCell}>
                  <NextLink href={page.path} className={styles.title}>
                    {page.code && <CodeXml aria-label="Code page" className={styles.glyph} />}
                    {page.title}
                  </NextLink>
                  <Muted className={styles.narrowMeta}>
                    {page.project} · {page.section}
                  </Muted>
                </TableCell>
                <TableCell className={styles.description} title={page.description ?? undefined}>
                  {page.description}
                </TableCell>
                <TableCell className={styles.fit}>
                  <button type="button" className={styles.quiet} onClick={() => setFilter("project", page.project)}>
                    {page.project}
                  </button>
                </TableCell>
                <TableCell className={styles.fit}>
                  <button type="button" className={styles.quiet} onClick={() => setFilter("section", page.section)}>
                    {page.section}
                  </button>
                </TableCell>
                <TableCell className={cn(styles.date, byChanged && styles.wideDate)}>{dateOf(page.publishedAt)}</TableCell>
                <TableCell className={cn(styles.date, !byChanged && styles.wideDate)}>{dateOf(page.updatedAt)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
