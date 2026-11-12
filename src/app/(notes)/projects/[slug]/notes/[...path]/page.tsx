import { ContentPage } from "@/components/site/content-page";

export default async function Page({ params }: { params: Promise<{ slug: string; path: string[] }> }) {
  const { slug, path } = await params;
  return <ContentPage path={`/projects/${slug}/notes/${path.join("/")}`} />;
}
