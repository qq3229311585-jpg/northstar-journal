import * as schema from "./schema";

export async function getDb() {
  // 优先尝试 Cloudflare D1
  try {
    const { env } = await import("cloudflare:workers");
    const { drizzle } = await import("drizzle-orm/d1");
    const db = (env as { DB?: D1Database }).DB;
    if (db) return drizzle(db, { schema });
  } catch {
    // 不在 Cloudflare Workers 环境
  }

  // VPS 回落到本地 SQLite
  const { default: Database } = await import("better-sqlite3");
  const { drizzle } = await import("drizzle-orm/better-sqlite3");
  const dbPath = process.env.DB_PATH ?? "/opt/northstar-journal-zh/blog.db";
  const sqlite = new Database(dbPath);

  // 确保表存在
  sqlite.exec(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    kind TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '',
    title TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    date_label TEXT NOT NULL DEFAULT '',
    read_time TEXT NOT NULL DEFAULT '',
    kicker TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '[]',
    featured INTEGER NOT NULL DEFAULT 0,
    published INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);

  return drizzle(sqlite, { schema });
}
