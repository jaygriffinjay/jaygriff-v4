// goatboat: 327503d7-04e3-43b8-96c0-6c62d2162792
import Image from "next/image";
import NextLink from "next/link";
import { FileTextIcon, GithubIcon, LinkedinIcon, MailIcon, type LucideIcon } from "lucide-react";
import { Title } from "@/components/typography";
import { PageLayout } from "@/components/site/page-layout";
import styles from "./page.module.css";

const links: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "mailto:jay@jaygriff.com", label: "jay@jaygriff.com", icon: MailIcon },
  { href: "/resume", label: "Resume", icon: FileTextIcon },
  { href: "https://github.com/jaygriffinjay", label: "GitHub", icon: GithubIcon },
  { href: "https://linkedin.com/in/jaygriffinjay", label: "LinkedIn", icon: LinkedinIcon },
];

/** Where to reach me: email, resume and profiles, each a big tappable row. */
export default function ContactPage() {
  return (
    <PageLayout hideRelated hideToc>
      <div className={styles.top}>
        <Image src="/images/me2.jpg" alt="Jay Griffin" width={200} height={200} quality={100} priority className={styles.portrait} />
        <Title>Jay Griffin</Title>
      </div>

      <nav className={styles.links} aria-label="Contact links">
        {links.map(({ href, label, icon: Icon }) => {
          const external = href.startsWith("http");
          const content = (
            <>
              <span className={styles.iconSlot} aria-hidden="true">
                <Icon />
              </span>
              <span className={styles.label}>{label}</span>
              <span className={styles.arrow} aria-hidden="true">
                ↗
              </span>
            </>
          );
          return external ? (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={styles.row}>
              {content}
            </a>
          ) : (
            <NextLink key={href} href={href} className={styles.row}>
              {content}
            </NextLink>
          );
        })}
      </nav>
    </PageLayout>
  );
}
