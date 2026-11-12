import { SiteHeader } from "./header";
import { SiteFooter } from "./footer";
import styles from "./site-chrome.module.css";

/** The site's header and page frame, then the footer. Shared by the (site) and (notes) layouts. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className={styles.shell}>
        <SiteHeader />
        {children}
      </div>
      <SiteFooter />
    </>
  );
}
