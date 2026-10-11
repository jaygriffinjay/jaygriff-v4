// Every write to content goes through here, so derived columns (path, toc) stay correct.
import { and, eq, inArray, or, sql } from "drizzle-orm";
import { db, type Executor } from "./index";
import { buildPath, extractToc } from "./derive";
import { getAncestors } from "./queries";
import { content, redirects } from "./schema";

type NewContent = typeof content.$inferInsert;
export type ContentInput = Omit<NewContent, "path" | "toc">;

async function parentPath(tx: Executor, parentId: string | null | undefined) {
  if (!parentId) return null;
  const [parent] = await tx.select({ path: content.path }).from(content).where(eq(content.id, parentId));
  if (!parent) throw new Error(`Parent ${parentId} does not exist`);
  return parent.path;
}

export async function createContent(input: ContentInput) {
  return db.transaction(async (tx) => {
    const path = buildPath(await parentPath(tx, input.parentId), input.slug);
    // A new page at a redirected path takes it over
    await tx.delete(redirects).where(eq(redirects.fromPath, path));
    const [row] = await tx
      .insert(content)
      .values({ ...input, path, toc: extractToc(input.body) })
      .returning();
    return row;
  });
}

/** Re-parent and/or re-slug a node. Rewrites its descendants' paths and leaves redirects behind. */
export async function moveContent(id: string, to: { parentId?: string | null; slug?: string }) {
  return db.transaction(async (tx) => {
    const [node] = await tx.select().from(content).where(eq(content.id, id));
    if (!node) throw new Error(`Content ${id} does not exist`);

    const parentId = to.parentId === undefined ? node.parentId : to.parentId;
    const slug = to.slug ?? node.slug;

    if (parentId) {
      const ancestors = await getAncestors(parentId, tx);
      if (ancestors.some((a) => a.id === id)) throw new Error("Can't move a node under itself");
    }

    const oldPath = node.path;
    const newPath = buildPath(await parentPath(tx, parentId), slug);
    if (newPath === oldPath && parentId === node.parentId) return node;

    const isSubtree = or(
      eq(content.path, oldPath),
      sql`substr(${content.path}, 1, ${oldPath.length + 1}) = ${oldPath + "/"}`,
    );
    const moving = await tx.select({ id: content.id, path: content.path }).from(content).where(isSubtree);
    const rename = (p: string) => newPath + p.slice(oldPath.length);

    await tx
      .delete(redirects)
      .where(inArray(redirects.fromPath, moving.map((m) => rename(m.path))));

    await tx.update(content).set({ parentId, slug, path: newPath }).where(eq(content.id, id));
    await tx
      .update(content)
      .set({ path: sql`${newPath} || substr(${content.path}, ${oldPath.length + 1})` })
      .where(and(isSubtree, sql`${content.id} != ${id}`));

    if (newPath !== oldPath) {
      await tx
        .insert(redirects)
        .values(moving.map((m) => ({ fromPath: m.path, contentId: m.id })))
        .onConflictDoUpdate({ target: redirects.fromPath, set: { contentId: sql`excluded.content_id` } });
    }

    const [moved] = await tx.select().from(content).where(eq(content.id, id));
    return moved;
  });
}
