// Wipes the database and fills it with dummy data, then checks that the constraints and ops hold.
// Run with: npm run db:seed
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());

// Imported after env is loaded; db/index.ts throws without DATABASE_URL
const { db } = await import("./index");
const { assets, authorships, content, contentLinks, projects, redirects, statuses } = await import("./schema");
const { createContent, moveContent } = await import("./ops");
const { getAncestors, getContentByPath } = await import("./queries");
const { eq, sql } = await import("drizzle-orm");

type NewProject = typeof projects.$inferInsert;
type ContentInput = import("./ops").ContentInput;
type NewLink = typeof contentLinks.$inferInsert;
type NewAsset = typeof assets.$inferInsert;

// Seeded PRNG so every run produces the same data
let seed = 42;
const rand = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const pick = <T>(xs: readonly T[]): T => xs[Math.floor(rand() * xs.length)];
const chance = (p: number) => rand() < p;
const some = <T>(xs: readonly T[], max: number): T[] =>
  [...xs].sort(() => rand() - 0.5).slice(0, 1 + Math.floor(rand() * max));
const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const daysAgo = (n: number) => new Date(Date.UTC(2026, 9, 11) - n * 86_400_000).toISOString();
const image = (key: string, w = 1200, h = 630) => `https://picsum.photos/seed/${key}/${w}/${h}`;

const TAGS = ["nextjs", "react", "css", "typescript", "databases", "ai", "agents", "design", "tooling", "sqlite", "mcp", "writing"];
const WORDS = "the database is the index of everything i publish and the site is just one consumer of it while agents write through an api that validates every input before it touches a table schema content project asset link render component registry experiment".split(" ");

const sentence = (min = 6, max = 16) => {
  const n = min + Math.floor(rand() * (max - min));
  const s = Array.from({ length: n }, () => pick(WORDS)).join(" ");
  return s[0].toUpperCase() + s.slice(1) + ".";
};
const paragraph = () => Array.from({ length: 3 + Math.floor(rand() * 4) }, () => sentence()).join(" ");
const title = () => sentence(3, 7).slice(0, -1);

const markdownBody = () =>
  [
    paragraph(),
    `## ${title()}`,
    paragraph(),
    "- " + sentence(3, 6) + "\n- " + sentence(3, 6) + "\n- " + sentence(3, 6),
    "```ts\nconst rows = await db.select().from(content).limit(10);\n```",
    paragraph(),
  ].join("\n\n");

const mdxBody = () =>
  [paragraph(), `<Callout>${sentence()}</Callout>`, `## ${title()}`, paragraph()].join("\n\n");

// Fixed outline so the TOC has something to show, including a repeated heading and a fenced fake one
const docBody = () =>
  [
    paragraph(),
    "## Overview",
    paragraph(),
    "## Setup",
    paragraph(),
    "### Environment variables",
    paragraph(),
    "```md\n## Not a heading, it's inside a code fence\n```",
    "### Example",
    paragraph(),
    "## Usage",
    paragraph(),
    "### Example",
    paragraph(),
  ].join("\n\n");

// Wipe

await db.delete(redirects);
await db.delete(assets);
await db.delete(contentLinks);
await db.delete(content);
await db.delete(projects);

// Projects

const projectRows: NewProject[] = Array.from({ length: 10 }, (_, i) => {
  const name = `${pick(["Shader", "Tiny", "Ink", "Graph", "Pocket", "Signal", "Paper", "Orbit"])} ${pick(["Lab", "Notes", "Kit", "Garden", "Engine", "Board"])} ${i + 1}`;
  const kind = chance(0.5) ? "experiment" : "project";
  return {
    id: crypto.randomUUID(),
    slug: slugify(name),
    title: name,
    tagline: sentence(4, 8),
    description: paragraph(),
    kind,
    status: pick(statuses),
    icon: chance(0.5) ? pick(["sparkles", "flask-conical", "rocket", "boxes", "palette"]) : null,
    appHref: chance(0.4) ? `/${kind}s/${slugify(name)}` : null,
    repoUrl: chance(0.7) ? `https://github.com/jaygriff/${slugify(name)}` : null,
    demoUrl: chance(0.3) ? `https://${slugify(name)}.example.com` : null,
    videoUrl: null,
    tags: some(TAGS, 3),
    sortOrder: i,
  };
});
await db.insert(projects).values(projectRows);

// Section pages: the tree's skeleton

const page = (slug: string, pageTitle: string, parentId: string | null, sortOrder: number, body?: string) =>
  createContent({
    parentId,
    slug,
    type: "page",
    status: "published",
    publishedAt: daysAgo(800),
    title: pageTitle,
    description: sentence(),
    body: body ?? paragraph(),
    authors: ["Jay Griffin"],
    sortOrder,
  });

