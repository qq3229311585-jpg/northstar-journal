import Link from "next/link";
import { getAllPosts, parseBody } from "./lib/db-posts";
import { diaryPosts, essayPosts, featuredPost } from "./content";
import { cleanSummary } from "./lib/summary";

type DbPost = Awaited<ReturnType<typeof getAllPosts>>[number];

function adaptDbPost(p: DbPost) {
  return {
    slug: p.slug,
    kind: p.kind,
    category: p.category,
    title: p.title,
    summary: p.summary,
    date: p.dateLabel,
    readTime: p.readTime,
    kicker: p.kicker,
    body: parseBody(p.body),
    featured: p.featured,
  };
}

const diaryQuotes = [
  "不放下，也许是最好的放下。",
  "故事原本就没有结局，当然也不需要。",
  "有些人一眼万年，有些人遗臭千古。",
];

export default async function Home() {
  let allPosts: ReturnType<typeof adaptDbPost>[] = [];
  let useStatic = false;

  try {
    const rows = await getAllPosts();
    allPosts = rows.map(adaptDbPost);
  } catch {
    useStatic = true;
    allPosts = [...essayPosts, ...diaryPosts].map((p) => ({
      ...p,
      featured: p.featured ?? false,
    }));
  }

  const featured =
    allPosts.find((p) => p.featured) ?? (useStatic ? featuredPost : allPosts[0]);
  const essays = allPosts.filter((p) => p.kind === "essay");
  const diaries = allPosts.filter((p) => p.kind === "diary").slice(0, 8);

  if (!featured) {
    return (
      <main className="shell home-shell">
        <p className="muted-hint">暂无文章。</p>
      </main>
    );
  }

  return (
    <main className="shell home-shell">
      <section className="masthead">
        <div className="masthead-hero">
          <p className="section-kicker">北辰笔记 · 首页</p>
          <h1 className="masthead-title">
            <span>把那些</span>
            <span className="accent-line">没有立刻消失的</span>
            <span className="accent-line">念头，收起来.</span>
          </h1>
          <span className="masthead-deco" aria-hidden="true">01</span>
        </div>

        <div className="masthead-base">
          <div className="action-row">
            <Link href={`/posts/${featured.slug}`} className="solid-link">
              进入主文章
            </Link>
            <Link href="/writing" className="ghost-link">
              查看全部文章
            </Link>
          </div>
        </div>
      </section>

      <section className="feature-band">
        <div className="feature-copy">
          <p className="section-kicker">{featured.kicker}</p>
          <Link href={`/posts/${featured.slug}`} className="feature-link">
            <h2>{featured.title}</h2>
            <p>{cleanSummary(featured.summary, featured.title)}</p>
          </Link>
        </div>

        <ul className="note-list">
          {diaryQuotes.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </section>

      {essays.length > 0 && (
        <section className="list-section">
          <div className="section-heading-row">
            <div>
              <p className="section-kicker">文章</p>
              <h2 className="section-title">完整写完的，不多，但都算数。</h2>
            </div>
            <Link href="/writing" className="text-link">
              全部文章
            </Link>
          </div>

          <div className="editorial-list">
            {essays.map((post, index) => (
              <Link href={`/posts/${post.slug}`} key={post.slug} className="list-row">
                <div className="row-index">{String(index + 1).padStart(2, "0")}</div>
                <div className="row-main">
                  <p className="row-meta">
                    <span>{post.category}</span>
                    <span>{post.date}</span>
                  </p>
                  <h3>{post.title}</h3>
                </div>
                <p className="row-summary">{cleanSummary(post.summary, post.title)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {diaries.length > 0 && (
        <section className="diary-section-v2">
          <div className="section-heading-row">
            <div>
              <p className="section-kicker">摘页</p>
              <h2 className="section-title">碎片，也算是那段时间的全部。</h2>
            </div>
            <Link href="/diary" className="text-link">
              更多摘页
            </Link>
          </div>

          <div className="diary-stack">
            {diaries.map((post) => (
              <Link href={`/posts/${post.slug}`} key={post.slug} className="diary-row">
                <div className="diary-row-meta">
                  <span>{post.kicker}</span>
                  <span>{post.date}</span>
                </div>
                <div className="diary-row-main">
                  <h3>{post.title}</h3>
                  <p>{cleanSummary(post.summary, post.title)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
