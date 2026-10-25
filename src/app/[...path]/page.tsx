import { notFound, permanentRedirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { H1, Paragraph } from "@/components/typography";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { ChildPages } from "@/components/site/child-pages";
import { PageLayout } from "@/components/site/page-layout";
import { getContentByPath } from "@/lib/goatboat";
import { isVisible } from "@/lib/page-meta";
import styles from "./page.module.css";

type Props = { params: Promise<{ path: string[] }> };

// The page shows the row's title, so a leading "# Title" in the body would repeat it
const withoutLeadingTitle = (body: string) => body.replace(/^\s*#\s+[^\n]*\n?/, "");

async function load(params: Props["params"]) {
  const { path } = await params;
  return getContentByPath(`/${path.join("/")}`);
}

export default async function ContentPage({ params }: Props) {
  const result = await load(params);
  if (!result) notFound();
  if ("redirectTo" in result) permanentRedirect(result.redirectTo);

  const { item } = result;
  if (!isVisible(item)) notFound();

  return (
    <PageLayout>
      {item.status !== "published" && (
        <Badge variant="outline" className={styles.draft}>
          {item.status} · only visible in local dev
        </Badge>
      )}
      <H1 className={styles.title}>{item.title}</H1>
      {item.description && <Paragraph className={styles.description}>{item.description}</Paragraph>}
      {item.body && <MarkdownRenderer className={styles.body} source={withoutLeadingTitle(item.body)} />}
      <ChildPages />
    </PageLayout>
  );
}
