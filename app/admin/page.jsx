"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ProductImage from "../../components/ProductImage";
import ImageUploader from "../../components/ImageUploader";
import { BRANDS } from "../../lib/products";
import { gbp } from "../../lib/format";

const GRADES = ["New", "A+", "A", "B+", "B", "C"];
const STORAGES = ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"];
const ALL_TAGS = ["flagship", "new", "deal", "budget", "compact"];

const BLANK = {
  id: "",
  brand: "Apple",
  name: "",
  storage: "128GB",
  grade: "A",
  price: 0,
  color: "",
  description: "",
  tags: [],
  images: [],
  featured: false,
  stock: 1,
};

export default function AdminPage() {
  const [session, setSession] = useState(null); // {authed, dbEnabled, defaultPassword}
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const fileRef = useRef(null);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const loadSession = async () => {
    const s = await fetch("/api/admin/session").then((r) => r.json());
    setSession(s);
    return s;
  };

  const loadItems = async () => {
    setLoading(true);
    const data = await fetch("/api/products").then((r) => r.json());
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await loadSession();
      await loadItems();
    })();
  }, []);

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

  const save = async (product) => {
    const isNew = !items.some((p) => p.id === product.id) || !product.id;
    const url = isNew ? "/api/products" : `/api/products/${product.id}`;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      flash(err.error || "Save failed");
      return;
    }
    setEditing(null);
    await loadItems();
    flash(isNew ? "Product added" : "Changes saved");
  };

  const remove = async (id) => {
    if (!confirm("Remove this product from the catalog?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!res.ok) return flash("Delete failed");
    await loadItems();
    flash("Product removed");
  };

  const exportJson = () => {
    const clean = items.map(({ id, brand, name, storage, grade, price, color, image, tags }) => ({
      id, brand, name, storage, grade, price, color, image: image || "", tags: tags || [],
    }));
    const blob = new Blob([JSON.stringify(clean, null, 2)], { type: "application/json" });
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
    reader.onload = async () => {
      let data;
      try {
        data = JSON.parse(String(reader.result));
      } catch {
        return flash("Couldn't parse that JSON");
      }
      if (!Array.isArray(data)) return flash("File isn't a product array");
      if (!confirm(`Import ${data.length} products into the database?`)) return;
      let ok = 0;
      for (const p of data) {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p),
        });
        if (res.ok) ok++;
      }
      await loadItems();
      flash(`Imported ${ok}/${data.length}`);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    await loadSession();
  };

  // —— gate ——
  if (session && !session.authed) {
    return <LoginGate session={session} onDone={loadSession} />;
  }

  return (
    <div className="mx-auto max-w-page px-5 pt-24 pb-20 min-h-screen">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] uppercase tracking-[0.18em] text-accent">Staff</p>
          <h1 className="display text-[32px] md:text-[44px] font-semibold text-ink">Stock manager</h1>
          <p className="mt-1 text-[14px] text-ink-soft">
            {stats.count} products · catalog value {gbp(stats.value)}
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
          <button onClick={logout} className="rounded-full border border-black/15 px-4 py-2 text-[14px] text-ink-soft hover:border-ink">
            Log out
          </button>
        </div>
      </div>

      {/* status banners */}
      {session && !session.dbEnabled && (
        <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-[13px] text-amber-800">
          <span className="font-medium">Preview mode —</span> no database is connected, so edits
          won&rsquo;t save. Set <code>DATABASE_URL</code> (see DEPLOY.md) to go live. You can still
          browse the seeded catalog and export JSON.
        </div>
      )}
      {session?.dbEnabled && session?.defaultPassword && (
        <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-[13px] text-amber-800">
          <span className="font-medium">Heads up —</span> you&rsquo;re using the default admin
          password. Set <code>ADMIN_PASSWORD</code> in your environment to secure the stock manager.
        </div>
      )}
      {session?.dbEnabled && (
        <div className="mt-4 rounded-2xl bg-chalk p-4 text-[13px] text-ink-soft">
          Changes save to the database and go live within a minute.
          <Link href="/shop" className="ml-1 text-accent hover:underline">View storefront →</Link>
        </div>
      )}

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
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-ink-soft">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-ink-soft">No products match “{query}”.</td></tr>
            ) : (
              filtered.map((p) => (
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
                          {(p.images?.length > 0) && (
                            <span className="text-ink-soft text-[11px]">· {p.images.length} 📷</span>
                          )}
                        </p>
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing && <EditModal product={editing} onClose={() => setEditing(null)} onSave={save} />}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] rounded-full bg-ink text-white text-[13px] px-4 py-2 shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function LoginGate({ session, onDone }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    setBusy(false);
    if (res.ok) onDone();
    else setErr("Incorrect password");
  };

  return (
    <div className="mx-auto max-w-sm px-5 pt-40 pb-24 min-h-[70vh]">
      <p className="text-[12px] uppercase tracking-[0.18em] text-accent text-center">Staff area</p>
      <h1 className="display text-[30px] font-semibold text-ink text-center mt-2">Stock manager</h1>
      <form onSubmit={submit} className="mt-8 rounded-3xl bg-chalk p-6">
        <label className="block text-[13px] text-ink-soft mb-1">Password</label>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          autoFocus
          className="w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-accent"
        />
        {err && <p className="mt-2 text-[13px] text-red-600">{err}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-4 w-full rounded-full bg-accent px-5 py-3 text-[15px] font-medium text-white hover:bg-accent-hover disabled:opacity-40"
        >
          {busy ? "Checking…" : "Sign in"}
        </button>
        {session?.defaultPassword && (
          <p className="mt-3 text-center text-[12px] text-ink-soft">
            Demo password: <code className="text-ink">phonepro</code>
          </p>
        )}
      </form>
      <Link href="/" className="mt-6 block text-center text-[13px] text-accent hover:underline">
        ← Back to store
      </Link>
    </div>
  );
}

function EditModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(product);
  const [saving, setSaving] = useState(false);
  const isNew = !product.id;
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleTag = (t) =>
    setForm((f) => ({
      ...f,
      tags: f.tags?.includes(t) ? f.tags.filter((x) => x !== t) : [...(f.tags || []), t],
    }));

  const submit = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

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
          <Field label="Photos" className="col-span-2">
            <ImageUploader value={form.images || []} onChange={(images) => set("images", images)} />
          </Field>
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
          <Field label="Stock (units)">
            <input type="number" min="0" value={form.stock ?? 1} onChange={(e) => set("stock", e.target.value)} className={inputCls} />
          </Field>
          <label className="flex items-center gap-2 self-end pb-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={!!form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="w-4 h-4 accent-accent"
            />
            <span className="text-[13px] text-ink">Feature on homepage</span>
          </label>
          <Field label="Description" className="col-span-2">
            <textarea
              value={form.description || ""}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
              className={`${inputCls} resize-y`}
              placeholder="Condition notes, what's included, standout features…"
            />
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
            onClick={submit}
            disabled={!form.name || !form.color || saving}
            className="flex-1 rounded-full bg-accent px-5 py-3 text-[15px] font-medium text-white hover:bg-accent-hover disabled:opacity-40"
          >
            {saving ? "Saving…" : isNew ? "Add to catalog" : "Save changes"}
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
