import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  kind: text("kind", { enum: ["essay", "diary"] }).notNull(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull().default(""),
  dateLabel: text("date_label").notNull().default(""),
  readTime: text("read_time").notNull().default(""),
  kicker: text("kicker").notNull().default(""),
  body: text("body").notNull().default("[]"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
