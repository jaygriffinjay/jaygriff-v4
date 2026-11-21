import NextLink from "next/link";
import { SiteFooter } from "./footer";
import { MobileMenu } from "./mobile-menu";
import headerStyles from "./header.module.css";
import styles from "./fullscreenpages-chrome.module.css";

/** The chrome for full-screen pages (the (fullscreenpages) group): a slim bar with the name at the far left and the menu at the far right, then the page with no frame round it, then the footer. */
export function FullscreenPagesChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className={styles.bar}>
        <NextLink href="/" className={headerStyles.title}>
          Jay Griffin
        </NextLink>
        <MobileMenu always footer={<SiteFooter />} />
      </header>
      <main className={styles.main}>{children}</main>
      <SiteFooter />
    </>
  );
}