const postsPage = await page("posts", "Posts", null, 1);
const linksPage = await page("links", "Links", null, 2);
const imagesPage = await page("images", "Images", null, 3);
const docsPage = await page("docs", "Docs", null, 4);
const gettingStarted = await page("getting-started", "Getting started", docsPage.id, 1, docBody());
const guidesPage = await page("guides", "Guides", docsPage.id, 2);
await page("writing-posts", "Writing posts", guidesPage.id, 1, docBody());
const linkingGuide = await page("linking", "Linking", guidesPage.id, 2, docBody());
await page("images-and-assets", "Images and assets", guidesPage.id, 3, docBody());
const referencePage = await page("reference", "Reference", docsPage.id, 3);
await page("schema", "Schema", referencePage.id, 1, docBody());
await page("ops", "Ops", referencePage.id, 2, docBody());

// Leaf content

const linkRows: NewLink[] = [];
const assetRows: NewAsset[] = [];
const usedSlugs = new Set<string>();

const uniqueSlug = (base: string) => {
  let slug = slugify(base) || "untitled";
  for (let n = 2; usedSlugs.has(slug); n++) slug = `${slugify(base)}-${n}`;
  usedSlugs.add(slug);
  return slug;
};

const baseContent = (type: ContentInput["type"], parentId: string, t: string): ContentInput & { id: string } => {
  const status = chance(0.7) ? "published" : pick(statuses);
  const age = Math.floor(rand() * 700);
  return {
    id: crypto.randomUUID(),
    parentId,
    slug: uniqueSlug(t),
    type,
    status,
    title: t,
    description: chance(0.8) ? sentence() : null,
    authors: ["Jay Griffin"],
    authorship: pick(authorships),
    authorshipNote: chance(0.3) ? sentence() : null,
    tags: some(TAGS, 4),
    projectId: chance(0.3) ? pick(projectRows).id! : null,
    publishedAt: status === "published" ? daysAgo(age) : null,
    revisedAt: status === "published" && chance(0.2) ? daysAgo(Math.floor(age / 2)) : null,
  };
};

for (let i = 0; i < 40; i++) {
  const row = baseContent("post", postsPage.id, title());
  const format = pick(["md", "md", "md", "mdx", "component"] as const);
  row.format = format;
  if (format === "md") row.body = markdownBody();
  if (format === "mdx") row.body = mdxBody();
  if (format === "component") row.componentKey = row.slug;
  await createContent(row);
  if (chance(0.5)) {
    assetRows.push({ contentId: row.id, role: "thumbnail", url: image(row.slug), alt: row.title, width: 1200, height: 630 });
  }
}

for (let i = 0; i < 30; i++) {
  const targetTitle = title();
  const row = baseContent("link", linksPage.id, targetTitle);
  row.body = chance(0.6) ? paragraph() : null;
  await createContent(row);
  const via = chance(0.4) ? pick(["Hacker News", "Lobsters", "Simon Willison", "a friend"]) : null;
  linkRows.push({
    contentId: row.id,
    targetUrl: `https://example.com/${slugify(targetTitle)}`,
    targetTitle: chance(0.8) ? targetTitle : null,
    viaUrl: via ? `https://example.com/via/${slugify(via)}` : null,
    viaName: via,
  });
}

for (let i = 0; i < 15; i++) {
  const row = baseContent("image", imagesPage.id, title());
  row.body = chance(0.5) ? sentence() : null;
  await createContent(row);
  assetRows.push({ contentId: row.id, role: "hero", url: image(row.slug, 1600, 1000), alt: sentence(4, 8), width: 1600, height: 1000 });
  const galleryCount = chance(0.4) ? 2 + Math.floor(rand() * 4) : 0;
  for (let g = 0; g < galleryCount; g++) {
    assetRows.push({ contentId: row.id, role: "gallery", url: image(`${row.slug}-${g}`, 1200, 800), alt: sentence(4, 8), width: 1200, height: 800, sortOrder: g });
  }
}

for (const p of projectRows) {
  if (chance(0.5)) assetRows.push({ projectId: p.id, role: "logo", url: image(`${p.slug}-logo`, 256, 256), alt: `${p.title} logo`, width: 256, height: 256 });
  if (chance(0.7)) assetRows.push({ projectId: p.id, role: "thumbnail", url: image(`${p.slug}-thumb`), alt: p.title, width: 1200, height: 630 });
}

// Write

await db.insert(contentLinks).values(linkRows);
await db.insert(assets).values(assetRows);

const count = async (table: typeof content | typeof projects | typeof contentLinks | typeof assets) =>
  (await db.select({ n: sql<number>`count(*)` }).from(table))[0].n;

