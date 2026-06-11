"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FormData = {
  slug: string;
  kind: "essay" | "diary";
  category: string;
  title: string;
  summary: string;
  dateLabel: string;
  readTime: string;
  kicker: string;
  body: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

type Props = {
  initial?: Partial<FormData> & { id?: number };
  mode: "create" | "edit";
};

const EMPTY: FormData = {
  slug: "",
  kind: "essay",
  category: "",
  title: "",
  summary: "",
  dateLabel: "",
  readTime: "",
  kicker: "",
  body: "",
  featured: false,
  published: true,
  sortOrder: 0,
};

export default function PostForm({ initial, mode }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    ...EMPTY,
    ...initial,
    body: initial?.body
      ? (() => {
          try {
            const arr = JSON.parse(initial.body) as string[];
            return arr.join("\n\n");
          } catch {
            return initial.body;
          }
        })()
      : "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const paragraphs = form.body
      .split(/\n{2,}/)
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...form,
      ...(mode === "edit" && initial?.id ? { id: initial.id } : {}),
      body: JSON.stringify(paragraphs),
    };

    const res = await fetch("/api/admin/posts", {
      method: mode === "create" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = (await res.json()) as { error?: string };
    setSaving(false);

    if (!res.ok) {
      setError(json.error ?? "保存失败");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm("确认删除这篇文章？")) return;
    await fetch(`/api/admin/posts?id=${initial.id}`, { method: "DELETE" });
    router.push("/admin");
    router.refresh();
  }

  const field = (
    label: string,
    key: keyof FormData,
    opts?: { type?: string; placeholder?: string; required?: boolean }
  ) => (
    <label className="admin-field">
      <span>{label}</span>
      <input
        type={opts?.type ?? "text"}
        value={String(form[key])}
        placeholder={opts?.placeholder}
        required={opts?.required}
        onChange={(e) => set(key, e.target.value as FormData[keyof FormData])}
      />
    </label>
  );

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="admin-form-grid">
        {field("标题", "title", { required: true, placeholder: "文章标题" })}
        {field("Slug", "slug", {
          required: mode === "create",
          placeholder: "url-friendly-slug",
        })}

        <label className="admin-field">
          <span>类型</span>
          <select
            value={form.kind}
            onChange={(e) => set("kind", e.target.value as "essay" | "diary")}
          >
            <option value="essay">随笔 essay</option>
            <option value="diary">摘页 diary</option>
          </select>
        </label>

        {field("分类", "category", { placeholder: "写作与界面" })}
        {field("Kicker 标注", "kicker", { placeholder: "主文章 / 最近文章 / 摘页" })}
        {field("日期显示", "dateLabel", { placeholder: "2026 年 6 月 11 日" })}
        {field("阅读时间", "readTime", { placeholder: "5 分钟" })}
        {field("排序权重", "sortOrder", { type: "number" })}
      </div>

      <label className="admin-field">
        <span>摘要</span>
        <textarea
          value={form.summary}
          rows={2}
          onChange={(e) => set("summary", e.target.value)}
          placeholder="一句话描述"
        />
      </label>

      <label className="admin-field">
        <span>正文（段落间空一行）</span>
        <textarea
          value={form.body}
          rows={14}
          onChange={(e) => set("body", e.target.value)}
          placeholder="第一段内容

第二段内容"
          required
        />
      </label>

      <div className="admin-checks">
        <label>
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set("featured", e.target.checked)}
          />
          置顶主文章
        </label>
        <label>
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => set("published", e.target.checked)}
          />
          已发布
        </label>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-actions">
        <button type="submit" className="admin-btn-primary" disabled={saving}>
          {saving ? "保存中…" : mode === "create" ? "发布文章" : "保存修改"}
        </button>
        <button
          type="button"
          className="admin-btn-ghost"
          onClick={() => router.push("/admin")}
        >
          取消
        </button>
        {mode === "edit" && (
          <button
            type="button"
            className="admin-btn-danger"
            onClick={handleDelete}
          >
            删除
          </button>
        )}
      </div>
    </form>
  );
}
