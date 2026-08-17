import { cookies } from "next/headers";
import { prisma } from "../../../lib/db";
import { isDbEnabled } from "../../../lib/catalog";
import { ADMIN_COOKIE, verifyToken } from "../../../lib/auth";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// POST /api/images  { dataUrl: "data:image/jpeg;base64,..." }  (staff only)
// Stores the uploaded photo in the database and returns its served URL.
export async function POST(request) {
  if (!verifyToken(cookies().get(ADMIN_COOKIE)?.value))
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isDbEnabled())
    return Response.json({ error: "Database not configured. Set DATABASE_URL." }, { status: 503 });

  const body = await request.json().catch(() => null);
  const dataUrl = body?.dataUrl;
  const match = /^data:([\w/+.-]+);base64,(.+)$/.exec(dataUrl || "");
  if (!match) return Response.json({ error: "Invalid image data" }, { status: 400 });

  const contentType = match[1];
  const buffer = Buffer.from(match[2], "base64");

  // Guard against oversized payloads (client already compresses to ~<1.5MB).
  if (buffer.length > 6 * 1024 * 1024)
    return Response.json({ error: "Image too large (max 6MB)" }, { status: 413 });
  if (!contentType.startsWith("image/"))
    return Response.json({ error: "Not an image" }, { status: 400 });

  try {
    const img = await prisma.image.create({ data: { contentType, data: buffer } });
    return Response.json({ url: `/api/images/${img.id}`, id: img.id }, { status: 201 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
