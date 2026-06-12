import { NextRequest, NextResponse } from "next/server";
import { ADMIN_PASSWORD } from "../../../lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_token", ADMIN_PASSWORD, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30天
    path: "/",
  });
  return res;
}
