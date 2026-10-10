import { cn } from "@/lib/utils";

interface HighlightProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Highlight({ children, className, ...props }: HighlightProps) {
  return (
    <mark
      className={cn("bg-heading/35 text-foreground rounded-sm px-1", className)}
      {...props}
    >
      {children}
    </mark>
  );
}
