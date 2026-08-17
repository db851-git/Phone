// Server-only catalog access. The database is the source of truth when
// DATABASE_URL is configured; otherwise (or if the DB is unreachable) we fall
// back to the seed file so the site always renders. Never import this from a
// client component — it pulls in Prisma.
import "server-only";
import { seedProducts } from "./products";

let cachedPrisma = null;
function db() {
  if (!process.env.DATABASE_URL) return null;
  if (!cachedPrisma) {
    // Lazy import so builds without a DB don't need the client at module load.
    const { prisma } = require("./db");
    cachedPrisma = prisma;
  }
  return cachedPrisma;
}

// Shape a Prisma row to the plain product object the UI expects.
function toProduct(row) {
  const images = row.images || [];
  return {
    id: row.id,
    brand: row.brand,
    name: row.name,
    storage: row.storage,
    grade: row.grade,
    price: row.price,
    color: row.color,
    description: row.description || "",
    image: row.image || images[0] || "",
    images,
    tags: row.tags || [],
    featured: Boolean(row.featured),
    stock: typeof row.stock === "number" ? row.stock : 1,
  };
}

export async function getProducts() {
  const client = db();
  if (!client) return seedProducts;
  try {
    const rows = await client.product.findMany({ orderBy: { price: "desc" } });
    return rows.length ? rows.map(toProduct) : seedProducts;
  } catch (e) {
    console.error("[catalog] DB read failed, serving seed data:", e.message);
    return seedProducts;
  }
}

export async function getProductById(id) {
  const client = db();
  if (!client) return seedProducts.find((p) => p.id === id) || null;
  try {
    const row = await client.product.findUnique({ where: { id } });
    return row ? toProduct(row) : null;
  } catch (e) {
    console.error("[catalog] DB read failed, serving seed data:", e.message);
    return seedProducts.find((p) => p.id === id) || null;
  }
}

export function isDbEnabled() {
  return Boolean(process.env.DATABASE_URL);
}
