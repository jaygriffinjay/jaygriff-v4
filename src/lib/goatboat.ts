// Client for goatboat's read API. Response types are hand-written to match its JSON.

export const contentTypes = ["page", "post", "link", "image", "artifact"] as const;

export type ContentType = (typeof contentTypes)[number];
export type Status = "draft" | "published" | "private";

export type TocEntry = { depth: number; text: string; id: string };

export type Asset = {
  id: number;
  projectId: string | null;
  contentId: string | null;
  url: string;
  kind: "image" | "video" | "html";
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
  thumbnail: { id: number; projectId: string | null; url: string; alt: string | null; width: number | null; height: number | null } | null;
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
  section: { slug: string; title: string } | null;
  assets: Asset[];
};

export type PageLink = Pick<ContentItem, "path" | "type" | "title" | "description" | "publishedAt">;

export type ContentPage = {
  item: ContentItem;
  breadcrumbs: { id: string; title: string; path: string }[];
  children: Pick<ContentItem, "id" | "path" | "type" | "status" | "title" | "description">[];
  // Optional until every goatboat deploy sends them
  prev?: PageLink | null;
  next?: PageLink | null;
  related?: PageLink[];
};

async function get<T>(path: string, params?: Record<string, string | number | boolean | undefined>) {
  const base = process.env.GOATBOAT_URL;
  if (!base) throw new Error("GOATBOAT_URL is not set");
  const token = process.env.GOATBOAT_READ_TOKEN;
  if (!token) throw new Error("GOATBOAT_READ_TOKEN is not set");

  const url = new URL(`/api${path}`, base);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  let res: Response;
  try {
    res = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
  } catch (err) {
    throw new Error(`Can't reach goatboat at ${url.origin}`, { cause: err });
  }
  if (res.status === 404) return null;

  const text = await res.text();
  let json: { error?: { message?: string } } | undefined;
  try {
    json = JSON.parse(text);
  } catch {
    // Error pages from the host come back as HTML or plain text, not our JSON
  }
  if (!res.ok || !json) {
    throw new Error(`goatboat ${url.pathname}: ${json?.error?.message ?? `${res.status} ${res.statusText}`}`);
  }
  return json as T;
}

type FeedQuery = {
  type?: ContentType | "all";
  tag?: string;
  hideStructure?: boolean;
  projectOnly?: boolean;
  sort?: "latest" | "oldest";
  limit?: number;
  offset?: number;
};

/** Published content, newest first. Without a type, pages are left out; "all" includes them. */
export async function listContent(query: FeedQuery = {}) {
  return (await get<{ data: FeedItem[] }>("/content", query))?.data ?? [];
}

/** One page of the feed with how many rows match in all, for paging. */
export async function listFeed(query: FeedQuery = {}) {
  const res = await get<{ data: FeedItem[]; total: number }>("/content", query);
  return { items: res?.data ?? [], total: res?.total ?? 0 };
}

/** One homepage batch with full item data and a lookahead flag. */
export async function getHomeFeed(limit: number, sort: "latest" | "oldest" = "latest") {
  const res = await get<{ data: ContentItem[]; hasMore: boolean }>("/content/home-feed", { limit, sort });
  return { items: res?.data ?? [], hasMore: res?.hasMore ?? false };
}

/** The page at a path, `{ redirectTo }` if it moved, or null if nothing lives there. */
export async function getContentByPath(path: string) {
  const res = await get<{ data: ContentPage } | { redirectTo: string }>("/content/by-path", { path });
  if (!res) return null;
  return "redirectTo" in res ? res : res.data;
}

export type NotesPage = {
  path: string;
  title: string;
  description: string | null;
  publishedAt?: string | null;
  updatedAt?: string;
  source?: "db" | "approute";
};
export type NotesSection = { slug: string; title: string; pages: NotesPage[] };
export type NotesNav = { project: { slug: string; title: string; tagline: string | null }; sections: NotesSection[] };

/** A project's notes: its sections in order, each with its published pages in order. */
export async function getNotesNav(project: string) {
  return (await get<{ data: NotesNav }>(`/notes/${encodeURIComponent(project)}`))?.data ?? null;
}

export type NoteListItem = {
  path: string;
  title: string;
  description: string | null;
  tags: string[] | null;
  publishedAt: string | null;
  updatedAt: string;
  source: "db" | "approute";
  project: { slug: string; title: string } | null;
  section: { slug: string; title: string } | null;
};

/** Every published note, newest first, whether or not it has a project or section. */
export async function listNotes() {
  return (await get<{ data: NoteListItem[] }>("/notes"))?.data ?? [];
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
