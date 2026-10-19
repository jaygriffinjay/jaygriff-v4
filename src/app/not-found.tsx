import { H1, Paragraph } from "@/components/typography";
import { BackButton } from "@/components/site/back-button";
import { PageLayout } from "@/components/site/page-layout";
import styles from "./not-found.module.css";

// Next reuses this page for every client-side 404, so nothing here may depend on the current URL
export default function NotFound() {
  return (
    <PageLayout outsideTree>
      <article className={styles.article}>
        <H1 className={styles.title}>Nothing here</H1>
        <Paragraph className={styles.message}>
          This page doesn&apos;t work, doesn&apos;t exist, or wandered off somewhere.
        </Paragraph>
        <BackButton />
      </article>
    </PageLayout>
  );
}
