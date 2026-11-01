import NextLink from "next/link";
import { CapsLabel } from "@/components/typography";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import styles from "./footer.module.css";

interface FooterLink {
  label: string;
  href: string;
}

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Read Stuff",
    links: [
      { label: "Posts", href: "/posts" },
      { label: "Thoughts", href: "/thoughts" },
      { label: "Designs", href: "/designs" },
    ],
  },
  {
    title: "My Work",
    links: [
      { label: "Projects", href: "/projects" },
      { label: "My Stack", href: "/my-stack" },
      { label: "Resume", href: "/resume" },
    ],
  },
  {
    title: "Elsewhere",
    links: [
      { label: "GitHub", href: "https://github.com/jaygriffinjay" },
      { label: "LinkedIn", href: "https://linkedin.com/in/jaygriffinjay" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Other Stuff",
    links: [
      { label: "License", href: "/license" },
      { label: "Source", href: "https://github.com/jaygriffinjay/jaygriff-v4" },
    ],
  },
];

interface SiteFooterProps {
  className?: string;
}

export function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer className={cn(styles.footer, className)}>
      <div className={styles.inner}>
        <NextLink href="/" className={styles.brand} aria-label="Jay Griffin, home">
          <Logo className={styles.logo} />
        </NextLink>

        <div className={styles.columns}>
          {columns.map((column) => (
            <nav key={column.title} className={styles.column} aria-label={column.title}>
              <CapsLabel className={styles.columnTitle}>
                {column.title}
              </CapsLabel>
              {column.links.map(({ label, href }) =>
                href.startsWith("/") ? (
                  <NextLink key={href} href={href} className={styles.link}>
                    {label}
                  </NextLink>
                ) : (
                  <a
                    key={href}
                    href={href}
                    className={styles.link}
                    target="_blank"
                    rel="noopener noreferrer me"
                  >
                    {label}
                  </a>
                ),
              )}
            </nav>
          ))}
        </div>
      </div>
    </footer>
  );
}
