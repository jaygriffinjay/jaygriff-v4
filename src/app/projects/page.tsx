// goatboat: 0322d4be-659c-4b3f-b219-b8d2e754134f
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { H2, Lead, Paragraph } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { listProjects, type Project } from "@/lib/goatboat";
import { isVisible } from "@/lib/page-meta";
import styles from "./page.module.css";

/** My projects, in the order set in goatboat. Drafts show only in local dev. */
export default async function ProjectsPage() {
  const projects = (await listProjects()).filter(isVisible);

  return (
    <PageLayout hideRelated>
      <PageHeader />
      {projects.length ? (
        <ul className={styles.list}>
          {projects.map((project) => (
            <ProjectEntry key={project.id} project={project} />
          ))}
        </ul>
      ) : (
        <Lead className={styles.empty}>Nothing here yet.</Lead>
      )}
    </PageLayout>
  );
}

function ProjectEntry({ project }: { project: Project }) {
  const links = [
    { label: "Repo", href: project.repoUrl },
    { label: "Demo", href: project.demoUrl },
    { label: "Video", href: project.videoUrl },
  ].filter((link): link is { label: string; href: string } => !!link.href);

  return (
    <li className={styles.item}>
      <H2 className={styles.name}>{project.title}</H2>
      {project.tagline && <Lead>{project.tagline}</Lead>}
      {project.description && <Paragraph>{project.description}</Paragraph>}

      {(links.length > 0 || project.tags?.length) && (
        <div className={styles.meta}>
          {links.map((link) => (
            <a key={link.label} href={link.href} className={styles.link}>
              {link.label}
              <ExternalLink aria-hidden="true" className={styles.linkIcon} />
            </a>
          ))}
          {project.tags?.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </li>
  );
}
