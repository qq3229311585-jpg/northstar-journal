import Link from "next/link";
import { getAllPosts } from "../lib/db-posts";
import { essayPosts } from "../content";

export default async function WritingPage() {
  let posts: { slug: string; category: string; dateLabel: string; title: string; summary: string }[] = [];

  try {
    const rows = await getAllPosts();
    posts = rows
      .filter((p) => p.kind === "essay")
      .map((p) => ({
        slug: p.slug,
        category: p.category,
        dateLabel: p.dateLabel,
        title: p.title,
        summary: p.summary,
      }));
  } catch {
    posts = essayPosts.map((p) => ({
      slug: p.slug,
      category: p.category,
      dateLabel: p.date,
      title: p.title,
      summary: p.summary,
    }));
  }

  return (
    <main className="shell list-page">
      <div className="page-intro">
        <p className="section-kicker">全部文章</p>
        <h1 className="page-title">把完整的文章收在这里，像一份慢慢变厚的目录。</h1>
      </div>

      <div className="editorial-list">
        {posts.map((post, index) => (
          <Link href={`/posts/${post.slug}`} key={post.slug} className="list-row">
            <div className="row-index">{String(index + 1).padStart(2, "0")}</div>
            <div className="row-main">
              <p className="row-meta">
                <span>{post.category}</span>
                <span>{post.dateLabel}</span>
              </p>
              <h2>{post.title}</h2>
            </div>
            <p className="row-summary">{post.summary}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
