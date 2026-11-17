import { cn } from "@/lib/utils";
import styles from "./artifact.module.css";

const sizes = { sm: styles.sm, md: styles.md, lg: styles.lg };

/** An HTML artifact shown in a frame inside a page. */
export function Artifact({
  src,
  title,
  size = "md",
  className,
}: {
  /** The full URL of the artifact's HTML file, where it's hosted. */
  src: string;
  /** What the frame is, for screen readers. */
  title: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <iframe
      src={src}
      title={title}
      // Scripts run, but with no origin: no cookies or storage, no top-level navigation, no popups or forms
      sandbox="allow-scripts"
      referrerPolicy="no-referrer"
      loading="lazy"
      className={cn(styles.frame, sizes[size], className)}
    />
  );
}
