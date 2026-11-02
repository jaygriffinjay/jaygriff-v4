import { slugifyHeading } from "@/lib/slugify-heading";
import { cn } from "@/lib/utils";
import styles from "./typography.module.css";

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement>;

// Text headings get an anchor id, which the sync's table of contents (scripts/headings.mts) links to
const headingId = ({ id, children }: HeadingProps) =>
  id ?? (typeof children === "string" ? slugifyHeading(children) || undefined : undefined);

/** The page's own title: an h1 at the title size, a step under H1, which is for h1s inside markdown. */
export function Title({ className, ...props }: HeadingProps) {
  return <h1 className={cn(styles.title, className)} {...props} />;
}

/** A page title that is my name, in the site name's Sekuya font. */
export function NameTitle({ className, ...props }: HeadingProps) {
  return <h1 className={cn(styles.nameTitle, className)} {...props} />;
}

export function H1({ className, ...props }: HeadingProps) {
  return <h1 className={cn(styles.h1, className)} {...props} />;
}

export function H2({ className, ...props }: HeadingProps) {
  return <h2 id={headingId(props)} className={cn(styles.h2, className)} {...props} />;
}

export function H3({ className, ...props }: HeadingProps) {
  return <h3 id={headingId(props)} className={cn(styles.h3, className)} {...props} />;
}

export function H4({ className, ...props }: HeadingProps) {
  return <h4 id={headingId(props)} className={cn(styles.h4, className)} {...props} />;
}

export function H5({ className, ...props }: HeadingProps) {
  return <h5 id={headingId(props)} className={cn(styles.h5, className)} {...props} />;
}

export function H6({ className, ...props }: HeadingProps) {
  return <h6 id={headingId(props)} className={cn(styles.h6, className)} {...props} />;
}

export function Paragraph({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn(styles.paragraph, className)} {...props} />;
}

/** Muted paragraph at body size: the intro under a title, a tagline, an empty-state line. */
export function Lead({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn(styles.lead, className)} {...props} />;
}

/** Small muted paragraph: a one-line summary in a list, side-column copy. */
export function Muted({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn(styles.muted, className)} {...props} />;
}

/** Small, bold, all-caps label: side-column headings, footer columns, Previous/Next. Wrap it in an h2 where it heads a section. */
export function CapsLabel({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn(styles.capsLabel, className)} {...props} />;
}

export function Small({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <small className={cn(styles.small, className)} {...props} />;
}

export function Text({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={className} {...props} />;
}

export function Blockquote({
  className,
  ...props
}: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) {
  return <blockquote className={cn(styles.blockquote, className)} {...props} />;
}

interface ListProps extends React.HTMLAttributes<HTMLUListElement | HTMLOListElement> {
  ordered?: boolean;
}

export function List({ ordered, className, ...props }: ListProps) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag
      className={cn(styles.list, ordered ? styles.ordered : styles.unordered, className)}
      {...props}
    />
  );
}

export function ListItem(props: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li {...props} />;
}

export function Bold({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <strong className={cn(styles.bold, className)} {...props} />;
}

export function Italic({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <em className={cn(styles.italic, className)} {...props} />;
}

export function Underline({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn(styles.underline, className)} {...props} />;
}

export function Strikethrough({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <s className={cn(styles.strikethrough, className)} {...props} />;
}

export function Highlight({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <mark className={cn(styles.highlight, className)} {...props} />;
}

export function InlineCode({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <code className={cn(styles.inlineCode, className)} {...props} />;
}
