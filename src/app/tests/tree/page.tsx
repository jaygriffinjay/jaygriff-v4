import NextLink from "next/link";
import { Badge } from "@/components/ui/badge";
import { H1, Paragraph } from "@/components/typography";
import { PageLayout } from "@/components/site/page-layout";
import { listTree, type TreeNode as Node } from "@/lib/goatboat";
import styles from "./page.module.css";

export default async function TreePage() {
  const nodes = await listTree();

  const childrenOf = new Map<string | null, Node[]>();
  for (const node of nodes) {
    const siblings = childrenOf.get(node.parentId) ?? [];
    siblings.push(node);
    childrenOf.set(node.parentId, siblings);
  }

  return (
    <PageLayout>
      <H1 className={styles.title}>Content tree</H1>
      <Paragraph className={styles.intro}>
        Every node under its parent, in sibling order. {nodes.length} nodes.
      </Paragraph>
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
            <NextLink href={`/tests/content${node.path}`} className={styles.link}>
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
