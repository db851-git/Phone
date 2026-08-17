// Runs during the build. When a database is configured, it syncs the Prisma
// schema (creating any missing tables/columns) and seeds an empty catalog.
// This means a deploy is enough to get the DB ready — no manual Prisma commands.
//
// It is intentionally forgiving: with no DATABASE_URL it skips (preview mode),
// and on a transient DB error it warns but does NOT fail the build, so the
// storefront still deploys.
import { execSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.log("[db-setup] No DATABASE_URL set — skipping schema sync (preview mode).");
  process.exit(0);
}

try {
  console.log("[db-setup] Syncing database schema (prisma db push)…");
  execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
} catch (e) {
  console.warn("[db-setup] Schema sync failed — continuing build:", e.message);
  process.exit(0);
}

try {
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  const count = await prisma.product.count();
  await prisma.$disconnect();
  if (count === 0) {
    console.log("[db-setup] Empty catalog — seeding starter data…");
    execSync("node prisma/seed.mjs", { stdio: "inherit" });
  } else {
    console.log(`[db-setup] Catalog has ${count} products — leaving data as-is.`);
    // Ensure trade-in models exist even if products were seeded before this feature.
    execSync("node prisma/seed.mjs", { stdio: "inherit" });
  }
} catch (e) {
  console.warn("[db-setup] Seed step skipped:", e.message);
}
