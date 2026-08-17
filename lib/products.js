// PhonePro inventory — seeded from real shop-window stock (models, grades, prices).
// Grades follow the CeX-style scale used in store: New, A+, A, B+, B, C.

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
export const products = [
  // ——— iPhone 17 series ———
  { id: "ip17pm-512-new", brand: "Apple", name: "iPhone 17 Pro Max", storage: "512GB", grade: "New", price: 1175, color: "Cosmic Orange", tags: ["flagship", "new"] },
  { id: "ip17pm-256-aplus", brand: "Apple", name: "iPhone 17 Pro Max", storage: "256GB", grade: "A+", price: 975, color: "Deep Blue", tags: ["flagship"] },
  { id: "ip17pm-256-aplus2", brand: "Apple", name: "iPhone 17 Pro Max", storage: "256GB", grade: "A+", price: 949, color: "Silver", tags: ["flagship"] },

  // ——— iPhone 16 series ———
  { id: "ip16pm-256-aplus", brand: "Apple", name: "iPhone 16 Pro Max", storage: "256GB", grade: "A+", price: 825, color: "Natural Titanium", tags: ["flagship"] },
  { id: "ip16pm-512-a", brand: "Apple", name: "iPhone 16 Pro Max", storage: "512GB", grade: "A", price: 799, color: "Black Titanium", tags: ["flagship"] },
  { id: "ip16-128-new", brand: "Apple", name: "iPhone 16", storage: "128GB", grade: "New", price: 799, color: "Ultramarine", tags: ["new"] },
  { id: "ip16pro-128-b", brand: "Apple", name: "iPhone 16 Pro", storage: "128GB", grade: "B", price: 599, color: "Desert Titanium", tags: [] },
  { id: "ip16pro-128-bplus", brand: "Apple", name: "iPhone 16 Pro", storage: "128GB", grade: "B+", price: 585, color: "Natural Titanium", tags: [] },
  { id: "ip16pro-128-a", brand: "Apple", name: "iPhone 16 Pro", storage: "128GB", grade: "A", price: 449, color: "White Titanium", tags: ["deal"] },

  // ——— iPhone 15 series ———
  { id: "ip15pm-256-a", brand: "Apple", name: "iPhone 15 Pro Max", storage: "256GB", grade: "A", price: 649, color: "Blue Titanium", tags: [] },
  { id: "ip15pm-256-a2", brand: "Apple", name: "iPhone 15 Pro Max", storage: "256GB", grade: "A", price: 649, color: "White Titanium", tags: [] },
  { id: "ip15pm-128-bplus", brand: "Apple", name: "iPhone 15 Pro Max", storage: "128GB", grade: "B+", price: 599, color: "Natural Titanium", tags: [] },
  { id: "ip15pm-512-b", brand: "Apple", name: "iPhone 15 Pro Max", storage: "512GB", grade: "B", price: 675, color: "Blue Titanium", tags: [] },
  { id: "ip15pro-256-bplus", brand: "Apple", name: "iPhone 15 Pro", storage: "256GB", grade: "B+", price: 499, color: "Natural Titanium", tags: [] },
  { id: "ip15pro-128-a", brand: "Apple", name: "iPhone 15 Pro", storage: "128GB", grade: "A", price: 525, color: "Black Titanium", tags: [] },
  { id: "ip15pro-128-b", brand: "Apple", name: "iPhone 15 Pro", storage: "128GB", grade: "B", price: 449, color: "White Titanium", tags: [] },
  { id: "ip15plus-128-bplus", brand: "Apple", name: "iPhone 15 Plus", storage: "128GB", grade: "B+", price: 399, color: "Pink", tags: [] },
  { id: "ip15-128-a", brand: "Apple", name: "iPhone 15", storage: "128GB", grade: "A", price: 435, color: "Blue", tags: [] },

  // ——— iPhone 14 / 13 series ———
  { id: "ip14pm-256-b", brand: "Apple", name: "iPhone 14 Pro Max", storage: "256GB", grade: "B", price: 435, color: "Space Black", tags: [] },
  { id: "ip14pm-1tb-b", brand: "Apple", name: "iPhone 14 Pro Max", storage: "1TB", grade: "B", price: 449, color: "Deep Purple", tags: [] },
  { id: "ip13pm-128-b", brand: "Apple", name: "iPhone 13 Pro Max", storage: "128GB", grade: "B", price: 325, color: "Sierra Blue", tags: ["deal"] },
  { id: "ip13pro-128-b", brand: "Apple", name: "iPhone 13 Pro", storage: "128GB", grade: "B", price: 325, color: "Graphite", tags: ["deal"] },
  { id: "ip13mini-256-b", brand: "Apple", name: "iPhone 13 mini", storage: "256GB", grade: "B", price: 245, color: "Midnight", tags: ["compact"] },

  // ——— iPhone 11 / X / SE ———
  { id: "ip11-128-a", brand: "Apple", name: "iPhone 11", storage: "128GB", grade: "A", price: 225, color: "Purple", tags: ["budget"] },
  { id: "ip11-128-bplus", brand: "Apple", name: "iPhone 11", storage: "128GB", grade: "B+", price: 199, color: "Green", tags: ["budget"] },
  { id: "ip11-64-b", brand: "Apple", name: "iPhone 11", storage: "64GB", grade: "B", price: 165, color: "Black", tags: ["budget"] },
  { id: "ip11pro-256-bplus", brand: "Apple", name: "iPhone 11 Pro", storage: "256GB", grade: "B+", price: 199, color: "Midnight Green", tags: ["budget"] },
  { id: "ipxr-64-a", brand: "Apple", name: "iPhone XR", storage: "64GB", grade: "A", price: 149, color: "White", tags: ["budget"] },
  { id: "ipxr-64-b", brand: "Apple", name: "iPhone XR", storage: "64GB", grade: "B", price: 115, color: "Coral", tags: ["budget"] },
  { id: "ipx-64-c", brand: "Apple", name: "iPhone X", storage: "64GB", grade: "C", price: 125, color: "Silver", tags: ["budget"] },
  { id: "ipse2-64-b", brand: "Apple", name: "iPhone SE 2", storage: "64GB", grade: "B", price: 135, color: "Red", tags: ["budget", "compact"] },
  { id: "ipse2-64-c", brand: "Apple", name: "iPhone SE 2", storage: "64GB", grade: "C", price: 90, color: "Black", tags: ["budget", "compact"] },
  { id: "ip8-64-b", brand: "Apple", name: "iPhone 8", storage: "64GB", grade: "B", price: 99, color: "Space Grey", tags: ["budget"] },
  { id: "ip7-32-b", brand: "Apple", name: "iPhone 7", storage: "32GB", grade: "B", price: 64.99, color: "Black", tags: ["budget"] },

  // ——— Samsung ———
  { id: "sgs25u-256-a", brand: "Samsung", name: "Galaxy S25 Ultra", storage: "256GB", grade: "A", price: 749, color: "Titanium Gray", tags: ["flagship"] },
  { id: "sgs24-128-bplus", brand: "Samsung", name: "Galaxy S24", storage: "128GB", grade: "B+", price: 425, color: "Onyx Black", tags: [] },
  { id: "sga57-128-new", brand: "Samsung", name: "Galaxy A57 5G", storage: "128GB", grade: "New", price: 279, color: "Awesome Blue", tags: ["new", "budget"] },
  { id: "sga17-128-new", brand: "Samsung", name: "Galaxy A17", storage: "128GB", grade: "New", price: 169, color: "Blue", tags: ["new", "budget"] },
  { id: "sga07-64-new", brand: "Samsung", name: "Galaxy A07", storage: "64GB", grade: "New", price: 99, color: "Black", tags: ["new", "budget"] },
  { id: "sga71-128-b", brand: "Samsung", name: "Galaxy A71", storage: "128GB", grade: "B", price: 74.99, color: "Prism Blue", tags: ["budget"] },
  { id: "sga20-64-b", brand: "Samsung", name: "Galaxy A20", storage: "64GB", grade: "B", price: 74.99, color: "Blue", tags: ["budget"] },
];

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
