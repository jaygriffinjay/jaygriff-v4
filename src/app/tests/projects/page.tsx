import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { H1, H2, Paragraph } from "@/components/typography";
import { PageLayout } from "@/components/site/page-layout";
import { listProjects } from "@/lib/goatboat";
import styles from "./page.module.css";

export default async function ProjectsTestPage() {
  const projects = await listProjects();

  return (
    <PageLayout>
      <H1 className={styles.title}>Projects</H1>
      <Paragraph className={styles.intro}>
        Every project and experiment in the database, any status. {projects.length} rows.
      </Paragraph>

      <ul className={styles.grid}>
        {projects.map((project) => (
          <li key={project.id} className={styles.card}>
            {project.thumbnail && (
              <Image
                src={project.thumbnail.url}
                alt={project.thumbnail.alt ?? ""}
                width={1200}
                height={630}
                unoptimized
                className={styles.thumbnail}
              />
            )}
            <div className={styles.cardBody}>
              <div className={styles.badges}>
                <Badge>{project.kind}</Badge>
                <Badge variant="outline">{project.status}</Badge>
              </div>
              <H2 className={styles.cardTitle}>{project.title}</H2>
              {project.tagline && <Paragraph className={styles.tagline}>{project.tagline}</Paragraph>}
              <div className={styles.links}>
                {project.appHref && <span className={styles.linkLabel}>{project.appHref}</span>}
                {project.repoUrl && (
                  <a href={project.repoUrl} className={styles.link}>
                    Repo
                  </a>
                )}
                {project.demoUrl && (
                  <a href={project.demoUrl} className={styles.link}>
                    Demo
                  </a>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </PageLayout>
  );
}
