import { cn } from "@/lib/utils";
import styles from "./typography.module.css";

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement>;

export function H1({ className, ...props }: HeadingProps) {
  return <h1 className={cn(styles.h1, className)} {...props} />;
}

export function H2({ className, ...props }: HeadingProps) {
  return <h2 className={cn(styles.h2, className)} {...props} />;
}

export function H3({ className, ...props }: HeadingProps) {
  return <h3 className={cn(styles.h3, className)} {...props} />;
}

export function H4({ className, ...props }: HeadingProps) {
  return <h4 className={cn(styles.h4, className)} {...props} />;
}

export function H5({ className, ...props }: HeadingProps) {
  return <h5 className={cn(styles.h5, className)} {...props} />;
}

export function H6({ className, ...props }: HeadingProps) {
  return <h6 className={cn(styles.h6, className)} {...props} />;
}

export function Paragraph({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn(styles.paragraph, className)} {...props} />;
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
