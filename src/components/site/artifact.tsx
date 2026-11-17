import { cn } from "@/lib/utils";
import styles from "./artifact.module.css";

const sizes = { sm: styles.sm, md: styles.md, lg: styles.lg, fill: styles.fill };

/** An HTML artifact shown in a frame inside a page. */
export function Artifact({
  src,
  title,
  size = "md",
  height,
  className,
}: {
  /** The full URL of the artifact's HTML file, where it's hosted. */
  src: string;
  /** What the frame is, for screen readers. */
  title: string;
  size?: keyof typeof sizes;
  /** The frame's height in pixels at the page's full content width, measured ahead of time. Replaces `size`, except `fill`. */
  height?: number | null;
  className?: string;
}) {
  const sized = size !== "fill" && !!height;

  return (
    <iframe
      src={src}
      title={title}
      // Scripts run, but with no origin: no cookies or storage, no top-level navigation, no popups or forms
      sandbox="allow-scripts allow-downloads allow-pointer-lock"
      allowFullScreen
      referrerPolicy="no-referrer"
      loading="lazy"
      height={sized ? (height ?? undefined) : undefined}
      className={cn(styles.frame, !sized && sizes[size], className)}
    />
  );
}
