"use client";

import { useSyncExternalStore } from "react";
import { PageBody } from "@/components/layout/PageBody";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import styles from "./page-tabs.module.css";

export interface PageTab {
  /** Used in the URL hash (#id) to link to this tab, so keep it short and URL-safe. */
  id: string;
  label: string;
  children: React.ReactNode;
}

// replaceState fires no event, so a tab click announces its own; back and forward onto a replaceState entry can fire popstate without hashchange
const TAB_PICKED = "pagetabs:picked";
const subscribeToHash = (onChange: () => void) => {
  const events = ["hashchange", "popstate", TAB_PICKED];
  events.forEach((name) => window.addEventListener(name, onChange));
  return () => events.forEach((name) => window.removeEventListener(name, onChange));
};
const readHash = () => window.location.hash.slice(1);
const serverHash = () => "";

/**
 * Several views of one topic on a page. Every panel is in the HTML, so crawlers and find-in-page see them all, and
 * the chosen tab is kept in the URL hash, so a tab can be linked to.
 */
export function PageTabs({
  tabs,
  className,
  listClassName,
  tabClassName,
}: {
  tabs: PageTab[];
  className?: string;
  listClassName?: string;
  tabClassName?: string;
}) {
  const hash = useSyncExternalStore(subscribeToHash, readHash, serverHash);

  const ids = tabs.map((tab) => tab.id);
  // Unknown hashes (heading anchors) are ignored
  const active = ids.includes(hash) ? hash : ids[0];

  const pick = (id: string) => {
    window.history.replaceState(null, "", `#${id}`);
    window.dispatchEvent(new Event(TAB_PICKED));
  };

  return (
    <Tabs value={active} onValueChange={(value) => pick(String(value))} className={className}>
      <TabsList variant="line" className={listClassName}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} className={tabClassName}>
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
