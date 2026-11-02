import NextLink from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { CapsLabel } from "@/components/typography";
import { cn } from "@/lib/utils";
import styles from "./step-links.module.css";

/** A row for a previous and a next StepLink: previous at the left edge, next at the right. */
export function StepLinks({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn(styles.row, className)}>{children}</div>;
}

type StepLinkProps = {
  direction: "prev" | "next";
  href: string;
  /** Small line over the title, e.g. "Previous". */
  label: string;
  /** Where the link goes. */
  title: string;
  rel?: "prev" | "next";
};

/** A link to the previous or next page: a round arrow, the label, and the destination's title. No box. */
export function StepLink({ direction, href, label, title, rel }: StepLinkProps) {
  const Arrow = direction === "prev" ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <NextLink href={href} rel={rel} className={cn(styles.item, styles[direction])}>
      <Arrow aria-hidden="true" strokeWidth={2.5} className={styles.arrow} />
      <span className={styles.text}>
        <CapsLabel className={styles.label}>{label}</CapsLabel>
        <span className={styles.title}>{title}</span>
      </span>
    </NextLink>
  );
}
