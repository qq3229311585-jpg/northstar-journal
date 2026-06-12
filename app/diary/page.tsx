import Link from "next/link";
import { getAllPosts } from "../lib/db-posts";
import { diaryPosts } from "../content";
import { cleanSummary } from "../lib/summary";

type DiaryPost = {
  slug: string;
  kicker: string;
  dateLabel: string;
  title: string;
  summary: string;
};

export default async function DiaryPage() {
  let posts: DiaryPost[] = [];

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

  // sort by date descending, group by year
  const sorted = [...posts].sort((a, b) => b.dateLabel.localeCompare(a.dateLabel));
  const byYear: Record<string, DiaryPost[]> = {};
  for (const p of sorted) {
    const year = p.dateLabel.slice(0, 4);
    if (!byYear[year]) byYear[year] = [];
    byYear[year].push(p);
  }
  const years = Object.keys(byYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <main className="shell list-page">
      <div className="page-intro">
        <p className="section-kicker">日记摘页</p>
        <h1 className="page-title">碎片，也算是那段时间的全部。</h1>
      </div>

      <div className="diary-year-nav">
        {years.map((y) => (
          <a key={y} href={`#year-${y}`} className="year-anchor">{y}</a>
        ))}
      </div>

      {years.map((year) => (
        <section key={year} id={`year-${year}`} className="diary-year-group">
          <div className="diary-year-label">{year}</div>
          <div className="diary-stack">
            {byYear[year].map((post) => (
              <Link href={`/posts/${post.slug}`} key={post.slug} className="diary-row">
                <div className="diary-row-meta">
                  <span>{post.kicker}</span>
                  <span>{post.dateLabel}</span>
                </div>
                <div className="diary-row-main">
                  <h2>{post.title}</h2>
                  <p>{cleanSummary(post.summary, post.title)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
