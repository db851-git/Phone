import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyToken, usingDefaultPassword } from "../../../../lib/auth";
import { isDbEnabled } from "../../../../lib/catalog";

export const dynamic = "force-dynamic";

// GET /api/admin/session — lets the admin UI know if the staff cookie is valid
// (httpOnly, so JS can't read it directly), plus environment hints.
export async function GET() {
  return Response.json({
    authed: verifyToken(cookies().get(ADMIN_COOKIE)?.value),
    dbEnabled: isDbEnabled(),
    defaultPassword: usingDefaultPassword(),
  });
}
