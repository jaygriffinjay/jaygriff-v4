import { H1, H2, Paragraph } from "@/components/typography";
import { Feed } from "@/components/site/feed";
import { PageLayout } from "@/components/site/page-layout";
import { MainAside } from "@/components/site/main-aside";
import { StepLink, StepLinks } from "@/components/site/step-links";
import { listContent } from "@/lib/goatboat";
import styles from "./page.module.css";

const LATEST = 10;

export default async function Home() {
  // The feed is an extra, so the intro still shows if goatboat is down
  const latest = await listContent({ limit: LATEST }).catch((err) => {
    console.error(err);
    return [];
  });

  return (
    <PageLayout aside={<MainAside />} hideRelated>
      <article className={styles.article}>
        <H1 className={styles.title}>Hi, I&apos;m Jay</H1>
        <Paragraph>
          Welcome to my website where I do my work and publish it too! On here I document my development work, share my thoughts, and maybe even post some personal stuff.
        </Paragraph>
      </article>
      {latest.length > 0 && (
        <section aria-labelledby="latest-heading" className={styles.latest}>
          <H2 id="latest-heading">Latest</H2>
          <Feed items={latest} />
          <StepLinks className={styles.more}>
            <StepLink direction="next" href="/new" label="The full feed" title="Everything new →" />
          </StepLinks>
        </section>
      )}
    </PageLayout>
  );
}
