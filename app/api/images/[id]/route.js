import { prisma } from "../../../../lib/db";
import { isDbEnabled } from "../../../../lib/catalog";

export const dynamic = "force-dynamic";

// GET /api/images/:id — serve an uploaded photo. Public; content is immutable
// per id, so it can be cached aggressively.
export async function GET(_request, { params }) {
  if (!isDbEnabled()) return new Response("Not found", { status: 404 });
  try {
    const img = await prisma.image.findUnique({ where: { id: params.id } });
    if (!img) return new Response("Not found", { status: 404 });
    return new Response(img.data, {
      headers: {
        "Content-Type": img.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (e) {
    return new Response("Error", { status: 500 });
  }
}
