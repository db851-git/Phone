// Seed the database from data/products.json.
// Run with: npm run db:seed
import { PrismaClient } from "@prisma/client";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const prisma = new PrismaClient();
const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  // Only seed products into an EMPTY catalog, so re-running (e.g. on every
  // deploy) never resurrects products the shop has since deleted.
  const existing = await prisma.product.count();
  if (existing === 0) {
    const raw = await readFile(join(__dirname, "..", "data", "products.json"), "utf8");
    const products = JSON.parse(raw);
    for (const p of products) {
      await prisma.product.create({
        data: {
          id: p.id,
          brand: p.brand,
          name: p.name,
          storage: p.storage,
          grade: p.grade,
          price: p.price,
          color: p.color,
          image: p.image || "",
          tags: p.tags || [],
        },
      });
    }
    console.log(`✓ Seeded — ${products.length} products in the database.`);
  } else {
    console.log(`• Catalog already has ${existing} products — skipping product seed.`);
  }

  // Trade-in buy-back models (only if none exist yet).
  const tiCount = await prisma.tradeInModel.count();
  if (tiCount === 0) {
    const models = JSON.parse(
      await readFile(join(__dirname, "..", "data", "tradein.json"), "utf8")
    );
    await prisma.tradeInModel.createMany({
      data: models.map((m, i) => ({ ...m, sortOrder: i })),
    });
    console.log(`✓ Seeded — ${models.length} trade-in models.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
