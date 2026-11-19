// goatboat: 87e05806-2411-4f42-823a-845fc9ca89f8
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Feed } from "@/components/site/feed";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { Pagination } from "@/components/site/pagination";
import { listFeed } from "@/lib/goatboat";
import { pageHref } from "@/lib/page-href";

const PAGE_SIZE = 20;
const BASE_PATH = "/new";

type Props = { searchParams: Promise<{ page?: string }> };

// Anything that isn't a whole number from 1 up is the first page
const parsePage = (value?: string) => {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 ? page : 1;
};

// Each page is its own canonical URL, or crawlers would fold every page into the first
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const page = parsePage((await searchParams).page);
  return { alternates: { canonical: pageHref(BASE_PATH, page) } };
}

/** Every published row of every type, newest first, except each project's home and notes home, which only hold the others together. */
export default async function NewPage({ searchParams }: Props) {
  const page = parsePage((await searchParams).page);
  const { items, total } = await listFeed({ type: "all", hideStructure: true, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE });
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (page > pageCount) notFound();

  return (
    <PageLayout hideRelated>
      <PageHeader />
      <Feed items={items} />
      <Pagination page={page} pageCount={pageCount} basePath={BASE_PATH} />
    </PageLayout>
  );
}
