import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

// Dynamic import defers cloudflare:workers resolution to call time so the
// built bundle can be loaded by Node.js (vinext prod-server). On VPS the
// import rejects at runtime and callers fall back to static data.
export async function getDb() {
  const { env } = await import("cloudflare:workers");
  const db = (env as { DB?: D1Database }).DB;
  if (!db) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB`."
    );
  }
  return drizzle(db, { schema });
}
