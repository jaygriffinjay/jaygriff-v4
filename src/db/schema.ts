import { sql } from "drizzle-orm";
import {
  type AnySQLiteColumn,
  check,
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const contentTypes = ["page", "post", "link", "image"] as const;
export const statuses = ["draft", "published", "private"] as const;
export const authorships = ["human", "ai-assisted", "ai-generated"] as const;
export const formats = ["md", "mdx", "component"] as const;
export const projectKinds = ["experiment", "project"] as const;
export const assetKinds = ["image", "video"] as const;
export const assetRoles = ["thumbnail", "hero", "logo", "gallery"] as const;

export type TocEntry = { depth: number; text: string; id: string };

// ISO-8601 UTC, sortable as text
const now = sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`;

const id = () =>
  text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());

const timestamps = {
  createdAt: text("created_at").notNull().default(now),
  updatedAt: text("updated_at")
    .notNull()
    .default(now)
    .$onUpdateFn(() => new Date().toISOString()),
};

const inList = (column: string, values: readonly string[]) =>
  sql.raw(`${column} in (${values.map((v) => `'${v}'`).join(", ")})`);

export const projects = sqliteTable(
  "projects",
  {
    id: id(),
    slug: text().notNull().unique(),
    title: text().notNull(),
    tagline: text(),
    description: text(),
    kind: text({ enum: projectKinds }).notNull().default("project"),
    status: text({ enum: statuses }).notNull().default("draft"),
    icon: text(), // lucide icon name; fallback when there is no logo asset
    appHref: text("app_href"),
    repoUrl: text("repo_url"),
    demoUrl: text("demo_url"),
    videoUrl: text("video_url"),
    tags: text({ mode: "json" }).$type<string[]>(),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  () => [
    check("projects_kind", inList("kind", projectKinds)),
    check("projects_status", inList("status", statuses)),
  ],
);

export const content = sqliteTable(
  "content",
  {
    id: id(),
    // No cascade: a node with children can't be deleted. No action (not restrict) so one statement can delete a whole subtree
    parentId: text("parent_id").references((): AnySQLiteColumn => content.id),
    slug: text().notNull(),
    path: text().notNull().unique(), // derived: parent path + "/" + slug
    type: text({ enum: contentTypes }).notNull(),
    status: text({ enum: statuses }).notNull().default("draft"),
    title: text().notNull(),
    description: text(),
    body: text(), // markdown / MDX
    toc: text({ mode: "json" }).$type<TocEntry[]>(), // derived from body headings
    format: text({ enum: formats }).notNull().default("md"),
    componentKey: text("component_key"), // registry key; set when format = 'component'
    contentHash: text("content_hash"),
    authors: text({ mode: "json" }).$type<string[]>(),
    authorship: text({ enum: authorships }).notNull().default("ai-assisted"),
    authorshipNote: text("authorship_note"),
    tags: text({ mode: "json" }).$type<string[]>(),
    projectId: text("project_id").references(() => projects.id, { onDelete: "set null" }),
    publishedAt: text("published_at"),
    revisedAt: text("revised_at"), // set by hand for meaningful updates
    sortOrder: integer("sort_order").notNull().default(0), // order among siblings
    ...timestamps,
  },
  (t) => [
    uniqueIndex("uq_content_parent_slug").on(t.parentId, t.slug),
    index("idx_content_parent_id").on(t.parentId),
    index("idx_content_project_id").on(t.projectId),
    index("idx_content_published_at").on(t.publishedAt),
    check("content_type", inList("type", contentTypes)),
    check("content_status", inList("status", statuses)),
    check("content_authorship", inList("authorship", authorships)),
    check("content_format", inList("format", formats)),
    check("content_component_has_key", sql`format != 'component' or component_key is not null`),
    check("content_published_has_date", sql`status != 'published' or published_at is not null`),
  ],
);

// Old paths of moved content. Points at the row, so the target follows later moves
export const redirects = sqliteTable("redirects", {
  fromPath: text("from_path").primaryKey(),
  contentId: text("content_id")
    .notNull()
    .references(() => content.id, { onDelete: "cascade" }),
  createdAt: timestamps.createdAt,
});

export const contentLinks = sqliteTable("content_links", {
  contentId: text("content_id")
    .primaryKey()
    .references(() => content.id, { onDelete: "cascade" }),
  targetUrl: text("target_url").notNull(),
  targetTitle: text("target_title"),
  viaUrl: text("via_url"),
  viaName: text("via_name"),
});

export const assets = sqliteTable(
  "assets",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    projectId: text("project_id").references(() => projects.id, { onDelete: "cascade" }),
    contentId: text("content_id").references(() => content.id, { onDelete: "cascade" }),
    url: text().notNull(),
    kind: text({ enum: assetKinds }).notNull().default("image"),
    role: text({ enum: assetRoles }).notNull(),
    alt: text(),
    width: integer(),
    height: integer(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamps.createdAt,
  },
  (t) => [
    index("idx_assets_project_id").on(t.projectId),
    index("idx_assets_content_id").on(t.contentId),
    check("assets_one_owner", sql`(project_id is null) != (content_id is null)`),
    check("assets_kind", inList("kind", assetKinds)),
    check("assets_role", inList("role", assetRoles)),
    // thumbnail, hero and logo are single-use per owner; gallery can repeat
    uniqueIndex("uq_assets_content_role")
      .on(t.contentId, t.role)
      .where(sql`content_id is not null and role != 'gallery'`),
    uniqueIndex("uq_assets_project_role")
      .on(t.projectId, t.role)
      .where(sql`project_id is not null and role != 'gallery'`),
  ],
);
