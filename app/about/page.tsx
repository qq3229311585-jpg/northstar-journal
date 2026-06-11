export default function AboutPage() {
  return (
    <main className="shell about-page">
      <div className="page-intro">
        <p className="section-kicker">关于</p>
        <h1 className="page-title">这个站不是展示“我做了什么”，而是收纳“我为什么还想继续写”。</h1>
      </div>

      <div className="about-layout">
        <div className="about-block">
          <h2>写法</h2>
          <p>
            这里保留长文章，也保留那些只来得及写下一小段的摘页。它们不一定都完整，
            但都应该是当时真实留下来的痕迹。
          </p>
        </div>

        <div className="about-block">
          <h2>界面</h2>
          <p>
            这次改版刻意减少了模板感，不再把首页做成拼接卡片，而是让标题、目录和正文各自回到该有的位置。
          </p>
        </div>

        <div className="about-block">
          <h2>方向</h2>
          <p>
            我更希望它慢一点，但耐看一点。比起“功能很多”，更重要的是它能不能成为一个以后还愿意继续打开的地方。
          </p>
        </div>
      </div>
    </main>
  );
}
