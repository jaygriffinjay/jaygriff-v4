import { H1, Paragraph } from "@/components/typography";
import { PageLayout } from "@/components/site/page-layout";
import { MainAside } from "@/components/site/main-aside";
import styles from "./page.module.css";

export default function Home() {
  return (
    <PageLayout aside={<MainAside />}>
      <article className={styles.article}>
        <H1 className={styles.title}>Hi, I&apos;m Jay</H1>
        <Paragraph>
          Welcome to my website, where I do my work and publish it too. I document my
          development work, share my thoughts, and maybe even post some personal stuff.
        </Paragraph>
      </article>
    </PageLayout>
  );
}
