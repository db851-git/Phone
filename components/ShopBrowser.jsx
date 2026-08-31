"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { seedProducts, BRANDS, GRADE_INFO } from "../lib/products";

const GRADES = ["New", "A+", "A", "B+", "B", "C"];
const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "name", label: "Name A–Z" },
];

export default function ShopBrowser() {
  const params = useSearchParams();
  // Start from the seed for instant paint, then swap in the live DB catalog.
  const [catalog, setCatalog] = useState(seedProducts);
  const [brand, setBrand] = useState([]);
  const [grade, setGrade] = useState([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(1200);
  const [tag, setTag] = useState(null);

  // Seed filters from the URL (?brand=Apple, ?tag=deal) so nav links deep-link.
  useEffect(() => {
    const b = params.get("brand");
    const t = params.get("tag");
    setBrand(b ? [b] : []);
    setTag(t || null);
  }, [params]);

  // Pull the live catalog from the API (reflects admin edits).
  useEffect(() => {
    let alive = true;
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        if (alive && Array.isArray(d) && d.length) setCatalog(d);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = catalog.filter((p) => {
      if (brand.length && !brand.includes(p.brand)) return false;
      if (grade.length && !grade.includes(p.grade)) return false;
      if (tag && !p.tags.includes(tag)) return false;
      if (p.price > maxPrice) return false;
      if (query) {
        const hay = `${p.name} ${p.color} ${p.storage} ${p.brand}`.toLowerCase();
        if (!hay.includes(query.toLowerCase())) return false;
      }
      return true;
    });
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "name":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return list;
  }, [catalog, brand, grade, query, sort, maxPrice, tag]);

  const toggle = (value, setter, current) =>
    setter(current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);

  const clearAll = () => {
    setBrand([]);
    setGrade([]);
    setQuery("");
    setMaxPrice(1200);
    setTag(null);
  };

  const activeCount = brand.length + grade.length + (tag ? 1 : 0) + (query ? 1 : 0) + (maxPrice < 1200 ? 1 : 0);

  return (
    <div className="mx-auto max-w-page px-5 pt-28 pb-20">
      <div className="mb-8">
        <h1 className="display text-[34px] md:text-[48px] font-semibold text-ink">
          Shop all phones
        </h1>
        <p className="mt-2 text-[15px] text-ink-soft">
          {filtered.length} device{filtered.length !== 1 ? "s" : ""} in stock · every one unlocked &amp; warrantied.
        </p>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        {/* sidebar */}
        <aside className="lg:sticky lg:top-20 h-fit space-y-7">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search models…"
            className="w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-[14px] outline-none focus:border-accent transition-colors"
          />

          <div>
            <h3 className="text-[13px] font-semibold text-ink mb-2.5">Brand</h3>
            <div className="flex flex-wrap gap-2">
              {BRANDS.map((b) => (
                <button
                  key={b}
                  onClick={() => toggle(b, setBrand, brand)}
                  className={`rounded-full px-3 py-1.5 text-[13px] border transition-colors ${
                    brand.includes(b)
                      ? "bg-ink text-white border-ink"
                      : "bg-white text-ink border-black/10 hover:border-ink"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[13px] font-semibold text-ink mb-2.5">Condition</h3>
            <div className="flex flex-wrap gap-2">
              {GRADES.map((g) => (
                <button
                  key={g}
                  onClick={() => toggle(g, setGrade, grade)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] border transition-colors ${
                    grade.includes(g)
                      ? "bg-ink text-white border-ink"
                      : "bg-white text-ink border-black/10 hover:border-ink"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: GRADE_INFO[g].dot }} />
                  {g === "New" ? "New" : `Grade ${g}`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[13px] font-semibold text-ink mb-2.5">
              Max price · £{maxPrice}
            </h3>
            <input
              type="range"
              min="60"
              max="1200"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </div>

          {activeCount > 0 && (
            <button onClick={clearAll} className="text-[13px] text-accent hover:underline">
              Clear all filters ({activeCount})
            </button>
          )}
        </aside>

        {/* grid */}
        <div>
          <div className="flex items-center justify-end mb-5">
            <label className="text-[13px] text-ink-soft mr-2">Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-[13px] outline-none focus:border-accent"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-3xl bg-chalk p-16 text-center">
              <p className="text-[16px] text-ink">No phones match those filters.</p>
              <button onClick={clearAll} className="mt-3 text-accent text-[14px] hover:underline">
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
