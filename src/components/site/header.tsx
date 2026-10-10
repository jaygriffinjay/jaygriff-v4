import NextLink from "next/link";
import { Paragraph } from "@/components/typography";
import { cn } from "@/lib/utils";
import styles from "./header.module.css";

interface SiteHeaderProps {
  className?: string;
}

export function SiteHeader({ className }: SiteHeaderProps) {
  return (
    <header className={cn(styles.header, className)}>
      <NextLink href="/" className={styles.title}>
        Jay Griffin
      </NextLink>
      <Paragraph className={styles.tagline}>Software, writing, and other stuff</Paragraph>
    </header>
  );
}
