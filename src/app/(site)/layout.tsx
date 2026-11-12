import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import styles from "./layout.module.css";

/** The site's chrome: header and page frame, then the footer. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
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
