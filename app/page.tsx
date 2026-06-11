import Link from "next/link";
import { getAllPosts, parseBody } from "./lib/db-posts";
import { diaryPosts, essayPosts, featuredPost } from "./content";
import { TitleFullscreen } from "./components/TitleFullscreen";

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

const homeNotes = [
  "首页不再堆卡片，而是让信息有前后顺序。",
  "正文页、摘页页和关于页共用同一套视觉节奏。",
  "每篇内容都能点进去，不再只是停在展示层。",
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
  const diaries = allPosts.filter((p) => p.kind === "diary");

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
          <TitleFullscreen>
            <h1 className="masthead-title">
              <span>做一个更安静的站，</span>
              <span className="accent-line">让句子比界面</span>
              <span className="accent-line">更先被记住.</span>
            </h1>
          </TitleFullscreen>
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
            <p>{featured.summary}</p>
          </Link>
        </div>

        <ul className="note-list">
          {homeNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      {essays.length > 0 && (
        <section className="list-section">
          <div className="section-heading-row">
            <div>
              <p className="section-kicker">文章</p>
              <h2 className="section-title">像目录一样安静，也像目录一样清楚。</h2>
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
                <p className="row-summary">{post.summary}</p>
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
              <h2 className="section-title">保留一些未经修饰的记录，让网站不只是一个门面。</h2>
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
                  <p>{post.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