console.log("Seeded:");
console.log(`  projects       ${await count(projects)}`);
console.log(`  content        ${await count(content)}`);
console.log(`  content_links  ${await count(contentLinks)}`);
console.log(`  assets         ${await count(assets)}`);

// Checks

let problems = 0;
const expect = (name: string, ok: boolean) => {
  console.log(`  ${ok ? "ok  " : "FAIL"}  ${name}`);
  if (!ok) problems++;
};
const expectReject = async (name: string, fn: () => Promise<unknown>) => {
  try {
    await fn();
    expect(`${name} (was allowed)`, false);
  } catch {
    expect(name, true);
  }
};

const [post] = await db.select().from(content).where(eq(content.type, "post")).limit(1);
const [imagePost] = await db.select().from(content).where(eq(content.type, "image")).limit(1);
const project = projectRows[0];

console.log("\nConstraint checks:");
await expectReject("duplicate slug under the same parent", () =>
  db.insert(content).values({ ...post, id: crypto.randomUUID(), path: "/elsewhere" }),
);
await expectReject("duplicate path", () =>
  db.insert(content).values({ ...post, id: crypto.randomUUID(), parentId: null }),
);
await expectReject("published without published_at", () =>
  db.insert(content).values({ slug: "x", path: "/x-published", type: "post", title: "x", status: "published" }),
);
await expectReject("format component without component_key", () =>
  db.insert(content).values({ slug: "x", path: "/x-component", type: "post", title: "x", format: "component" }),
);
await expectReject("unknown content type", () =>
  db.run(sql`insert into content (id, slug, path, type, title) values ('x', 'x', '/x-type', 'podcast', 'x')`),
);
await expectReject("unknown project kind", () =>
  db.run(sql`insert into projects (id, slug, title, kind) values ('x', 'x-kind', 'x', 'app')`),
);
await expectReject("asset with two owners", () =>
  db.insert(assets).values({ projectId: project.id, contentId: post.id, role: "gallery", url: "x" }),
);
await expectReject("asset with no owner", () => db.insert(assets).values({ role: "gallery", url: "x" }));
await expectReject("second hero on one image post", () =>
  db.insert(assets).values({ contentId: imagePost.id, role: "hero", url: "x" }),
);
await expectReject("asset pointing at missing content", () =>
  db.insert(assets).values({ contentId: "does-not-exist", role: "gallery", url: "x" }),
);
await expectReject("deleting a page that has children", () =>
  db.delete(content).where(eq(content.id, guidesPage.id)),
);

const [link] = await db.select().from(content).where(eq(content.type, "link")).limit(1);
await db.insert(assets).values({ contentId: link.id, role: "thumbnail", url: "x" });
await db.delete(content).where(eq(content.id, link.id));
const orphanLinks = await db.select().from(contentLinks).where(eq(contentLinks.contentId, link.id));
const orphanAssets = await db.select().from(assets).where(eq(assets.contentId, link.id));
expect("cascade delete removes detail row and assets", !orphanLinks.length && !orphanAssets.length);

console.log("\nTree checks:");
expect("path built from parents", linkingGuide.path === "/docs/guides/linking");

const crumbs = await getAncestors(linkingGuide.id);
expect("breadcrumbs root-first", crumbs.map((c) => c.title).join(" > ") === "Docs > Guides > Linking");

const tocIds = gettingStarted.toc?.map((t) => t.id).join(",");
expect("toc ids deduped, fenced heading skipped", tocIds === "overview,setup,environment-variables,example,usage,example-1");

await expectReject("moving a node under its own descendant", () =>
  moveContent(docsPage.id, { parentId: guidesPage.id }),
);

await moveContent(guidesPage.id, { parentId: null });
const moved = await getContentByPath("/guides/linking");
expect("move rewrites descendant paths", !!moved && "item" in moved);
const old = await getContentByPath("/docs/guides/linking");
expect("old path redirects to the new one", !!old && "redirectTo" in old && old.redirectTo === "/guides/linking");

await moveContent(guidesPage.id, { parentId: docsPage.id });
const back = await getContentByPath("/docs/guides/linking");
expect("moving back takes the old path again", !!back && "item" in back);
const stale = await db.select().from(redirects).where(eq(redirects.fromPath, "/docs/guides/linking"));
expect("moving back deletes the redirect it would loop through", stale.length === 0);

const takeover = await createContent({ slug: "guides", type: "page", title: "New guides" });
const shadowed = await db.select().from(redirects).where(eq(redirects.fromPath, "/guides"));
expect("new page at a redirected path deletes the redirect", shadowed.length === 0);
await db.delete(content).where(eq(content.id, takeover.id));

console.log(problems ? `\n${problems} problem(s)` : "\nAll checks passed");
process.exit(problems ? 1 : 0);
