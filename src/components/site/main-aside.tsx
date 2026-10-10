import NextLink from "next/link";
import { Paragraph } from "@/components/typography";
import { Aside } from "./aside";
import { AsideSection } from "./aside-section";
import styles from "./main-aside.module.css";

/** Default side column: About + Elsewhere links. */
export function MainAside() {
  return (
    <Aside>
      <AsideSection title="About">
        <Paragraph className={styles.text}>
          I&apos;m Jay, a self-taught software developer. This is where I build things and
          write about them.
        </Paragraph>
      </AsideSection>

      <AsideSection title="Elsewhere">
        <ul className={styles.list}>
          <li>
            <NextLink href="https://github.com/jaygriffinjay" className={styles.link}>
              GitHub
            </NextLink>
          </li>
          <li>
            <NextLink href="https://linkedin.com/in/jaygriffinjay" className={styles.link}>
              LinkedIn
            </NextLink>
          </li>
        </ul>
      </AsideSection>
    </Aside>
  );
}
