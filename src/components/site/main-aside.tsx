import NextLink from "next/link";
import { Muted } from "@/components/typography";
import { Aside } from "./aside";
import { AsideSection } from "./aside-section";
import styles from "./main-aside.module.css";

/** Default side column: About + Elsewhere links. */
export function MainAside() {
  return (
    <Aside>
      <AsideSection title="About">
        <Muted>
          I'm Jay, a self-taught software developer. This is where I build things and
          write about them.
        </Muted>
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
