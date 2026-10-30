import { cn } from "@/lib/utils";
import styles from "./PageBody.module.css";

/**
 * The standard container for a page's content: sets the space between blocks and around headings,
 * and the scroll offset for jumping to one. Every page gets it from PageLayout, and markdown renders
 * straight into it, so they all follow the same rules. The rules reach direct children only.
 */
export function PageBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn(styles.body, className)}>{children}</div>;
}
