import { cn } from "@/lib/utils";
import styles from "./aside.module.css";

interface AsideProps {
  children: React.ReactNode;
  className?: string;
}

/** Wrapper for a page's side column; pass to `<PageLayout aside={...}>`. */
export function Aside({ children, className }: AsideProps) {
  return <aside className={cn(styles.aside, className)}>{children}</aside>;
}
