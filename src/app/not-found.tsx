import NextLink from "next/link";
import { ArrowLeft } from "lucide-react";
import { H1, Paragraph } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/site/page-layout";
import { MainAside } from "@/components/site/main-aside";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <PageLayout aside={<MainAside />}>
      <article className={styles.article}>
        <H1 className={styles.title}>Page not found</H1>
        <Paragraph>That page doesn&apos;t exist, or it moved.</Paragraph>
        <Button nativeButton={false} render={<NextLink href="/" />}>
          <ArrowLeft data-icon="inline-start" />
          Back to home
        </Button>
      </article>
    </PageLayout>
  );
}
