import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "../lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ok = await isAdmin();
  if (!ok) redirect("/");

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <Link href="/" className="admin-brand">
          ← 北辰笔记
        </Link>
        <nav className="admin-nav">
          <Link href="/admin">文章列表</Link>
          <Link href="/admin/posts/new">新建文章</Link>
        </nav>
      </header>
      <main className="admin-main">{children}</main>
    </div>
  );
}
