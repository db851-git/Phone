import { cookies } from "next/headers";
import { prisma } from "../../../../lib/db";
import { getProductById, isDbEnabled } from "../../../../lib/catalog";
import { ADMIN_COOKIE, verifyToken } from "../../../../lib/auth";

export const dynamic = "force-dynamic";

function authed() {
  return verifyToken(cookies().get(ADMIN_COOKIE)?.value);
}

// GET /api/products/:id — public
export async function GET(_request, { params }) {
  const product = await getProductById(params.id);
  if (!product) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(product);
}

// PUT /api/products/:id — update (staff only)
export async function PUT(request, { params }) {
  if (!authed()) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isDbEnabled())
    return Response.json({ error: "Database not configured. Set DATABASE_URL." }, { status: 503 });

  const body = await request.json().catch(() => null);
  if (!body) return Response.json({ error: "Invalid body" }, { status: 400 });

  const images = Array.isArray(body.images) ? body.images.filter(Boolean) : [];
  const data = {
    brand: body.brand,
    name: body.name,
    storage: body.storage,
    grade: body.grade,
    price: Number(body.price) || 0,
    salePrice: body.salePrice === "" || body.salePrice == null ? null : Number(body.salePrice),
    color: body.color,
    description: body.description || "",
    images,
    image: images[0] || body.image || "",
    tags: Array.isArray(body.tags) ? body.tags : [],
    featured: Boolean(body.featured),
    stock: Number.isFinite(Number(body.stock)) ? Number(body.stock) : 1,
  };

  try {
    const updated = await prisma.product.update({ where: { id: params.id }, data });
    return Response.json(updated);
  } catch (e) {
    if (e.code === "P2025") return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// DELETE /api/products/:id — remove (staff only)
export async function DELETE(_request, { params }) {
  if (!authed()) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isDbEnabled())
    return Response.json({ error: "Database not configured. Set DATABASE_URL." }, { status: 503 });

  try {
    await prisma.product.delete({ where: { id: params.id } });
    return Response.json({ ok: true });
  } catch (e) {
    if (e.code === "P2025") return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ error: e.message }, { status: 500 });
  }
}
