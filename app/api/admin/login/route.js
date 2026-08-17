import { cookies } from "next/headers";
import { ADMIN_COOKIE, checkPassword, makeToken } from "../../../../lib/auth";

export const dynamic = "force-dynamic";

// POST /api/admin/login { password } — sets the staff cookie on success.
export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!checkPassword(body?.password))
    return Response.json({ error: "Incorrect password" }, { status: 401 });

  cookies().set(ADMIN_COOKIE, makeToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return Response.json({ ok: true });
}

// DELETE /api/admin/login — log out.
export async function DELETE() {
  cookies().delete(ADMIN_COOKIE);
  return Response.json({ ok: true });
}
