import { ExternalLink } from "lucide-react";
import Image from "next/image";
import NextLink from "next/link";
import { Badge } from "@/components/ui/badge";
import { H2, Lead, Paragraph } from "@/components/typography";
import type { Project } from "@/lib/goatboat";
import styles from "./project-entry.module.css";

const CENTERED = new Set(["jaygriff-v2", "jaygriff-v3", "goatboat"]);

export function ProjectEntry({ project, notes = 0 }: { project: Project; notes?: number }) {
  const links = [
    { label: "Visit", href: project.appHref },
    { label: "Repo", href: project.repoUrl },
    { label: "Demo", href: project.demoUrl !== project.appHref ? project.demoUrl : null },
    { label: "Video", href: project.videoUrl },
  ].filter((link): link is { label: string; href: string } => !!link.href);

  return (
    <li className={styles.item}>
      <NextLink href={`/projects/${project.slug}`} className={styles.thumb} tabIndex={-1} aria-hidden="true">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail.url}
            alt=""
            width={480}
            height={300}
            quality={100}
            sizes="(min-width: 40rem) 12rem, calc(100vw - 2rem)"
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