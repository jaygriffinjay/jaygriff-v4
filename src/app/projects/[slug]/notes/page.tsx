import NextLink from "next/link";
import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { H2, Lead, Muted, Title } from "@/components/typography";
import { PageLayout } from "@/components/site/page-layout";
import { getContentByPath, getDocsNav, listProjects } from "@/lib/goatboat";
import { isVisible } from "@/lib/page-meta";
import styles from "./page.module.css";

type Props = { params: Promise<{ slug: string }> };

/** A project's docs home: its README, then every section and its pages. */
export default async function ProjectDocsPage({ params }: Props) {
  const { slug } = await params;
  const [project, nav] = await Promise.all([
    listProjects().then((all) => all.find((p) => p.slug === slug)),
    getDocsNav(slug),
  ]);
  if (!project || !isVisible(project)) notFound();

  const sections = nav?.sections ?? [];
  const readmePath = sections.find((s) => s.slug === "readme")?.pages[0]?.path;
  const readme = readmePath ? await getContentByPath(readmePath) : null;
  const readmeBody = readme && !("redirectTo" in readme) ? readme.item.body : null;

  return (
    <PageLayout hideRelated hideToc>
      <Title>{project.title} docs</Title>
      {project.tagline && <Lead>{project.tagline}</Lead>}
      {readmeBody && (
        <div className={styles.readme}>
          <MarkdownRenderer source={readmeBody} />
        </div>
      )}
      {sections.length ? (
        sections.map((section) => (
          <section key={section.slug} className={styles.section}>
            <H2>{section.title}</H2>
            <ul className={styles.pages}>
              {section.pages.map((page) => (
                <li key={page.path}>
                  <NextLink href={page.path} className={styles.link}>
                    {page.title}
                  </NextLink>
                  {page.description && <Muted className={styles.description}>{page.description}</Muted>}
                </li>
              ))}
            </ul>
          </section>
        ))
      ) : (
        <Lead>No docs yet.</Lead>
      )}
    </PageLayout>
  );
}
