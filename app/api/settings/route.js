import { cookies } from "next/headers";
import { getOffer, getSetting, setSetting } from "../../../lib/settings";
import { isDbEnabled } from "../../../lib/catalog";
import { ADMIN_COOKIE, verifyToken } from "../../../lib/auth";
import { DEFAULT_TRADEIN } from "../../../lib/products";

export const dynamic = "force-dynamic";

// GET /api/settings — public site settings (offer banner + trade-in multipliers)
export async function GET() {
  const [offer, tradeIn] = await Promise.all([
    getOffer(),
    getSetting("tradeIn", DEFAULT_TRADEIN),
  ]);
  return Response.json({ offer, tradeIn });
}

// PUT /api/settings { key, value } — update one setting (staff only)
export async function PUT(request) {
  if (!verifyToken(cookies().get(ADMIN_COOKIE)?.value))
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isDbEnabled())
    return Response.json({ error: "Database not configured. Set DATABASE_URL." }, { status: 503 });

  const body = await request.json().catch(() => null);
  if (!body?.key) return Response.json({ error: "Missing key" }, { status: 400 });
  try {
    await setSetting(body.key, body.value);
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
