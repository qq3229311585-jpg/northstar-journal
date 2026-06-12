'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLinks() {
  const pathname = usePathname();
  const onArticle = pathname.startsWith('/posts');
  return (
    <nav className="site-nav" aria-label="主导航">
      <Link
        href="/writing"
        data-active={(pathname.startsWith('/writing') || onArticle) ? 'true' : undefined}
      >
        文章
      </Link>
      <Link
        href="/diary"
        data-active={pathname.startsWith('/diary') ? 'true' : undefined}
      >
        摘页
      </Link>
      <Link
        href="/about"
        data-active={pathname === '/about' ? 'true' : undefined}
      >
        关于
      </Link>
    </nav>
  );
}
