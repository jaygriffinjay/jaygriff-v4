// goatboat: a09b11b1-b486-493e-a228-e9bd4c7e4950
import { HomeFeed } from "@/components/site/home-feed";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { H2, Muted } from "@/components/typography";
import { getContentByPath, listFeed, type ContentItem } from "@/lib/goatboat";

const SAMPLE = 8;

/** The newest rows, each as the full page, so entries have their body, project, authors and pictures. */
async function newest() {
  const { items } = await listFeed({ type: "all", hideStructure: true, limit: SAMPLE });
  const pages = await Promise.all(items.map((item) => getContentByPath(item.path)));
  return pages.flatMap((page): ContentItem[] => (page && !("redirectTo" in page) ? [page.item] : []));
}

export default async function HomeFeedPage() {
  const items = await newest();

  return (
    <PageLayout hideRelated>
      <PageHeader intro="The home page's Latest feed with a picture as wide as the column and more on each entry. The same real, newest pages shown with the picture in different places." />

      <H2>Above the title</H2>
      <Muted>A widescreen picture first, then the title, the opening, what's left and the details line.</Muted>
      <HomeFeed items={items} hero="above" />

      <H2>Above the title, shorter</H2>
      <Muted>A 2:1 strip, so the pictures take less of the page.</Muted>
      <HomeFeed items={items} hero="wide" />

      <H2>Between the title and the opening</H2>
      <Muted>The title leads, then the picture, then the opening.</Muted>
      <HomeFeed items={items} hero="between" />

      <H2>No picture</H2>
      <Muted>The same entries without pictures, to compare how much the picture adds.</Muted>
      <HomeFeed items={items} hero="none" />
    </PageLayout>
  );
}
