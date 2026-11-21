// goatboat: 261a3c4f-ae13-4880-8712-88f7b0971430
import { ArtifactArcade, type ArcadeItem } from "@/components/site/artifact-arcade";
import { getContentByPath, listContent } from "@/lib/goatboat";

/** Every published artifact with its html file and screenshot, newest first. */
async function artifacts() {
  const feed = await listContent({ type: "artifact" });
  const pages = await Promise.all(feed.map((item) => getContentByPath(item.path)));
  return pages.flatMap((page): ArcadeItem[] => {
    if (!page || "redirectTo" in page) return [];
    const { item } = page;
    const src = item.assets.find((a) => a.kind === "html" && a.role === "hero")?.url;
    if (!src) return [];
    return [
      {
        id: item.id,
        slug: item.slug,
        path: item.path,
        title: item.title,
        description: item.description,
        tags: item.tags ?? [],
        thumbnail: item.assets.find((a) => a.kind === "image" && a.role === "thumbnail")?.url ?? null,
        src,
      },
    ];
  });
}

export default async function ArcadePage() {
  return <ArtifactArcade items={await artifacts()} />;
}
