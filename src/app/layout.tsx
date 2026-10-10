import "./globals.css";
import { fontVariables } from "./fonts";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import styles from "./layout.module.css";

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
          <div className={styles.shell}>
            <SiteHeader />
            {children}
          </div>
          <SiteFooter />
        </TooltipProvider>
      </body>
    </html>
  );
}
