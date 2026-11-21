import NextLink from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Lead, Paragraph, Title } from "@/components/typography";
import { PageLayout } from "@/components/site/page-layout";
import { getContentByPath, getNotesNav, listProjects } from "@/lib/goatboat";
import { isVisible } from "@/lib/page-meta";
import styles from "./page.module.css";

type Props = { params: Promise<{ slug: string }> };

/** A project's home: what it is, and the way into its notes. */
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = (await listProjects()).find((p) => p.slug === slug);
  if (!project) {
    // A renamed project's old address redirects to its new one
    const moved = await getContentByPath(`/projects/${slug}`);
    if (moved && "redirectTo" in moved) permanentRedirect(moved.redirectTo);
    notFound();
  }
  if (!isVisible(project)) notFound();
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
