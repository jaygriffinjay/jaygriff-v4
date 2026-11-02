import { Fragment } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CodeBlock } from "@/components/code-block/CodeBlock";
import { H1, H2, InlineCode, Paragraph } from "@/components/typography";
import { PageLayout } from "@/components/site/page-layout";
import { getContentByPath } from "@/lib/goatboat";
import { isVisible } from "@/lib/page-meta";
import { cn } from "@/lib/utils";
import { TagLinks } from "../../_components/tag-links";
import styles from "./page.module.css";

const BASE = "/projects/goatboat/notes/content";

const formatDate = (iso: string | null) => (iso ? format(new Date(iso), "MMM d, yyyy") : "—");

export default async function ContentPage({ params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const result = await getContentByPath(`/${path.join("/")}`);
  if (!result) notFound();
  if ("redirectTo" in result) permanentRedirect(BASE + result.redirectTo);

  const { item, breadcrumbs } = result;
  if (!isVisible(item)) notFound();
  const children = result.children.filter(isVisible);
  const hero = item.assets.find((a) => a.role === "hero");
  const gallery = item.assets.filter((a) => a.role === "gallery");

  return (
    <PageLayout>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<NextLink href="/projects/goatboat/notes/tree" />}>Tree</BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbs.map((crumb, i) => (
            <Fragment key={crumb.id}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {i === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<NextLink href={BASE + crumb.path} />}>{crumb.title}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className={styles.badges}>
        <Badge>{item.type}</Badge>
        <Badge variant="outline">{item.status}</Badge>
        <Badge variant="outline">{item.format}</Badge>
        <Badge variant="outline">{item.authorship}</Badge>
      </div>

      <H1 className={styles.title}>{item.title}</H1>
      {item.description && <Paragraph className={styles.description}>{item.description}</Paragraph>}

      <dl className={styles.facts}>
        <dt>Path</dt>
        <dd>
          <InlineCode>{item.path}</InlineCode>
        </dd>
        <dt>Published</dt>
        <dd>{formatDate(item.publishedAt)}</dd>
        <dt>Revised</dt>
        <dd>{formatDate(item.revisedAt)}</dd>
        <dt>Project</dt>
        <dd>{item.project ? item.project.title : "—"}</dd>
        <dt>Tags</dt>
        <dd>{item.tags?.length ? <TagLinks tags={item.tags} /> : "—"}</dd>
      </dl>

      {item.link && (
        <div className={styles.linkBox}>
          <a href={item.link.targetUrl} className={styles.target}>
            {item.link.targetTitle ?? item.link.targetUrl} ↗
          </a>
          {item.link.viaName && (
            <Paragraph className={styles.via}>
              via{" "}
              {item.link.viaUrl ? (
                <a href={item.link.viaUrl} className={styles.viaLink}>
                  {item.link.viaName}
                </a>
              ) : (
                item.link.viaName
              )}
            </Paragraph>
          )}
        </div>
      )}

      {hero && (
        <Image
          src={hero.url}
          alt={hero.alt ?? ""}
          width={hero.width ?? 1600}
          height={hero.height ?? 1000}
          unoptimized
          className={styles.hero}
        />
      )}

      {gallery.length > 0 && (
        <div className={styles.gallery}>
          {gallery.map((asset) => (
            <Image
              key={asset.id}
              src={asset.url}
              alt={asset.alt ?? ""}
              width={asset.width ?? 1200}
              height={asset.height ?? 800}
              unoptimized
              className={styles.galleryImage}
            />
          ))}
        </div>
      )}

      {children.length > 0 && (
        <>
          <H2 className={styles.section}>Children</H2>
          <ul className={styles.children}>
            {children.map((child) => (
              <li key={child.id} className={styles.child}>
                <NextLink href={BASE + child.path} className={styles.childLink}>
                  {child.title}
                </NextLink>
                <Badge variant="outline">{child.type}</Badge>
                {child.status !== "published" && <Badge variant="outline">{child.status}</Badge>}
              </li>
            ))}
          </ul>
        </>
      )}

      {item.toc && (
        <>
          <H2 className={styles.section}>On this page</H2>
          <Paragraph className={styles.note}>
            Stored <InlineCode>toc</InlineCode>, derived from the body&apos;s headings on save. The body below
            isn&apos;t rendered yet, so these show the anchor ids rather than linking to them.
          </Paragraph>
          <ul className={styles.toc}>
            {item.toc.map((entry) => (
              <li key={entry.id} className={cn(styles.tocEntry, entry.depth > 2 && styles.tocNested)}>
                {entry.text} <InlineCode>#{entry.id}</InlineCode>
              </li>
            ))}
          </ul>
        </>
      )}

      <H2 className={styles.section}>Body</H2>
      {item.format === "component" ? (
        <Paragraph className={styles.note}>
          Rendered by the component registered as <InlineCode>{item.componentKey}</InlineCode>. The registry
          isn&apos;t built yet.
        </Paragraph>
      ) : item.body ? (
        <CodeBlock code={item.body} language={item.format === "mdx" ? "mdx" : "markdown"} filename={`body.${item.format}`} />
      ) : (
        <Paragraph className={styles.note}>No body.</Paragraph>
      )}

      <H2 className={styles.section}>Raw row</H2>
      <CodeBlock code={JSON.stringify(item, null, 2)} language="json" filename={`${item.slug}.json`} />
    </PageLayout>
  );
}
