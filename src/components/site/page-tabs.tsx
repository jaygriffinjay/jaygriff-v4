"use client";

import { useState, useSyncExternalStore } from "react";
import { PageBody } from "@/components/layout/PageBody";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import styles from "./page-tabs.module.css";

export interface PageTab {
  /** Used in the URL hash (#id) to link to this tab, so keep it short and URL-safe. */
  id: string;
  label: string;
  children: React.ReactNode;
}

const subscribeToHash = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};
const readHash = () => window.location.hash.slice(1);
const serverHash = () => "";

/**
 * Several views of one topic on a page. Every panel is in the HTML, so crawlers and find-in-page see them all, and
 * the chosen tab is kept in the URL hash, so a tab can be linked to.
 */
export function PageTabs({ tabs, className }: { tabs: PageTab[]; className?: string }) {
  const hash = useSyncExternalStore(subscribeToHash, readHash, serverHash);
  const [picked, setPicked] = useState<string | null>(null);

  const ids = tabs.map((tab) => tab.id);
  // The hash wins so a pasted link or back button works; unknown hashes (heading anchors) are ignored
  const active = [hash, picked].find((id) => id && ids.includes(id)) ?? ids[0];

  const pick = (id: string) => {
    window.history.replaceState(null, "", `#${id}`);
    setPicked(id);
  };

  return (
    <Tabs value={active} onValueChange={(value) => pick(String(value))} className={className}>
      <TabsList variant="line">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} keepMounted className={styles.panel}>
          <PageBody>{tab.children}</PageBody>
        </TabsContent>
      ))}
    </Tabs>
  );
}
