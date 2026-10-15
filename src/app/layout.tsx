import "./globals.css";
import { fontVariables } from "./fonts";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { MobileMenuProvider } from "@/components/site/mobile-menu";
import { currentPageMetadata } from "@/lib/page-meta";
import styles from "./layout.module.css";

// Every page's <head> comes from its goatboat row, found by the current path
export const generateMetadata = currentPageMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // font variables live on <html> so :root theme vars like --font-mono can resolve them
    <html lang="en" className={fontVariables}>
      <body className={styles.body}>
        <TooltipProvider>
          <MobileMenuProvider>
            <div className={styles.shell}>
              <SiteHeader />
              {children}
            </div>
            <SiteFooter />
          </MobileMenuProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
