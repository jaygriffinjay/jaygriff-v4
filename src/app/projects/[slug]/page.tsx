import NextLink from "next/link";
import { notFound } from "next/navigation";
import { Lead, Paragraph, Title } from "@/components/typography";
import { PageLayout } from "@/components/site/page-layout";
import { getNotesNav, listProjects } from "@/lib/goatboat";
import { isVisible } from "@/lib/page-meta";
import styles from "./page.module.css";

type Props = { params: Promise<{ slug: string }> };

/** A project's home: what it is, and the way into its notes. */
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = (await listProjects()).find((p) => p.slug === slug);
  if (!project || !isVisible(project)) notFound();
  const hasNotes = !!(await getNotesNav(slug))?.sections.length;

  return (
    <PageLayout hideRelated hideToc>
      <Title>{project.title}</Title>
      {project.tagline && <Lead>{project.tagline}</Lead>}
      {project.description && <Paragraph>{project.description}</Paragraph>}
      {hasNotes && (
        <Paragraph>
          <NextLink href={`/projects/${slug}/notes`} className={styles.link}>
            Read the notes →
          </NextLink>
        </Paragraph>
      )}
    </PageLayout>
  );
}
