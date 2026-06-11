import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell not-found-page">
      <p className="section-kicker">404</p>
      <h1 className="page-title">这一页没有找到，也许它还没被写出来。</h1>
      <p className="not-found-copy">
        你可以先回首页，或者去文章列表里看看别的内容。
      </p>
      <div className="action-row">
        <Link href="/" className="solid-link">
          返回首页
        </Link>
        <Link href="/writing" className="ghost-link">
          去文章页
        </Link>
      </div>
    </main>
  );
}
