import NextLink from "next/link";
import { Muted, Title } from "@/components/typography";
import { Aside } from "./aside";
import { AsideSection } from "./aside-section";
import styles from "./main-aside.module.css";

/** The homepage side column points to the full feed. */
export function MainAside() {
  return (
    <Aside>
      <section className={styles.introduction} aria-labelledby="introduction-title">
        <Title id="introduction-title" className={styles.introTitle}>
          Hi, I'm Jay
        </Title>
        <Muted className={styles.introCopy}>
          Welcome to my website where I do my work and publish it too! On here I document my development work, share my thoughts, and maybe even post some personal stuff.
        </Muted>
      </section>
      <AsideSection title="Everything New">
        <NextLink href="/new" className={styles.feedLink}>
          Browse the full feed
        </NextLink>
      </AsideSection>
      <AsideSection title="Explore">
        <div className={styles.exploreLinks}>
          <NextLink href="/about" className={styles.feedLink}>
            About
          </NextLink>
          <NextLink href="/notes" className={styles.feedLink}>
            Notes
          </NextLink>
        </div>
      </AsideSection>
    </Aside>
  );
}
