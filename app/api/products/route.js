import { cookies } from "next/headers";
import { getProducts, isDbEnabled } from "../../../lib/catalog";
import { prisma } from "../../../lib/db";
import { ADMIN_COOKIE, verifyToken } from "../../../lib/auth";

// Always reflect the live catalog (no static caching) so admin edits show up.
export const dynamic = "force-dynamic";

function slugify(p) {
  return [p.name, p.storage, p.grade, p.color]
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

function authed() {
  return verifyToken(cookies().get(ADMIN_COOKIE)?.value);
}

// GET /api/products — public catalog
export async function GET() {
  const products = await getProducts();
  return Response.json(products);
}

// POST /api/products — create a product (staff only)
export async function POST(request) {
  if (!authed()) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isDbEnabled())
    return Response.json({ error: "Database not configured. Set DATABASE_URL." }, { status: 503 });

  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.color)
    return Response.json({ error: "Name and colour are required." }, { status: 400 });

  const id = body.id || slugify(body);
  const data = {
    id,
    brand: body.brand || "Apple",
    name: body.name,
    storage: body.storage || "128GB",
    grade: body.grade || "A",
    price: Number(body.price) || 0,
    color: body.color,
    image: body.image || "",
    tags: Array.isArray(body.tags) ? body.tags : [],
  };

  try {
    const created = await prisma.product.upsert({ where: { id }, update: data, create: data });
    return Response.json(created, { status: 201 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
