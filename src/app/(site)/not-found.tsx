import { Lead, Title } from "@/components/typography";
import { BackButton } from "@/components/site/back-button";
import { PageLayout } from "@/components/site/page-layout";
import styles from "./not-found.module.css";

// Next reuses this page for every client-side 404, so nothing here may depend on the current URL
export default function NotFound() {
  return (
    <PageLayout outsideTree>
      <article className={styles.article}>
        <Title>Nothing here</Title>
        <Lead className={styles.message}>
          This page doesn't work, doesn't exist, or wandered off somewhere.
        </Lead>
        <BackButton />
      </article>
    </PageLayout>
  );
}
