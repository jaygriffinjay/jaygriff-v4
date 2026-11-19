"use client";

import { ListFilter, Search } from "lucide-react";
import { CapsLabel } from "@/components/typography";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import styles from "./notes-controls.module.css";

/** The "no filter" choice */
export const ANY = "*";

/** A project or section to pick, with how many notes it holds. */
export type FilterOption = { name: string; count: number };

type Props = {
  query: string;
  onQuery: (query: string) => void;
  project: string;
  onProject: (project: string) => void;
  projects: FilterOption[];
  section: string;
  onSection: (section: string) => void;
  sections: FilterOption[];
};

/** The search bar, and a filter button that opens a panel of the projects and sections to pick from. */
export function NotesControls({ query, onQuery, project, onProject, projects, section, onSection, sections }: Props) {
  const active = (project !== ANY ? 1 : 0) + (section !== ANY ? 1 : 0);
  const clear = () => {
    onProject(ANY);
    onSection(ANY);
  };

  return (
    <div className={styles.controls}>
      <label className={styles.search}>
        <Search aria-hidden="true" className={styles.searchIcon} />
        <input
          type="search"
          className={styles.input}
          placeholder="Search titles, summaries and tags"
          aria-label="Search titles, summaries and tags"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
        />
      </label>

      <Popover>
        <PopoverTrigger render={<button type="button" className={styles.filterButton} aria-label="Filter by project and section" />}>
          <ListFilter aria-hidden="true" className={styles.filterIcon} data-on={active > 0} />
        </PopoverTrigger>
        <PopoverContent align="end" className={styles.panel}>
          <div className={styles.panelHead}>
            <div className={styles.panelText}>
              <span className={styles.panelTitle}>
                <ListFilter aria-hidden="true" className={styles.panelIcon} />
                Filter notes
              </span>
              <span className={styles.panelHint}>Pick a project or a section to narrow the list.</span>
            </div>
            <button type="button" className={styles.clear} disabled={active === 0} onClick={clear}>
              Clear
            </button>
          </div>
          <div className={styles.scroll}>
            <Group label="Projects" value={project} options={projects} onPick={(name) => onProject(project === name ? ANY : name)} />
            {sections.length > 0 && (
              <Group
                label={project === ANY ? "Sections" : `Sections in ${project}`}
                value={section}
                options={sections}
                onPick={(name) => onSection(section === name ? ANY : name)}
              />
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

/** A heading with a rule and how many choices it has, over a grid of bars, one per project or section; the picked one is lit, and picking it again lets it go. */
function Group({ label, value, options, onPick }: { label: string; value: string; options: FilterOption[]; onPick: (name: string) => void }) {
  return (
    <section className={styles.group}>
      <div className={styles.groupHead}>
        <CapsLabel className={styles.groupLabel}>{label}</CapsLabel>
        <span className={styles.rule} />
        <span className={styles.groupCount}>{options.length}</span>
      </div>
      <div className={styles.options}>
        {options.map((option) => (
          <button
            key={option.name}
            type="button"
            className={styles.option}
            data-picked={option.name === value}
            aria-pressed={option.name === value}
            onClick={() => onPick(option.name)}
          >
            <span className={styles.name}>{option.name}</span>
            <span className={styles.number}>{option.count}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
