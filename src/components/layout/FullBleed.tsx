import { cn } from "@/lib/utils";
import styles from "./FullBleed.module.css";

/** Lets part of a page run the full width of the window, out of the page frame and its padding, while the site's header, nav and footer keep the frame. Put it inside the page's content; the frame it leaves must be centered in the window, as it is on every page without a side column. */
export function FullBleed({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn(styles.bleed, className)}>{children}</div>;
}
