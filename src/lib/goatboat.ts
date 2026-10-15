// Client for goatboat's read API. Response types are hand-written to match its JSON.

export const contentTypes = ["page", "post", "link", "image"] as const;

export type ContentType = (typeof contentTypes)[number];
export type Status = "draft" | "published" | "private";

export type TocEntry = { depth: number; text: string; id: string };

export type Asset = {
  id: number;
  projectId: string | null;
  contentId: string | null;
  url: string;
  kind: "image" | "video";
  role: "thumbnail" | "hero" | "logo" | "gallery";
  alt: string | null;
  width: number | null;
  height: number | null;
  sortOrder: number;
  createdAt: string;
};

export type FeedItem = {
  id: string;
  slug: string;
  path: string;
  type: ContentType;
  title: string;
  description: string | null;
  publishedAt: string | null;
  tags: string[] | null;
  targetUrl: string | null;
  viaName: string | null;
  cover: Pick<Asset, "contentId" | "url" | "alt" | "width" | "height"> | null;
};

export type Tag = { tag: string; count: number };

export type TreeNode = {
  id: string;
  parentId: string | null;
  path: string;
  type: ContentType;
  status: Status;
  title: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  kind: "experiment" | "project";
  status: Status;
  icon: string | null;
  appHref: string | null;
  repoUrl: string | null;
  demoUrl: string | null;
  videoUrl: string | null;
  tags: string[] | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  thumbnail: { projectId: string | null; url: string; alt: string | null } | null;
};

export type ContentItem = {
  id: string;
  parentId: string | null;
  slug: string;
  path: string;
  type: ContentType;
  status: Status;
  title: string;
  description: string | null;
  intro: string | null;
  body: string | null;
  toc: TocEntry[] | null;
  format: "md" | "mdx" | "component";
  componentKey: string | null;
  contentHash: string | null;
  authors: string[] | null;
  authorship: "human" | "ai-assisted" | "ai-generated";
  authorshipNote: string | null;
  tags: string[] | null;
  projectId: string | null;
  publishedAt: string | null;
  revisedAt: string | null;
  sortOrder: number;
  source: "db" | "approute";
  file: string | null;
  missingSince: string | null;
  createdAt: string;
  updatedAt: string;
  link: { contentId: string; targetUrl: string; targetTitle: string | null; viaUrl: string | null; viaName: string | null } | null;
  project: { slug: string; title: string } | null;
  assets: Asset[];
};

export type ContentPage = {
  item: ContentItem;
  breadcrumbs: { id: string; title: string; path: string }[];
  children: Pick<ContentItem, "id" | "path" | "type" | "status" | "title" | "description">[];
};

async function get<T>(path: string, params?: Record<string, string | number | undefined>) {
  const base = process.env.GOATBOAT_URL;
  if (!base) throw new Error("GOATBOAT_URL is not set");

  const url = new URL(`/api${path}`, base);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const res = await fetch(url);
  if (res.status === 404) return null;
  const json = await res.json();
  if (!res.ok) throw new Error(`goatboat ${url.pathname}: ${json.error?.message ?? res.status}`);
  return json as T;
}

export async function listContent(query: { type?: ContentType; tag?: string; limit?: number } = {}) {
  return (await get<{ data: FeedItem[] }>("/content", query))?.data ?? [];
}

/** The page at a path, `{ redirectTo }` if it moved, or null if nothing lives there. */
export async function getContentByPath(path: string) {
  const res = await get<{ data: ContentPage } | { redirectTo: string }>("/content/by-path", { path });
  if (!res) return null;
  return "redirectTo" in res ? res : res.data;
}

export async function listTags() {
  return (await get<{ data: Tag[] }>("/tags"))?.data ?? [];
}

export async function listTree() {
  return (await get<{ data: TreeNode[] }>("/tree"))?.data ?? [];
}

export async function listProjects() {
  return (await get<{ data: Project[] }>("/projects"))?.data ?? [];
}
