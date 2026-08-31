// Runs during the build. When a database is configured, it syncs the Prisma
// schema (creating any missing tables/columns) and seeds an empty catalog.
// A deploy is then enough to get the DB ready — no manual Prisma commands.
//
// Neon note: schema changes (DDL) need a DIRECT connection, not the pooled
// "-pooler" endpoint. We derive the direct URL automatically, and honour an
// explicit DIRECT_URL if provided.
import { execSync } from "node:child_process";

const runtimeUrl = process.env.DATABASE_URL;

if (!runtimeUrl) {
  console.log("[db-setup] No DATABASE_URL set — skipping schema sync (preview mode).");
  process.exit(0);
}

// Prefer an explicit direct URL; otherwise strip Neon's "-pooler" from the host.
const pushUrl = process.env.DIRECT_URL || runtimeUrl.replace("-pooler.", ".");

function run(cmd, url) {
  execSync(cmd, { stdio: "inherit", env: { ...process.env, DATABASE_URL: url } });
}

let schemaOk = false;
try {
  console.log("[db-setup] Syncing database schema (prisma db push)…");
  run("npx prisma db push --skip-generate --accept-data-loss", pushUrl);
  schemaOk = true;
  console.log("[db-setup] Schema in sync.");
} catch (e) {
  // Retry once on the pooled URL in case the direct host isn't reachable.
  console.warn("[db-setup] Direct push failed, retrying on the pooled URL…");
  try {
    run("npx prisma db push --skip-generate --accept-data-loss", runtimeUrl);
    schemaOk = true;
    console.log("[db-setup] Schema in sync (pooled).");
  } catch (e2) {
    console.error("[db-setup] Schema sync FAILED — the admin will not be able to save.");
    console.error("[db-setup]", e2.message);
    process.exit(0); // don't block the storefront deploy
  }
}

if (schemaOk) {
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const count = await prisma.product.count();
    await prisma.$disconnect();
    console.log(`[db-setup] Catalog has ${count} products — running seed (fills only what's empty)…`);
    run("node prisma/seed.mjs", runtimeUrl);
  } catch (e) {
    console.warn("[db-setup] Seed step skipped:", e.message);
  }
}
