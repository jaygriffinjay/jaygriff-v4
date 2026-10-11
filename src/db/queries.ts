import { and, asc, desc, eq, inArray, ne, sql } from "drizzle-orm";
import { db, type Executor } from "./index";
import { assets, content, contentLinks, projects, redirects, type contentTypes } from "./schema";

export type ContentType = (typeof contentTypes)[number];

/** Published content, newest first. Skips `body` so feeds stay light. Pages only when asked for. */
export async function listContent({
  type,
  tag,
  limit = 100,
}: { type?: ContentType; tag?: string; limit?: number } = {}) {
  const rows = await db
    .select({
      id: content.id,
      slug: content.slug,
      path: content.path,
      type: content.type,
      title: content.title,
      description: content.description,
      publishedAt: content.publishedAt,
      tags: content.tags,
      targetUrl: contentLinks.targetUrl,
      viaName: contentLinks.viaName,
    })
    .from(content)
    .leftJoin(contentLinks, eq(contentLinks.contentId, content.id))
    .where(
      and(
        eq(content.status, "published"),
        type ? eq(content.type, type) : ne(content.type, "page"),
        tag ? sql`exists (select 1 from json_each(${content.tags}) where value = ${tag})` : undefined,
      ),
    )
    .orderBy(desc(content.publishedAt))
    .limit(limit);

  if (!rows.length) return [];

  const covers = await db
    .select({
      contentId: assets.contentId,
      url: assets.url,
      alt: assets.alt,
      width: assets.width,
      height: assets.height,
    })
    .from(assets)
    .where(
      and(
        inArray(assets.contentId, rows.map((r) => r.id)),
        inArray(assets.role, ["thumbnail", "hero"]),
      ),
    );
  const coverFor = new Map(covers.map((c) => [c.contentId, c]));

  return rows.map((row) => ({ ...row, cover: coverFor.get(row.id) ?? null }));
}

export type FeedItem = Awaited<ReturnType<typeof listContent>>[number];

/** Every tag on published content, with how many items use it, most used first. */
export async function listTags() {
  return db.all<{ tag: string; count: number }>(sql`
    select t.value as tag, count(*) as count
    from content, json_each(content.tags) t
    where content.status = 'published' and content.type != 'page'
    group by t.value
    order by count desc, tag
  `);
}

/** Root-first chain from the top of the tree down to (and including) this node. */
export async function getAncestors(id: string, executor: Executor = db) {
  return executor.all<{ id: string; title: string; path: string }>(sql`
    with recursive chain(id, parent_id, title, path, depth) as (
      select id, parent_id, title, path, 0 from content where id = ${id}
      union all
      select c.id, c.parent_id, c.title, c.path, chain.depth + 1
      from content c join chain on c.id = chain.parent_id
    )
    select id, title, path from chain order by depth desc
  `);
}

/** Direct children of a node in sibling order. */
export async function getChildren(parentId: string) {
  return db
    .select({
      id: content.id,
      path: content.path,
      type: content.type,
      status: content.status,
      title: content.title,
      description: content.description,
    })
    .from(content)
    .where(eq(content.parentId, parentId))
    .orderBy(asc(content.sortOrder), asc(content.title));
}

/**
 * One item by path, any status, with its detail row, project, assets, breadcrumbs and children.
 * If the path was moved away from, returns where it lives now instead.
 */
export async function getContentByPath(path: string) {
  const [row] = await db
    .select({
      content,
      link: contentLinks,
      project: { slug: projects.slug, title: projects.title },
    })
    .from(content)
    .leftJoin(contentLinks, eq(contentLinks.contentId, content.id))
    .leftJoin(projects, eq(projects.id, content.projectId))
    .where(eq(content.path, path))
    .limit(1);

  if (!row) {
    const [moved] = await db
      .select({ path: content.path })
      .from(redirects)
      .innerJoin(content, eq(content.id, redirects.contentId))
      .where(eq(redirects.fromPath, path));
    return moved ? { redirectTo: moved.path } : null;
  }

  const [media, breadcrumbs, children] = await Promise.all([
    db
      .select()
      .from(assets)
      .where(eq(assets.contentId, row.content.id))
      .orderBy(asc(assets.role), asc(assets.sortOrder)),
    getAncestors(row.content.id),
    getChildren(row.content.id),
  ]);

  return {
    item: { ...row.content, link: row.link, project: row.project, assets: media },
    breadcrumbs,
    children,
  };
}

/** Every node, for drawing the whole tree. */
export async function listTree() {
  return db
    .select({
      id: content.id,
      parentId: content.parentId,
      path: content.path,
      type: content.type,
      status: content.status,
      title: content.title,
    })
    .from(content)
    .orderBy(asc(content.sortOrder), asc(content.title));
}

/** Every project, any status, in manual sort order, with its thumbnail. */
export async function listProjects() {
  const rows = await db.select().from(projects).orderBy(asc(projects.sortOrder));

  const thumbs = await db
    .select({ projectId: assets.projectId, url: assets.url, alt: assets.alt })
    .from(assets)
    .where(and(inArray(assets.projectId, rows.map((r) => r.id)), eq(assets.role, "thumbnail")));
  const thumbFor = new Map(thumbs.map((t) => [t.projectId, t]));

  return rows.map((row) => ({ ...row, thumbnail: thumbFor.get(row.id) ?? null }));
}
