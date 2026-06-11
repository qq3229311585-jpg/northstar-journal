import { getDb } from "../../../../db";
import { posts } from "../../../../db/schema";
import { staticPosts } from "../../../content";

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ?? "4d68mrjqbr@privaterelay.appleid.com";

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    const email = request.headers.get("oai-authenticated-user-email");
    if (email !== ADMIN_EMAIL) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  try {
    const db = await getDb();
    const existing = await db.select().from(posts);
    if (existing.length > 0) {
      return Response.json(
        { message: "Database already seeded", count: existing.length },
        { status: 200 }
      );
    }

    const rows = staticPosts.map((p, i) => ({
      slug: p.slug,
      kind: p.kind,
      category: p.category,
      title: p.title,
      summary: p.summary,
      dateLabel: p.date,
      readTime: p.readTime,
      kicker: p.kicker,
      body: JSON.stringify(p.body),
      featured: p.featured ?? false,
      published: true,
      sortOrder: staticPosts.length - i,
    }));

    await db.insert(posts).values(rows);
    return Response.json({ ok: true, seeded: rows.length }, { status: 201 });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
