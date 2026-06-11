import { notFound } from "next/navigation";
import { getPostBySlug } from "../../../../lib/db-posts";
import PostForm from "../../../components/PostForm";

type Props = { params: Promise<{ slug: string }> };

export default async function EditPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) notFound();

  return (
    <div>
      <h1 className="admin-page-title">编辑文章</h1>
      <PostForm
        mode="edit"
        initial={{
          id: post.id,
          slug: post.slug,
          kind: post.kind,
          category: post.category,
          title: post.title,
          summary: post.summary,
          dateLabel: post.dateLabel,
          readTime: post.readTime,
          kicker: post.kicker,
          body: post.body,
          featured: post.featured,
          published: post.published,
          sortOrder: post.sortOrder,
        }}
      />
    </div>
  );
}
