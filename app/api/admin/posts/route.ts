import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { posts, type NewPost } from "../../../../db/schema";

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ?? "4d68mrjqbr@privaterelay.appleid.com";

function checkAdmin(request: Request): boolean {
  if (process.env.NODE_ENV === "development") return true;
  const email = request.headers.get("oai-authenticated-user-email");
  return email === ADMIN_EMAIL;
}

function badRequest(msg: string) {
  return Response.json({ error: msg }, { status: 400 });
}

function forbidden() {
  return Response.json({ error: "Forbidden" }, { status: 403 });
}

export async function GET(request: Request) {
  if (!checkAdmin(request)) return forbidden();
  try {
    const db = await getDb();
    const rows = await db.select().from(posts).orderBy();
    return Response.json({ posts: rows });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!checkAdmin(request)) return forbidden();
  try {
    const payload = (await request.json()) as Partial<NewPost>;
    const { slug, kind, category, title } = payload;
    if (!slug || !kind || !category || !title) {
      return badRequest("slug, kind, category, title are required");
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return badRequest("slug must be lowercase alphanumeric with hyphens");
    }
    const db = await getDb();
    const [post] = await db
      .insert(posts)
      .values({
        slug,
        kind,
        category,
        title,
        summary: payload.summary ?? "",
        dateLabel: payload.dateLabel ?? "",
        readTime: payload.readTime ?? "",
        kicker: payload.kicker ?? "",
        body: payload.body ?? "[]",
        featured: payload.featured ?? false,
        published: payload.published ?? true,
        sortOrder: payload.sortOrder ?? 0,
      })
      .returning();
    return Response.json({ post }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("UNIQUE")) return badRequest("slug already exists");
    return Response.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!checkAdmin(request)) return forbidden();
  try {
    const payload = (await request.json()) as Partial<NewPost> & { id: number };
    if (!payload.id) return badRequest("id is required");
    const db = await getDb();
    const [post] = await db
      .update(posts)
      .set({
        ...payload,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(posts.id, payload.id))
      .returning();
    if (!post) return Response.json({ error: "not found" }, { status: 404 });
    return Response.json({ post });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!checkAdmin(request)) return forbidden();
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    if (!id) return badRequest("id query param is required");
    const db = await getDb();
    await db.delete(posts).where(eq(posts.id, id));
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
