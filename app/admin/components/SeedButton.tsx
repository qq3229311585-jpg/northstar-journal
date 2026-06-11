"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SeedButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSeed() {
    setLoading(true);
    setMsg("");
    const res = await fetch("/api/admin/seed", { method: "POST" });
    const json = (await res.json()) as { message?: string; seeded?: number; error?: string };
    setLoading(false);
    if (json.error) {
      setMsg(`错误: ${json.error}`);
    } else if (json.message) {
      setMsg(json.message);
    } else {
      setMsg(`已导入 ${json.seeded} 篇文章`);
      router.refresh();
    }
  }

  return (
    <span className="admin-seed-wrap">
      <button
        onClick={handleSeed}
        disabled={loading}
        className="admin-btn-ghost"
        title="将 content.ts 中的静态文章导入数据库（仅首次）"
      >
        {loading ? "导入中…" : "从静态数据导入"}
      </button>
      {msg && <span className="admin-seed-msg">{msg}</span>}
    </span>
  );
}
