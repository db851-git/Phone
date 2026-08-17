// Server-only settings + trade-in config. Backed by the Setting and TradeInModel
// tables; falls back to the shared defaults when no DB is configured.
import "server-only";
import {
  DEFAULT_OFFER,
  DEFAULT_TRADEIN,
  DEFAULT_TRADEIN_MODELS,
} from "./products";
import { isDbEnabled } from "./catalog";

function db() {
  if (!process.env.DATABASE_URL) return null;
  const { prisma } = require("./db");
  return prisma;
}

export async function getSetting(key, fallback) {
  const client = db();
  if (!client) return fallback;
  try {
    const row = await client.setting.findUnique({ where: { key } });
    return row ? row.value : fallback;
  } catch {
    return fallback;
  }
}

export async function setSetting(key, value) {
  const client = db();
  if (!client) throw new Error("Database not configured");
  return client.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function getOffer() {
  return getSetting("offer", DEFAULT_OFFER);
}

// Full trade-in config for the Sell page: buy-back models + multipliers + bonus.
export async function getTradeInConfig() {
  const client = db();
  const multipliers = await getSetting("tradeIn", DEFAULT_TRADEIN);
  let models = DEFAULT_TRADEIN_MODELS.map((m, i) => ({ ...m, id: `seed-${i}`, active: true, sortOrder: i }));
  if (client) {
    try {
      const rows = await client.tradeInModel.findMany({ orderBy: { sortOrder: "asc" } });
      if (rows.length) models = rows;
    } catch {}
  }
  return { models, ...multipliers };
}

export { isDbEnabled };
