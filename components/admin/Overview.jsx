"use client";

import { useEffect, useMemo, useState } from "react";
import { isOnSale, effectivePrice } from "../../lib/products";
import { gbp } from "../../lib/format";

export default function Overview({ onGoTo }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then((d) => {
      setProducts(Array.isArray(d) ? d : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const units = products.reduce((n, p) => n + (p.stock ?? 1), 0);
    const stockValue = products.reduce((n, p) => n + effectivePrice(p) * (p.stock ?? 1), 0);
    const onSale = products.filter(isOnSale).length;
    const featured = products.filter((p) => p.featured).length;
    const outOfStock = products.filter((p) => (p.stock ?? 1) <= 0).length;
    const withPhotos = products.filter((p) => p.images?.length > 0).length;
    return { count: products.length, units, stockValue, onSale, featured, outOfStock, withPhotos };
  }, [products]);

  if (loading) return <p className="text-ink-soft py-10 text-center">Loading…</p>;

  const cards = [
    { label: "Products", value: stats.count, sub: `${stats.units} units in stock` },
    { label: "Stock value", value: gbp(stats.stockValue), sub: "at live prices" },
    { label: "On sale", value: stats.onSale, sub: "with a markdown" },
    { label: "Featured", value: stats.featured, sub: "on the homepage" },
    { label: "Out of stock", value: stats.outOfStock, sub: "need restocking", warn: stats.outOfStock > 0 },
    { label: "With photos", value: `${stats.withPhotos}/${stats.count}`, sub: "have real images" },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-black/5 p-5">
            <p className="text-[12px] text-ink-soft">{c.label}</p>
            <p className={`mt-1 text-[26px] font-semibold ${c.warn ? "text-red-600" : "text-ink"}`}>{c.value}</p>
            <p className="text-[12px] text-ink-soft">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button onClick={() => onGoTo("products")} className="rounded-full bg-accent px-4 py-2 text-[14px] font-medium text-white hover:bg-accent-hover">Manage products</button>
        <button onClick={() => onGoTo("offers")} className="rounded-full border border-black/15 px-4 py-2 text-[14px] text-ink hover:border-ink">Offers &amp; pricing</button>
        <button onClick={() => onGoTo("tradein")} className="rounded-full border border-black/15 px-4 py-2 text-[14px] text-ink hover:border-ink">Trade-in values</button>
      </div>
    </div>
  );
}
