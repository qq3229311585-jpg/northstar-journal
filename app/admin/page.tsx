import Link from "next/link";
import { getAllPostsAdmin } from "../lib/db-posts";
import SeedButton from "./components/SeedButton";

export default async function AdminPage() {
  let posts: Awaited<ReturnType<typeof getAllPostsAdmin>> = [];
  let dbError = "";

  try {
    posts = await getAllPostsAdmin();
  } catch (e) {
    dbError = e instanceof Error ? e.message : String(e);
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1>文章管理</h1>
        <div className="admin-page-actions">
          <SeedButton />
          <Link href="/admin/posts/new" className="admin-btn-primary">
            + 新建文章
          </Link>
        </div>
      </div>

      {dbError && (
        <div className="admin-notice admin-notice-warn">
          <strong>数据库未就绪：</strong> {dbError}
          <br />
          <small>
            请先运行 <code>npm run db:generate</code> 生成迁移，然后点击右上角"从静态数据导入"。
          </small>
        </div>
      )}

      {!dbError && posts.length === 0 && (
        <div className="admin-notice">
          数据库为空，点击右上角"从静态数据导入"以导入默认文章。
        </div>
      )}

      {posts.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>标题</th>
              <th>类型</th>
              <th>分类</th>
              <th>状态</th>
              <th>日期</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className={post.published ? "" : "admin-row-draft"}>
                <td>
                  <span className="admin-post-title">{post.title}</span>
                  <span className="admin-post-slug">/{post.slug}</span>
                </td>
                <td>{post.kind === "essay" ? "随笔" : "摘页"}</td>
                <td>{post.category}</td>
                <td>
                  <span className={`admin-badge ${post.published ? "published" : "draft"}`}>
                    {post.published ? "已发布" : "草稿"}
                  </span>
                  {post.featured && <span className="admin-badge featured">置顶</span>}
                </td>
                <td>{post.dateLabel}</td>
                <td>
                  <Link href={`/admin/posts/${post.slug}/edit`} className="admin-link">
                    编辑
                  </Link>
                  <Link href={`/posts/${post.slug}`} className="admin-link" target="_blank">
                    查看
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
