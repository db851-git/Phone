import { cookies } from "next/headers";
import { prisma } from "../../../lib/db";
import { getTradeInConfig } from "../../../lib/settings";
import { isDbEnabled } from "../../../lib/catalog";
import { ADMIN_COOKIE, verifyToken } from "../../../lib/auth";

export const dynamic = "force-dynamic";

function authed() {
  return verifyToken(cookies().get(ADMIN_COOKIE)?.value);
}

// GET /api/trade-in — public: buy-back models + multipliers for the Sell page
export async function GET() {
  const cfg = await getTradeInConfig();
  return Response.json(cfg);
}

// POST /api/trade-in — add a buy-back model (staff only)
export async function POST(request) {
  if (!authed()) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isDbEnabled())
    return Response.json({ error: "Database not configured. Set DATABASE_URL." }, { status: 503 });

  const body = await request.json().catch(() => null);
  if (!body?.name) return Response.json({ error: "Name is required" }, { status: 400 });
  try {
    const created = await prisma.tradeInModel.create({
      data: {
        name: body.name,
        brand: body.brand || "Apple",
        baseValue: Number(body.baseValue) || 0,
        active: body.active !== false,
        sortOrder: Number(body.sortOrder) || 0,
      },
    });
    return Response.json(created, { status: 201 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
