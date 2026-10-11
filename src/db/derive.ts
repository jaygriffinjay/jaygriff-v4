import type { TocEntry } from "./schema";

/** Anchor id for a heading. The renderer must use this too, or TOC links break. */
export function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}

export function buildPath(parentPath: string | null, slug: string) {
  return `${parentPath ?? ""}/${slug}`;
}

/** h2–h6 from markdown, skipping fenced code. Duplicate ids get -1, -2, … like GitHub. */
export function extractToc(markdown: string | null | undefined): TocEntry[] | null {
  if (!markdown) return null;

  const entries: TocEntry[] = [];
  const seen = new Map<string, number>();
  let fence: string | null = null;

  for (const line of markdown.split("\n")) {
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
    if (fenceMatch) {
      if (!fence) fence = fenceMatch[1];
      else if (fenceMatch[1].startsWith(fence)) fence = null;
      continue;
    }
    if (fence) continue;

    const heading = line.match(/^(#{2,6})\s+(.+?)\s*#*\s*$/);
    if (!heading) continue;

    const text = heading[2].replace(/[*_`]|\[([^\]]*)\]\([^)]*\)/g, "$1").trim();
    const base = slugifyHeading(text);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    entries.push({ depth: heading[1].length, text, id: count ? `${base}-${count}` : base });
  }

  return entries.length ? entries : null;
}
