// Seed the database from data/products.json.
// Run with: npm run db:seed
import { PrismaClient } from "@prisma/client";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const prisma = new PrismaClient();
const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const raw = await readFile(join(__dirname, "..", "data", "products.json"), "utf8");
  const products = JSON.parse(raw);

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        brand: p.brand,
        name: p.name,
        storage: p.storage,
        grade: p.grade,
        price: p.price,
        color: p.color,
        image: p.image || "",
        tags: p.tags || [],
      },
      create: {
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
  const count = await prisma.product.count();
  console.log(`✓ Seeded — ${count} products in the database.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
