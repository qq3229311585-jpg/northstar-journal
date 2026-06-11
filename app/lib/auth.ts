import { headers } from "next/headers";

// Set ADMIN_EMAIL env var in production, or override here for a personal blog.
const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ?? "4d68mrjqbr@privaterelay.appleid.com";

export async function getAuthEmail(): Promise<string | null> {
  const h = await headers();
  return h.get("oai-authenticated-user-email");
}

export async function isAdmin(): Promise<boolean> {
  // In local development the OAI header is absent; allow access.
  if (process.env.NODE_ENV === "development") return true;
  const email = await getAuthEmail();
  return email === ADMIN_EMAIL;
}
