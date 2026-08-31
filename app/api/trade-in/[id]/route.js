import { cookies } from "next/headers";
import { prisma } from "../../../../lib/db";
import { isDbEnabled } from "../../../../lib/catalog";
import { ADMIN_COOKIE, verifyToken } from "../../../../lib/auth";

export const dynamic = "force-dynamic";

function authed() {
  return verifyToken(cookies().get(ADMIN_COOKIE)?.value);
}

// PUT /api/trade-in/:id — update a buy-back model (staff only)
export async function PUT(request, { params }) {
  if (!authed()) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isDbEnabled())
    return Response.json({ error: "Database not configured. Set DATABASE_URL." }, { status: 503 });

  const body = await request.json().catch(() => null);
  if (!body) return Response.json({ error: "Invalid body" }, { status: 400 });
  try {
    const updated = await prisma.tradeInModel.update({
      where: { id: params.id },
      data: {
        name: body.name,
        brand: body.brand,
        baseValue: Number(body.baseValue) || 0,
        active: body.active !== false,
        sortOrder: Number(body.sortOrder) || 0,
      },
    });
    return Response.json(updated);
  } catch (e) {
    if (e.code === "P2025") return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// DELETE /api/trade-in/:id — remove a buy-back model (staff only)
export async function DELETE(_request, { params }) {
  if (!authed()) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isDbEnabled())
    return Response.json({ error: "Database not configured. Set DATABASE_URL." }, { status: 503 });
  try {
    await prisma.tradeInModel.delete({ where: { id: params.id } });
    return Response.json({ ok: true });
  } catch (e) {
    if (e.code === "P2025") return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ error: e.message }, { status: 500 });
  }
}
