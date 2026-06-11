import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Mono } from "next/font/google";
import { site } from "./content";
import { GlobalFullscreen } from "./components/GlobalFullscreen";
import "./globals.css";

// Only IBM Plex Mono goes through next/font (Latin-only, small).
// ZCOOL XiaoWei and Noto Sans SC are loaded via CSS @import in globals.css
// to avoid the server-side fetch failure inside Cloudflare Workers (miniflare).
const monoFont = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={monoFont.variable}>
        <div className="site-frame">
          <header className="site-header">
            <div className="shell header-shell">
              <Link href="/" className="brand">
                <span className="brand-title">{site.name}</span>
                <span className="brand-sub">把句子慢慢收起来</span>
              </Link>

              <nav className="site-nav" aria-label="主导航">
                <Link href="/writing">文章</Link>
                <Link href="/diary">摘页</Link>
                <Link href="/about">关于</Link>
              </nav>

              <GlobalFullscreen />
            </div>
          </header>

          {children}

          <footer className="site-footer">
            <div className="shell footer-shell">
              <div>
                <p className="footer-title">{site.name}</p>
                <p className="footer-text">
                  一个更克制的中文博客，写随笔、短记和那些没有立刻消失的念头。
                </p>
              </div>

              <div className="footer-links">
                <Link href="/writing">全部文章</Link>
                <Link href="/diary">日记摘页</Link>
                <Link href="/about">站点说明</Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
