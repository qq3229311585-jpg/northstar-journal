const featuredPost = {
  category: "主文章",
  title: "与其修补一个能用的旧博客，不如认真重做一个真正适合写作的版本",
  date: "2026 年 6 月 11 日",
  readTime: "阅读 8 分钟",
  summary:
    "一个耐看的博客，靠的不是花哨组件，而是清楚的信息层次、稳定的发布结构，以及让文字愿意被认真读完的页面气质。",
};

const recentPosts = [
  {
    index: "01",
    category: "写作系统",
    title: "安静的首页，也可以很有质感",
    excerpt:
      "真正撑起博客气质的，往往不是复杂功能，而是更好的排版节奏、留白和标题层级。",
    date: "2026 年 6 月 9 日",
  },
  {
    index: "02",
    category: "站点架构",
    title: "一个让人信任的个人网站，背后都有哪些安静的工作",
    excerpt:
      "HTTPS、稳定部署、元信息和移动端体验，往往比装饰性的模块更能提升整体可信度。",
    date: "2026 年 6 月 4 日",
  },
  {
    index: "03",
    category: "随笔记录",
    title: "从一篇孤零零的文章，到一个愿意持续更新的归档",
    excerpt:
      "更好的博客不只是更好看，它还会让未来的写作更容易开始、更方便整理，也更值得回看。",
    date: "2026 年 5 月 28 日",
  },
];

const principles = [
  "分类、日期、摘要层级更清楚，阅读节奏更顺。",
  "优先照顾手机端浏览，不再只适合桌面宽屏。",
  "补齐 SEO、图标和发布结构，站点完整度更高。",
];

const archive = [
  ["长文", "慢一点，反而更像自己的个人网站", "2026 年 5 月"],
  ["搭建", "为什么这次我选择重建，而不是继续修旧服务", "2026 年 5 月"],
  ["手记", "基础是无聊，无理由的无聊", "2026 年 5 月"],
];

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-backdrop" />
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">中文版重构</p>
            <h1>
              一个更像样的中文博客，
              <span> 不是能打开就行，而是值得认真阅读。</span>
            </h1>
            <p className="hero-summary">
              这次改版不是把旧页面换个皮，而是把它重做成更适合中文阅读的博客首页：
              节奏更稳，层次更清楚，首屏更有内容感，也更像一个真正会持续写下去的个人站点。
            </p>
            <div className="hero-actions">
              <a href="#featured" className="primary-link">
                先看主文章
              </a>
              <a href="#archive" className="secondary-link">
                看看归档
              </a>
            </div>
          </div>

          <aside className="hero-panel">
            <p className="panel-label">这次改了什么</p>
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
          <p className="eyebrow">主文章</p>
          <h2>首页先表达观点，而不是先堆一排功能模块。</h2>
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
          <p className="eyebrow">最近更新</p>
          <h2>让新的写作更自然地出现，而不是总停在想法阶段。</h2>
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
          <p className="eyebrow">写作方向</p>
          <h2>适合长文、随笔和慢慢积累起来的小型归档。</h2>
          <p>
            新的页面风格保留了足够的气质，但不会压住内容本身。这样它更容易从一个展示页，
            长成一个真正能长期更新、长期回看的个人博客，而不是一张只放着一篇文章的门面。
          </p>
        </div>

        <div className="archive-card">
          <p className="eyebrow">归档预览</p>
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
