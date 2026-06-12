import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getAdjacentPosts, getPostBySlug, parseBody } from "../../lib/db-posts";
import { getPost, getAdjacentPosts as staticAdjacent, staticPosts } from "../../content";
import { FullscreenButton } from "../../components/FullscreenButton";
import { ReadingProgress } from "../../components/ReadingProgress";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const rows = await getAllPosts();
    return rows.map((p) => ({ slug: p.slug }));
  } catch {
    return staticPosts.map((p) => ({ slug: p.slug }));
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    if (!post) return { title: "文章未找到" };
    return {
      title: post.title,
      description: post.summary,
      alternates: { canonical: `/posts/${post.slug}` },
    };
  } catch {
    const post = getPost(slug);
    if (!post) return { title: "文章未找到" };
    return {
      title: post.title,
      description: post.summary,
      alternates: { canonical: `/posts/${post.slug}` },
    };
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  let post: { slug: string; kicker: string; category: string; dateLabel: string; readTime: string; title: string; summary: string; body: string[] } | null = null;
  let previous: { slug: string; title: string } | null = null;
  let next: { slug: string; title: string } | null = null;

  try {
    const dbPost = await getPostBySlug(slug);
    if (!dbPost) notFound();
    post = {
      slug: dbPost.slug,
      kicker: dbPost.kicker,
      category: dbPost.category,
      dateLabel: dbPost.dateLabel,
      readTime: dbPost.readTime,
      title: dbPost.title,
      summary: dbPost.summary,
      body: parseBody(dbPost.body),
    };
    const adj = await getAdjacentPosts(slug);
    previous = adj.previous ? { slug: adj.previous.slug, title: adj.previous.title } : null;
    next = adj.next ? { slug: adj.next.slug, title: adj.next.title } : null;
  } catch {
    const staticPost = getPost(slug);
    if (!staticPost) notFound();
    post = {
      slug: staticPost.slug,
      kicker: staticPost.kicker,
      category: staticPost.category,
      dateLabel: staticPost.date,
      readTime: staticPost.readTime,
      title: staticPost.title,
      summary: staticPost.summary,
      body: staticPost.body,
    };
    const adj = staticAdjacent(slug);
    previous = adj.previous ? { slug: adj.previous.slug, title: adj.previous.title } : null;
    next = adj.next ? { slug: adj.next.slug, title: adj.next.title } : null;
  }

  // skip body[0] if it's just the title repeated
  const displayBody = post.body[0]?.trim() === post.title.trim()
    ? post.body.slice(1)
    : post.body;

  return (
    <main className="shell article-shell-v2">
      <ReadingProgress />
      <article className="article-layout">
        <aside className="article-rail">
          <Link href="/writing" className="back-link">← 返回</Link>

          <div className="rail-divider" />

          {post.kicker && (
            <div className="rail-item">
              <span className="rail-label">标签</span>
              <span className="rail-value">{post.kicker}</span>
            </div>
          )}
          <div className="rail-item">
            <span className="rail-label">分类</span>
            <span className="rail-value">{post.category}</span>
          </div>
          <div className="rail-item">
            <span className="rail-label">日期</span>
            <span className="rail-value">{post.dateLabel}</span>
          </div>
          {post.readTime && (
            <div className="rail-item">
              <span className="rail-label">阅读</span>
              <span className="rail-value">{post.readTime}</span>
            </div>
          )}
        </aside>

        <div className="article-content">
          <header className="article-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <h1>{post.title}</h1>
              </div>
              <FullscreenButton />
            </div>
          </header>

          <div className="article-prose">
            {displayBody.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <nav className="article-pager" aria-label="文章切换">
            <div>
              <span className="pager-label">上一篇</span>
              {previous ? (
                <Link href={`/posts/${previous.slug}`}>{previous.title}</Link>
              ) : (
                <span className="pager-empty">已经是第一篇</span>
              )}
            </div>

            <div>
              <span className="pager-label">下一篇</span>
              {next ? (
                <Link href={`/posts/${next.slug}`}>{next.title}</Link>
              ) : (
                <span className="pager-empty">已经是最后一篇</span>
              )}
            </div>
          </nav>
        </div>
      </article>
    </main>
  );
}
