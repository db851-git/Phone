"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ProductImage from "../../components/ProductImage";
import catalog from "../../data/products.json";
import { BRANDS } from "../../lib/products";
import { gbp } from "../../lib/format";

const GRADES = ["New", "A+", "A", "B+", "B", "C"];
const STORAGES = ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"];
const ALL_TAGS = ["flagship", "new", "deal", "budget", "compact"];
const LS_KEY = "phonepro-admin-catalog-v1";

const BLANK = {
  id: "",
  brand: "Apple",
  name: "",
  storage: "128GB",
  grade: "A",
  price: 0,
  color: "",
  tags: [],
  image: "",
};

function slugify(p) {
  return [p.name, p.storage, p.grade, p.color]
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

export default function AdminPage() {
  const [items, setItems] = useState(catalog);
  const [editing, setEditing] = useState(null); // product object or null
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);

  // Load any in-progress edits from a previous session.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (next) => {
    setItems(next);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const filtered = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter((p) =>
      `${p.name} ${p.brand} ${p.color} ${p.storage} ${p.grade}`.toLowerCase().includes(q)
    );
  }, [items, query]);

  const stats = useMemo(() => {
    const value = items.reduce((n, p) => n + Number(p.price || 0), 0);
    return { count: items.length, value };
  }, [items]);

  const upsert = (product) => {
    const id = product.id || slugify(product);
    const clean = { ...product, id, price: Number(product.price) || 0 };
    const exists = items.some((p) => p.id === id);
    const next = exists
      ? items.map((p) => (p.id === id ? clean : p))
      : [clean, ...items];
    persist(next);
    setEditing(null);
  };

  const remove = (id) => {
    if (!confirm("Remove this product from the catalog?")) return;
    persist(items.filter((p) => p.id !== id));
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (Array.isArray(data)) persist(data);
        else alert("That file isn't a product array.");
      } catch {
        alert("Couldn't parse that JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const resetToLive = () => {
    if (!confirm("Discard local edits and reload the shipped catalog?")) return;
    try {
      localStorage.removeItem(LS_KEY);
    } catch {}
    setItems(catalog);
  };

  return (
    <div className="mx-auto max-w-page px-5 pt-24 pb-20 min-h-screen">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] uppercase tracking-[0.18em] text-accent">Staff</p>
          <h1 className="display text-[32px] md:text-[44px] font-semibold text-ink">Stock manager</h1>
          <p className="mt-1 text-[14px] text-ink-soft">
            {stats.count} products · catalog value {gbp(stats.value)}
            {saved && <span className="ml-2 text-green-600">✓ saved locally</span>}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setEditing({ ...BLANK })} className="rounded-full bg-accent px-4 py-2 text-[14px] font-medium text-white hover:bg-accent-hover">
            + Add product
          </button>
          <button onClick={exportJson} className="rounded-full border border-black/15 px-4 py-2 text-[14px] font-medium text-ink hover:border-ink">
            Export JSON
          </button>
          <button onClick={() => fileRef.current?.click()} className="rounded-full border border-black/15 px-4 py-2 text-[14px] font-medium text-ink hover:border-ink">
            Import
          </button>
          <input ref={fileRef} type="file" accept="application/json" onChange={onImport} className="hidden" />
          <button onClick={resetToLive} className="rounded-full border border-black/15 px-4 py-2 text-[14px] text-ink-soft hover:border-ink">
            Reset
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-chalk p-4 text-[13px] text-ink-soft">
        Edits are saved in your browser as you work. To publish them to the live
        site, click <span className="font-medium text-ink">Export JSON</span> and commit the
        downloaded file to <code className="text-ink">data/products.json</code>.
        <Link href="/shop" className="ml-1 text-accent hover:underline">View storefront →</Link>
      </div>

      {/* search */}
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search catalog…"
        className="mt-6 w-full sm:w-80 rounded-full border border-black/10 bg-white px-4 py-2.5 text-[14px] outline-none focus:border-accent"
      />

      {/* table */}
      <div className="mt-4 overflow-x-auto rounded-2xl border border-black/5">
        <table className="w-full text-[13px]">
          <thead className="bg-chalk text-ink-soft text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Storage</th>
              <th className="px-4 py-3 font-medium">Grade</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-chalk/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-11 rounded-lg bg-chalk flex items-center justify-center shrink-0">
                      <ProductImage product={p} className="h-9 w-auto" />
                    </span>
                    <div>
                      <p className="font-medium text-ink">{p.name}</p>
                      <p className="text-ink-soft">{p.brand} · {p.color}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-soft">{p.storage}</td>
                <td className="px-4 py-3 text-ink-soft">{p.grade === "New" ? "New" : `Grade ${p.grade}`}</td>
                <td className="px-4 py-3 text-ink">{gbp(p.price)}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={() => setEditing(p)} className="text-accent hover:underline">Edit</button>
                  <span className="mx-2 text-black/15">|</span>
                  <button onClick={() => remove(p.id)} className="text-ink-soft hover:text-red-600">Delete</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-ink-soft">No products match “{query}”.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditModal
          product={editing}
          onClose={() => setEditing(null)}
          onSave={upsert}
        />
      )}
    </div>
  );
}

function EditModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(product);
  const isNew = !product.id;
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleTag = (t) =>
    setForm((f) => ({
      ...f,
      tags: f.tags?.includes(t) ? f.tags.filter((x) => x !== t) : [...(f.tags || []), t],
    }));

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-5" onClick={onClose}>
      <div
        className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[20px] font-semibold text-ink">{isNew ? "Add product" : "Edit product"}</h2>
          <button onClick={onClose} className="text-ink-soft hover:text-ink" aria-label="Close">✕</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Name" className="col-span-2">
            <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} placeholder="iPhone 15 Pro" />
          </Field>
          <Field label="Brand">
            <select value={form.brand} onChange={(e) => set("brand", e.target.value)} className={inputCls}>
              {BRANDS.map((b) => <option key={b}>{b}</option>)}
            </select>
          </Field>
          <Field label="Colour">
            <input value={form.color} onChange={(e) => set("color", e.target.value)} className={inputCls} placeholder="Natural Titanium" />
          </Field>
          <Field label="Storage">
            <select value={form.storage} onChange={(e) => set("storage", e.target.value)} className={inputCls}>
              {STORAGES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Grade">
            <select value={form.grade} onChange={(e) => set("grade", e.target.value)} className={inputCls}>
              {GRADES.map((g) => <option key={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="Price (£)">
            <input type="number" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Image URL (optional)">
            <input value={form.image || ""} onChange={(e) => set("image", e.target.value)} className={inputCls} placeholder="/images/ip15pro.jpg" />
          </Field>
          <Field label="Tags" className="col-span-2">
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTag(t)}
                  className={`rounded-full px-3 py-1.5 text-[13px] border transition-colors ${
                    form.tags?.includes(t) ? "bg-ink text-white border-ink" : "bg-white text-ink border-black/10 hover:border-ink"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => onSave(form)}
            disabled={!form.name || !form.color}
            className="flex-1 rounded-full bg-accent px-5 py-3 text-[15px] font-medium text-white hover:bg-accent-hover disabled:opacity-40"
          >
            {isNew ? "Add to catalog" : "Save changes"}
          </button>
          <button onClick={onClose} className="rounded-full border border-black/15 px-5 py-3 text-[15px] text-ink hover:border-ink">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-accent transition-colors";

function Field({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-[12px] text-ink-soft mb-1">{label}</span>
      {children}
    </label>
  );
}
