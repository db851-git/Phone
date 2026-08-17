// PhonePro inventory — seeded from real shop-window stock (models, grades, prices).
// Grades follow the CeX-style scale used in store: New, A+, A, B+, B, C.
//
// The catalog itself lives in data/products.json so it can be managed from the
// /admin stock manager and served from the /api/products endpoint.
import catalog from "../data/products.json";

export const GRADE_INFO = {
  New: { label: "Brand New", blurb: "Sealed, unopened. Full manufacturer warranty.", dot: "#34c759" },
  "A+": { label: "Grade A+", blurb: "Pristine. Indistinguishable from new.", dot: "#30b0c7" },
  A: { label: "Grade A", blurb: "Excellent. Only the faintest signs of use.", dot: "#0a84ff" },
  "B+": { label: "Grade B+", blurb: "Very good. Light marks, flawless screen.", dot: "#5e5ce6" },
  B: { label: "Grade B", blurb: "Good. Visible wear, fully functional.", dot: "#ff9f0a" },
  C: { label: "Grade C", blurb: "Fair. Heavier wear, great value.", dot: "#ff6a1a" },
};

export const BRANDS = ["Apple", "Samsung"];

// Every device carries a 24-month warranty and is fully unlocked.
export const seedProducts = catalog;
// Back-compat alias for client-side default lists.
export const products = catalog;

// —— pricing helpers (client-safe) ——
export function isOnSale(p) {
  return typeof p?.salePrice === "number" && p.salePrice > 0 && p.salePrice < p.price;
}
export function effectivePrice(p) {
  return isOnSale(p) ? p.salePrice : p.price;
}

// —— trade-in engine defaults (overridable from the admin/DB) ——
export const DEFAULT_TRADEIN = {
  storages: [
    { label: "64GB", mult: 0.92 },
    { label: "128GB", mult: 1 },
    { label: "256GB", mult: 1.1 },
    { label: "512GB", mult: 1.2 },
    { label: "1TB", mult: 1.28 },
  ],
  conditions: [
    { label: "Like new", desc: "Flawless, no marks", mult: 1 },
    { label: "Good", desc: "Light wear, screen perfect", mult: 0.82 },
    { label: "Fair", desc: "Visible scratches, works fully", mult: 0.62 },
    { label: "Broken", desc: "Cracked or faulty", mult: 0.32 },
  ],
  bonusPercent: 10,
};

export const DEFAULT_TRADEIN_MODELS = [
  { name: "iPhone 17 Pro Max", brand: "Apple", baseValue: 780 },
  { name: "iPhone 17 Pro", brand: "Apple", baseValue: 700 },
  { name: "iPhone 16 Pro Max", brand: "Apple", baseValue: 620 },
  { name: "iPhone 16 Pro", brand: "Apple", baseValue: 520 },
  { name: "iPhone 16", brand: "Apple", baseValue: 430 },
  { name: "iPhone 15 Pro Max", brand: "Apple", baseValue: 500 },
  { name: "iPhone 15 Pro", brand: "Apple", baseValue: 420 },
  { name: "iPhone 15", brand: "Apple", baseValue: 340 },
  { name: "iPhone 14 Pro Max", brand: "Apple", baseValue: 380 },
  { name: "iPhone 14", brand: "Apple", baseValue: 280 },
  { name: "iPhone 13 Pro", brand: "Apple", baseValue: 260 },
  { name: "iPhone 13", brand: "Apple", baseValue: 220 },
  { name: "iPhone 12", brand: "Apple", baseValue: 160 },
  { name: "iPhone 11", brand: "Apple", baseValue: 120 },
  { name: "iPhone SE (2020)", brand: "Apple", baseValue: 70 },
  { name: "Galaxy S25 Ultra", brand: "Samsung", baseValue: 560 },
  { name: "Galaxy S24 Ultra", brand: "Samsung", baseValue: 440 },
  { name: "Galaxy S24", brand: "Samsung", baseValue: 320 },
  { name: "Galaxy S23", brand: "Samsung", baseValue: 240 },
  { name: "Galaxy A55 / A5x", brand: "Samsung", baseValue: 130 },
];

export const DEFAULT_OFFER = { active: false, text: "", code: "", link: "/shop" };

// Quote a trade-in from the (possibly admin-edited) config.
export function quoteTradeIn({ baseValue, storageMult = 1, conditionMult = 1 }) {
  return Math.round((baseValue * storageMult * conditionMult) / 5) * 5;
}

// —— derived helpers ——
export function relatedProducts(product, all = seedProducts, count = 4) {
  return all
    .filter((p) => p.id !== product.id && p.brand === product.brand)
    .sort((a, b) => Math.abs(a.price - product.price) - Math.abs(b.price - product.price))
    .slice(0, count);
}

// A short spec sheet inferred from the model line — enough for a realistic PDP.
export function specsFor(product) {
  const isPro = /Pro/.test(product.name);
  const isApple = product.brand === "Apple";
  return [
    { k: "Display", v: isPro ? '6.7" Super Retina XDR, ProMotion 120Hz' : isApple ? '6.1" Super Retina XDR' : '6.6" Dynamic AMOLED 2X' },
    { k: "Chip", v: isApple ? (isPro ? "A-series Pro, 6-core GPU" : "A-series Bionic") : "Snapdragon / Exynos octa-core" },
    { k: "Storage", v: product.storage },
    { k: "Camera", v: isPro ? "Triple 48MP Pro system" : "Dual 12MP+ system" },
    { k: "Battery health", v: product.grade === "New" ? "100%" : product.grade === "C" ? "85%+" : "90%+" },
    { k: "Connectivity", v: "5G • Wi-Fi 6 • Fully unlocked" },
    { k: "In the box", v: "Device, USB-C cable, PhonePro certificate" },
    { k: "Warranty", v: "24-month PhonePro warranty" },
  ];
}
