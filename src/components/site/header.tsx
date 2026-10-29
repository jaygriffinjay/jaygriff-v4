import NextLink from "next/link";
import { cn } from "@/lib/utils";
import { SiteFooter } from "./footer";
import { MobileMenu } from "./mobile-menu";
import styles from "./header.module.css";

interface SiteHeaderProps {
  className?: string;
}

export function SiteHeader({ className }: SiteHeaderProps) {
  return (
    <header className={cn(styles.header, className)}>
      <div className={styles.titleRow}>
        <NextLink href="/" className={styles.title}>
          Jay Griffin
        </NextLink>
        <MobileMenu footer={<SiteFooter />} />
      </div>
    </header>
  );
}
