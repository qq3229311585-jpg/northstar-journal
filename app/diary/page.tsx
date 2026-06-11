import Link from "next/link";
import { getAllPosts } from "../lib/db-posts";
import { diaryPosts } from "../content";

export default async function DiaryPage() {
  let posts: { slug: string; kicker: string; dateLabel: string; title: string; summary: string }[] = [];

  try {
    const rows = await getAllPosts();
    posts = rows
      .filter((p) => p.kind === "diary")
      .map((p) => ({
        slug: p.slug,
        kicker: p.kicker,
        dateLabel: p.dateLabel,
        title: p.title,
        summary: p.summary,
      }));
  } catch {
    posts = diaryPosts.map((p) => ({
      slug: p.slug,
      kicker: p.kicker,
      dateLabel: p.date,
      title: p.title,
      summary: p.summary,
    }));
  }

  return (
    <main className="shell list-page">
      <div className="page-intro">
        <p className="section-kicker">日记摘页</p>
        <h1 className="page-title">不完整也没关系，有些句子本来就只适合以片段的方式留下来。</h1>
      </div>

      <div className="diary-stack">
        {posts.map((post) => (
          <Link href={`/posts/${post.slug}`} key={post.slug} className="diary-row">
            <div className="diary-row-meta">
              <span>{post.kicker}</span>
              <span>{post.dateLabel}</span>
            </div>
            <div className="diary-row-main">
              <h2>{post.title}</h2>
              <p>{post.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
