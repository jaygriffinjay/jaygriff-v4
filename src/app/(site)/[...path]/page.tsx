import { ContentPage } from "@/components/site/content-page";

export default async function Page({ params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return <ContentPage path={`/${path.join("/")}`} />;
}
