// goatboat: 1c8a29b9-27ec-40d3-a4dd-93e34f10741a
import NextLink from "next/link";
import { Badge } from "@/components/ui/badge";
import { Paragraph } from "@/components/typography";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { listTree, type TreeNode as Node } from "@/lib/goatboat";
import { isVisible } from "@/lib/page-meta";
import styles from "./page.module.css";

export default async function TreePage() {
  const nodes = (await listTree()).filter(isVisible);

  const childrenOf = new Map<string | null, Node[]>();
  for (const node of nodes) {
    const siblings = childrenOf.get(node.parentId) ?? [];
    siblings.push(node);
    childrenOf.set(node.parentId, siblings);
  }

  return (
    <PageLayout>
      <PageHeader />
      <Paragraph className={styles.intro}>{nodes.length} nodes.</Paragraph>
      <Branch parentId={null} childrenOf={childrenOf} />
    </PageLayout>
  );
}

function Branch({ parentId, childrenOf }: { parentId: string | null; childrenOf: Map<string | null, Node[]> }) {
  const nodes = childrenOf.get(parentId);
  if (!nodes) return null;

  return (
    <ul className={parentId ? styles.branch : styles.root}>
      {nodes.map((node) => (
        <li key={node.id}>
          <div className={styles.node}>
            <NextLink href={`/projects/goatboat/notes/content${node.path}`} className={styles.link}>
              {node.title}
            </NextLink>
            <Badge variant="outline">{node.type}</Badge>
            {node.status !== "published" && <Badge variant="outline">{node.status}</Badge>}
            <span className={styles.path}>{node.path}</span>
          </div>
          <Branch parentId={node.id} childrenOf={childrenOf} />
        </li>
      ))}
    </ul>
  );
}
