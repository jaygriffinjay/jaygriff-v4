import { SiteChrome } from "@/components/site/site-chrome";

// The same chrome as (site) for now; notes pages get their own layout later
export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
