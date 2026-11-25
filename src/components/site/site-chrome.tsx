import { SiteHeader } from "./header";
import { SiteFooter } from "./footer";
import { currentPath } from "@/lib/page-meta";
import styles from "./site-chrome.module.css";

/** The site's header and page frame, then the footer. Shared by the (site) and (notes) layouts. */
export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const showHeader = (await currentPath()) !== "/";

  return (
    <>
      <div className={styles.shell}>
        {showHeader && <SiteHeader />}
        {children}
      </div>
      <SiteFooter />
    </>
  );
}
