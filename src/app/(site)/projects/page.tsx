// goatboat: 0322d4be-659c-4b3f-b219-b8d2e754134f
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import NextLink from "next/link";
import { Badge } from "@/components/ui/badge";
import { H2, Lead, Paragraph } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { listNotes, listProjects, type Project } from "@/lib/goatboat";
import { isVisible } from "@/lib/page-meta";
import styles from "./page.module.css";

// Square thumbnails with a logo in the middle: they fill the box from the middle. Every other thumbnail is a screenshot that fills it from the top
const CENTERED = new Set(["jaygriff-v2", "jaygriff-v3", "goatboat"]);

/** My projects, in the order set in goatboat. Drafts show only in local dev. */
export default async function ProjectsPage() {
  const [all, notes] = await Promise.all([listProjects(), listNotes()]);
  const projects = all.filter(isVisible);
  // Counted from the notes themselves, so a note counts whether or not it sits in a section
  const noteCounts = new Map<string, number>();
  for (const note of notes) {
    if (note.project) noteCounts.set(note.project.slug, (noteCounts.get(note.project.slug) ?? 0) + 1);
  }

  return (
    <PageLayout hideRelated>
      <PageHeader />
      {projects.length ? (
        <ul className={styles.list}>
          {projects.map((project) => (
            <ProjectEntry key={project.id} project={project} notes={noteCounts.get(project.slug) ?? 0} />
          ))}
        </ul>
      ) : (
        <Lead className={styles.empty}>Nothing here yet.</Lead>
      )}
    </PageLayout>
  );
}

function ProjectEntry({ project, notes }: { project: Project; notes: number }) {
  const links = [
    { label: "Visit", href: project.appHref },
    { label: "Repo", href: project.repoUrl },
    { label: "Demo", href: project.demoUrl !== project.appHref ? project.demoUrl : null },
    { label: "Video", href: project.videoUrl },
  ].filter((link): link is { label: string; href: string } => !!link.href);

  return (
    <li className={styles.item}>
      {/* The title already links to the project, so this link stays out of the tab order */}
      <NextLink href={`/projects/${project.slug}`} className={styles.thumb} tabIndex={-1} aria-hidden="true">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail.url}
            alt=""
            width={480}
            height={300}
            quality={100}
            sizes="(min-width: 40rem) 12rem, calc(100vw - 2rem)"
            // The image optimizer won't serve an svg
            unoptimized={project.thumbnail.url.endsWith(".svg")}
            data-centered={CENTERED.has(project.slug)}
            className={styles.image}
          />
        ) : (
          <span className={styles.noImage} />
        )}
      </NextLink>
      <div className={styles.body}>
        <H2 className={styles.name}>
          <NextLink href={`/projects/${project.slug}`} className={styles.nameLink}>
            {project.title}
          </NextLink>
        </H2>
        {project.tagline && <Lead>{project.tagline}</Lead>}
        {project.description && <Paragraph>{project.description}</Paragraph>}

        {(links.length > 0 || notes > 0 || project.tags?.length) && (
          <div className={styles.meta}>
            {links.map((link) =>
              link.href.startsWith("/") ? (
                <NextLink key={link.label} href={link.href} className={styles.link}>
                  {link.label}
                </NextLink>
              ) : (
                <a key={link.label} href={link.href} className={styles.link}>
                  {link.label}
                  <ExternalLink aria-hidden="true" className={styles.linkIcon} />
                </a>
              ),
            )}
            {notes > 0 && (
              <NextLink href={`/projects/${project.slug}/notes`} className={styles.link}>
                Notes ({notes})
              </NextLink>
            )}
            {project.tags?.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}
