"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LayersIcon } from "lucide-react";
import type { NotesNav } from "@/lib/goatboat";
import { NavPanel } from "./nav-panel";
import { NotesList } from "./notes-list";
import styles from "./notes-bar.module.css";

/** Opens a panel with every section and page of the project whose notes you're reading. */
export function NotesBar({ nav }: { nav: NotesNav }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Picking a page lands on it, so close the panel then
  useEffect(() => setOpen(false), [pathname]);

  return (
    <NavPanel
      open={open}
      onOpenChange={setOpen}
      triggerClassName={styles.bar}
      trigger={
        <>
          <LayersIcon aria-hidden="true" className={styles.barIcon} />
          Also in this project
        </>
      }
      eyebrow="Notes"
      title={nav.project.title}
      subtitle={nav.project.tagline}
      closeLabel="Close notes"
    >
      <NotesList nav={nav} />
    </NavPanel>
  );
}
