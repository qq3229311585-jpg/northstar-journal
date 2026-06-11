import PostForm from "../../components/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="admin-page-title">新建文章</h1>
      <PostForm mode="create" />
    </div>
  );
}
