import { asc, desc, eq } from "drizzle-orm";
import { getDb } from "../../db";
import { posts } from "../../db/schema";

export type { Post } from "../../db/schema";

export async function getAllPosts() {
  const db = await getDb();
  return db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.sortOrder), desc(posts.createdAt));
}

export async function getAllPostsAdmin() {
  const db = await getDb();
  return db
    .select()
    .from(posts)
    .orderBy(desc(posts.sortOrder), desc(posts.createdAt));
}

export async function getPostBySlug(slug: string) {
  const db = await getDb();
  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);
  return post ?? null;
}

export async function getAdjacentPosts(slug: string) {
  const all = await getAllPosts();
  const index = all.findIndex((p) => p.slug === slug);
  return {
    previous: index > 0 ? all[index - 1] : null,
    next: index < all.length - 1 ? all[index + 1] : null,
  };
}

export function parseBody(raw: string): string[] {
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return raw ? [raw] : [];
  }
}
