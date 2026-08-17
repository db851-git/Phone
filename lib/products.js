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
export const products = catalog;

// —— derived helpers ——
export function getProduct(id) {
  return products.find((p) => p.id === id) || null;
}

export function relatedProducts(product, count = 4) {
  return products
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
