import type { Metadata } from "next";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Artifact } from "@/components/site/artifact";
import { getContentByPath } from "@/lib/goatboat";
import { isVisible } from "@/lib/page-meta";
import styles from "./page.module.css";

type Props = { params: Promise<{ slug: string }> };

/** The artifact page's row and its html file, or null. The slug is checked before it goes into a path. */
const findArtifact = cache(async (slug: string) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  const result = await getContentByPath(`/artifacts/${slug}`);
  if (!result || "redirectTo" in result) return null;
  const { item } = result;
  const file = item.assets.find((a) => a.kind === "html" && a.role === "hero");
  return item.type === "artifact" && isVisible(item) && file ? { item, file } : null;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await findArtifact((await params).slug);
  if (!found) return {};
  return {
    title: `${found.item.title} · Jay Griffin`,
    description: found.item.description ?? undefined,
    // The artifact's own page is the one to find
    robots: { index: false },
    alternates: { canonical: found.item.path },
  };
}

/** An artifact on its own: a thin bar and the artifact filling the rest of the screen, still in its sandbox. */
export default async function ArtifactViewPage({ params }: Props) {
  const found = await findArtifact((await params).slug);
  if (!found) notFound();
  const { item, file } = found;

  return (
    <div className={styles.page}>
      <header className={styles.bar}>
        <NextLink href={item.path} className={styles.back}>
          ← {item.title}
        </NextLink>
        <a href={file.url} className={styles.raw}>
          Raw file
        </a>
      </header>
      <Artifact src={file.url} title={item.title} size="fill" />
    </div>
  );
}
