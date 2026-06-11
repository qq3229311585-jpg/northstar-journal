const featuredPost = {
  category: "Field Note",
  title: "What I Learned From Rebuilding a Bare-Metal Blog Instead of Tweaking It",
  date: "June 11, 2026",
  readTime: "8 min read",
  summary:
    "A resilient blog starts with structure: clean information design, stronger hosting assumptions, and enough atmosphere to make the writing feel intentional.",
};

const recentPosts = [
  {
    index: "01",
    category: "Writing System",
    title: "A calm homepage can still feel premium",
    excerpt:
      "Editorial hierarchy, generous spacing, and bolder typography outperform most template-heavy blog layouts.",
    date: "June 09, 2026",
  },
  {
    index: "02",
    category: "Infra",
    title: "The quiet work behind a trustworthy personal site",
    excerpt:
      "HTTPS, stable deploys, metadata, and predictable mobile behavior do more for credibility than decorative widgets.",
    date: "June 04, 2026",
  },
  {
    index: "03",
    category: "Notes",
    title: "From one lonely post to a publishable archive",
    excerpt:
      "A better blog is not only prettier. It helps future writing feel easier to draft, browse, and revisit.",
    date: "May 28, 2026",
  },
];

const principles = [
  "Sharper reading rhythm with clearer category, date, and excerpt hierarchy.",
  "Mobile-first spacing and responsive cards instead of desktop-only composition.",
  "Stronger launch readiness with SEO metadata, icon support, and cleaner structure.",
];

const archive = [
  ["Essay", "On building slower, cleaner personal sites", "May 2026"],
  ["Setup", "Why a rebuild beat patching the old Python service", "May 2026"],
  ["Journal", "基础是无聊，无理由的无聊", "May 2026"],
];

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-backdrop" />
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Editorial Rebuild</p>
            <h1>
              A more memorable blog,
              <span> rebuilt for reading instead of merely existing.</span>
            </h1>
            <p className="hero-summary">
              This version turns the original bare service into a more polished
              editorial site: better rhythm, clearer hierarchy, stronger launch
              signals, and a homepage that feels like it belongs to a real
              writer.
            </p>
            <div className="hero-actions">
              <a href="#featured" className="primary-link">
                Read the lead story
              </a>
              <a href="#archive" className="secondary-link">
                Browse the archive
              </a>
            </div>
          </div>

          <aside className="hero-panel">
            <p className="panel-label">What changed</p>
            <ul className="panel-list">
              {principles.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="featured-section" id="featured">
        <div className="section-heading">
          <p className="eyebrow">Featured Story</p>
          <h2>Lead with a point of view, not a pile of widgets.</h2>
        </div>

        <article className="featured-card">
          <div className="featured-meta">
            <span>{featuredPost.category}</span>
            <span>{featuredPost.date}</span>
            <span>{featuredPost.readTime}</span>
          </div>
          <h3>{featuredPost.title}</h3>
          <p>{featuredPost.summary}</p>
        </article>
      </section>

      <section className="recent-section">
        <div className="section-heading">
          <p className="eyebrow">Recent Posts</p>
          <h2>Designed to make new writing feel inevitable.</h2>
        </div>

        <div className="recent-grid">
          {recentPosts.map((post) => (
            <article className="post-card" key={post.index}>
              <div className="post-topline">
                <span>{post.index}</span>
                <span>{post.category}</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <span className="post-date">{post.date}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="split-section" id="archive">
        <div className="manifesto-card">
          <p className="eyebrow">Publishing Direction</p>
          <h2>Built for essays, notes, and small archives that age well.</h2>
          <p>
            The new shell keeps the visuals expressive without drowning the
            content. That makes it easier to grow this into a serious personal
            blog instead of a one-page placeholder.
          </p>
        </div>

        <div className="archive-card">
          <p className="eyebrow">Archive Preview</p>
          <div className="archive-list">
            {archive.map(([type, title, month]) => (
              <div className="archive-row" key={title}>
                <span>{type}</span>
                <strong>{title}</strong>
                <time>{month}</time>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
