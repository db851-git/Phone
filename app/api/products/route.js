import { products } from "../../../lib/products";

// Public catalog endpoint. GET /api/products returns the live inventory as JSON,
// so the storefront, a mobile app, or an external system can all read from one
// source of truth (data/products.json).
export const dynamic = "force-static";

export async function GET() {
  return Response.json(products, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
