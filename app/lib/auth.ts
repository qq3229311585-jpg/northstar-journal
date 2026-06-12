import { headers, cookies } from "next/headers";

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ?? "4d68mrjqbr@privaterelay.appleid.com";

// VPS 密码登录，可通过环境变量 ADMIN_PASSWORD 覆盖
export const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD ?? "northstar2026";

export async function getAuthEmail(): Promise<string | null> {
  const h = await headers();
  return h.get("oai-authenticated-user-email");
}

export async function isAdmin(): Promise<boolean> {
  if (process.env.NODE_ENV === "development") return true;
  // OpenAI Sites：检查邮件头
  const email = await getAuthEmail();
  if (email === ADMIN_EMAIL) return true;
  // VPS：检查 cookie 里的密码 token
  const jar = await cookies();
  const token = jar.get("admin_token")?.value;
  return token === ADMIN_PASSWORD;
}
