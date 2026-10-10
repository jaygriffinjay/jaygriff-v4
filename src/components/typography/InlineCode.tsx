import { cn } from "@/lib/utils";
import styles from "./InlineCode.module.css";

interface InlineCodeProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function InlineCode({ children, className, ...props }: InlineCodeProps) {
  return (
    <code className={cn(styles.code, className)} {...props}>
      {children}
    </code>
  );
}
