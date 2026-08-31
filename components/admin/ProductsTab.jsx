"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ProductImage from "../ProductImage";
import ImageUploader from "../ImageUploader";
import { BRANDS, isOnSale, effectivePrice } from "../../lib/products";
import { gbp } from "../../lib/format";

const GRADES = ["New", "A+", "A", "B+", "B", "C"];
const STORAGES = ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"];
const ALL_TAGS = ["flagship", "new", "deal", "budget", "compact"];

const BLANK = {
  id: "", brand: "Apple", name: "", storage: "128GB", grade: "A",
  price: 0, salePrice: "", color: "", description: "", tags: [],
  images: [], featured: false, stock: 1,
};

export default function ProductsTab({ dbEnabled, flash }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const fileRef = useRef(null);

  const load = async () => {
    setLoading(true);
    const data = await fetch("/api/products").then((r) => r.json());
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter((p) => `${p.name} ${p.brand} ${p.color} ${p.storage} ${p.grade}`.toLowerCase().includes(q));
  }, [items, query]);

  const save = async (product) => {
    const isNew = !product.id || !items.some((p) => p.id === product.id);
    const res = await fetch(isNew ? "/api/products" : `/api/products/${product.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!res.ok) return flash((await res.json().catch(() => ({}))).error || "Save failed");
    setEditing(null);
    await load();
    flash(isNew ? "Product added" : "Changes saved");
  };

  const remove = async (id) => {
    if (!confirm("Remove this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!res.ok) return flash("Delete failed");
    await load();
    flash("Product removed");
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "products.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      let data;
      try { data = JSON.parse(String(reader.result)); } catch { return flash("Bad JSON"); }
      if (!Array.isArray(data)) return flash("Not a product array");
      if (!confirm(`Import ${data.length} products?`)) return;
      let ok = 0;
      for (const p of data) {
        const res = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
        if (res.ok) ok++;
      }
      await load();
      flash(`Imported ${ok}/${data.length}`);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <input
          type="search" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search catalog…"
          className="w-full sm:w-72 rounded-full border border-black/10 bg-white px-4 py-2.5 text-[14px] outline-none focus:border-accent"
        />
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setEditing({ ...BLANK })} className="rounded-full bg-accent px-4 py-2 text-[14px] font-medium text-white hover:bg-accent-hover">+ Add product</button>
          <button onClick={exportJson} className="rounded-full border border-black/15 px-4 py-2 text-[14px] text-ink hover:border-ink">Export</button>
          <button onClick={() => fileRef.current?.click()} className="rounded-full border border-black/15 px-4 py-2 text-[14px] text-ink hover:border-ink">Import</button>
          <input ref={fileRef} type="file" accept="application/json" onChange={onImport} className="hidden" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-black/5">
        <table className="w-full text-[13px]">
          <thead className="bg-chalk text-ink-soft text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Storage</th>
              <th className="px-4 py-3 font-medium">Grade</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-ink-soft">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-ink-soft">No products match “{query}”.</td></tr>
            ) : filtered.map((p) => (
              <tr key={p.id} className="hover:bg-chalk/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-11 rounded-lg bg-chalk flex items-center justify-center shrink-0">
                      <ProductImage product={p} className="h-9 w-auto" />
                    </span>
                    <div>
                      <p className="font-medium text-ink flex items-center gap-1.5">
                        {p.name}
                        {p.featured && <span className="text-accent" title="Featured">★</span>}
                        {p.images?.length > 0 && <span className="text-ink-soft text-[11px]">· {p.images.length} 📷</span>}
                      </p>
                      <p className="text-ink-soft">{p.brand} · {p.color}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-soft">{p.storage}</td>
                <td className="px-4 py-3 text-ink-soft">{p.grade === "New" ? "New" : `Grade ${p.grade}`}</td>
                <td className="px-4 py-3 text-ink">
                  {isOnSale(p) ? (
                    <span className="flex items-center gap-1.5">
                      <span className="text-accent font-medium">{gbp(effectivePrice(p))}</span>
                      <span className="text-ink-soft line-through text-[12px]">{gbp(p.price)}</span>
                    </span>
                  ) : gbp(p.price)}
                </td>
                <td className={`px-4 py-3 ${p.stock <= 0 ? "text-red-600" : "text-ink-soft"}`}>{p.stock ?? 1}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={() => setEditing(p)} className="text-accent hover:underline">Edit</button>
                  <span className="mx-2 text-black/15">|</span>
                  <button onClick={() => remove(p.id)} className="text-ink-soft hover:text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && <EditModal product={editing} dbEnabled={dbEnabled} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function EditModal({ product, dbEnabled, onClose, onSave }) {
  const [form, setForm] = useState({ ...product, salePrice: product.salePrice ?? "" });
  const [saving, setSaving] = useState(false);
  const isNew = !product.id;
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleTag = (t) => setForm((f) => ({ ...f, tags: f.tags?.includes(t) ? f.tags.filter((x) => x !== t) : [...(f.tags || []), t] }));

  const submit = async () => { setSaving(true); await onSave(form); setSaving(false); };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-5" onClick={onClose}>
      <div className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[20px] font-semibold text-ink">{isNew ? "Add product" : "Edit product"}</h2>
          <button onClick={onClose} className="text-ink-soft hover:text-ink" aria-label="Close">✕</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Photos" className="col-span-2">
            {dbEnabled ? (
              <ImageUploader value={form.images || []} onChange={(images) => set("images", images)} />
            ) : (
              <p className="text-[12px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">Connect a database to upload photos.</p>
            )}
          </Field>
          <Field label="Name" className="col-span-2">
            <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} placeholder="iPhone 15 Pro" />
          </Field>
          <Field label="Brand">
            <select value={form.brand} onChange={(e) => set("brand", e.target.value)} className={inputCls}>{BRANDS.map((b) => <option key={b}>{b}</option>)}</select>
          </Field>
          <Field label="Colour"><input value={form.color} onChange={(e) => set("color", e.target.value)} className={inputCls} placeholder="Natural Titanium" /></Field>
          <Field label="Storage">
            <select value={form.storage} onChange={(e) => set("storage", e.target.value)} className={inputCls}>{STORAGES.map((s) => <option key={s}>{s}</option>)}</select>
          </Field>
          <Field label="Grade">
            <select value={form.grade} onChange={(e) => set("grade", e.target.value)} className={inputCls}>{GRADES.map((g) => <option key={g}>{g}</option>)}</select>
          </Field>
          <Field label="Price (£)"><input type="number" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} className={inputCls} /></Field>
          <Field label="Sale price (£, optional)">
            <input type="number" step="0.01" value={form.salePrice} onChange={(e) => set("salePrice", e.target.value)} className={inputCls} placeholder="leave blank for none" />
          </Field>
          <Field label="Stock (units)"><input type="number" min="0" value={form.stock ?? 1} onChange={(e) => set("stock", e.target.value)} className={inputCls} /></Field>
          <label className="flex items-center gap-2 self-end pb-2.5 cursor-pointer">
            <input type="checkbox" checked={!!form.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 accent-accent" />
            <span className="text-[13px] text-ink">Feature on homepage</span>
          </label>
          <Field label="Description — supports Markdown (tables, lists, **bold**)" className="col-span-2">
            <textarea value={form.description || ""} onChange={(e) => set("description", e.target.value)} rows={5} className={`${inputCls} resize-y font-mono text-[13px]`} placeholder={"Immaculate condition, includes cable & 24-month warranty.\n\n| Feature | Detail |\n| --- | --- |\n| Display | 6.3\" OLED |\n| Battery | 90%+ |"} />
          </Field>
          <Field label="Tags" className="col-span-2">
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map((t) => (
                <button key={t} type="button" onClick={() => toggleTag(t)} className={`rounded-full px-3 py-1.5 text-[13px] border transition-colors ${form.tags?.includes(t) ? "bg-ink text-white border-ink" : "bg-white text-ink border-black/10 hover:border-ink"}`}>{t}</button>
              ))}
            </div>
          </Field>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={submit} disabled={!form.name || !form.color || saving} className="flex-1 rounded-full bg-accent px-5 py-3 text-[15px] font-medium text-white hover:bg-accent-hover disabled:opacity-40">
            {saving ? "Saving…" : isNew ? "Add to catalog" : "Save changes"}
          </button>
          <button onClick={onClose} className="rounded-full border border-black/15 px-5 py-3 text-[15px] text-ink hover:border-ink">Cancel</button>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-accent transition-colors";
function Field({ label, children, className = "" }) {
  return <label className={`block ${className}`}><span className="block text-[12px] text-ink-soft mb-1">{label}</span>{children}</label>;
}
