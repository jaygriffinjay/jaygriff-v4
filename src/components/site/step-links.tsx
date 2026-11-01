import NextLink from "next/link";
import { CapsLabel } from "@/components/typography";
import { cn } from "@/lib/utils";
import styles from "./step-links.module.css";

/** Two columns for a previous and a next StepLink. */
export function StepLinks({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn(styles.grid, className)}>{children}</div>;
}

type StepLinkProps = {
  direction: "prev" | "next";
  href: string;
  /** Small caps line, e.g. "← Previous". */
  label: string;
  /** Where the link goes, in link blue. */
  title: string;
  rel?: "prev" | "next";
};

/** A bordered box linking to the previous or next page. */
export function StepLink({ direction, href, label, title, rel }: StepLinkProps) {
  return (
    <NextLink href={href} rel={rel} className={cn(styles.item, styles[direction])}>
      <CapsLabel>{label}</CapsLabel>
      <span className={styles.title}>{title}</span>
    </NextLink>
  );
}
