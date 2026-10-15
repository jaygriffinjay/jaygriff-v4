import NextLink from "next/link";
import { Paragraph } from "@/components/typography";
import { cn } from "@/lib/utils";
import { SiteFooter } from "./footer";
import { MobileMenu } from "./mobile-menu";
import styles from "./header.module.css";

const tagline = "Software, writing, and other stuff";

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
        <MobileMenu tagline={tagline} footer={<SiteFooter />} />
      </div>
      <Paragraph className={styles.tagline}>{tagline}</Paragraph>
    </header>
  );
}
