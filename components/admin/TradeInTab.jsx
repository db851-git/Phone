"use client";

import { useEffect, useMemo, useState } from "react";
import { BRANDS, DEFAULT_TRADEIN } from "../../lib/products";
import { gbp } from "../../lib/format";

export default function TradeInTab({ dbEnabled, flash }) {
  const [models, setModels] = useState([]);
  const [multipliers, setMultipliers] = useState(DEFAULT_TRADEIN);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState({ name: "", brand: "Apple", baseValue: 0 });

  const load = async () => {
    setLoading(true);
    const [cfg, prods] = await Promise.all([
      fetch("/api/trade-in").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ]);
    setModels(Array.isArray(cfg.models) ? cfg.models : []);
    setMultipliers({
      storages: cfg.storages || DEFAULT_TRADEIN.storages,
      conditions: cfg.conditions || DEFAULT_TRADEIN.conditions,
      bonusPercent: typeof cfg.bonusPercent === "number" ? cfg.bonusPercent : DEFAULT_TRADEIN.bonusPercent,
    });
    setProducts(Array.isArray(prods) ? prods : []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const seededOnly = models.length > 0 && String(models[0].id).startsWith("seed-");

  const addModel = async () => {
    if (!dbEnabled) return flash("Connect a database first");
    if (!draft.name) return flash("Model name required");
    const res = await fetch("/api/trade-in", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...draft, baseValue: Number(draft.baseValue) || 0, sortOrder: models.length }),
    });
    if (!res.ok) return flash("Add failed");
    setDraft({ name: "", brand: "Apple", baseValue: 0 });
    await load();
    flash("Model added");
  };

  const saveModel = async (m) => {
    const res = await fetch(`/api/trade-in/${m.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(m),
    });
    flash(res.ok ? "Saved" : "Save failed");
    if (res.ok) load();
  };

  const deleteModel = async (id) => {
    if (!confirm("Remove this trade-in model?")) return;
    const res = await fetch(`/api/trade-in/${id}`, { method: "DELETE" });
    flash(res.ok ? "Removed" : "Delete failed");
    if (res.ok) load();
  };

  const patchModel = (id, key, val) =>
    setModels((ms) => ms.map((m) => (m.id === id ? { ...m, [key]: val } : m)));

  const saveMultipliers = async () => {
    const res = await fetch("/api/settings", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "tradeIn", value: multipliers }),
    });
    flash(res.ok ? "Multipliers saved" : "Save failed");
  };

  const seedDefaults = async () => {
    if (!confirm("Load the default trade-in model list into the database?")) return;
    let ok = 0;
    for (let i = 0; i < models.length; i++) {
      const m = models[i];
      const res = await fetch("/api/trade-in", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: m.name, brand: m.brand, baseValue: m.baseValue, sortOrder: i }),
      });
      if (res.ok) ok++;
    }
    await load();
    flash(`Seeded ${ok} models`);
  };

  // —— margin snapshot: buy-back (like-new 128GB) vs matching retail price ——
  const margins = useMemo(() => {
    return models
      .map((m) => {
        const buy = Math.round(m.baseValue);
        const matches = products.filter((p) => p.name === m.name);
        if (!matches.length) return null;
        const retail = Math.min(...matches.map((p) => (p.salePrice && p.salePrice < p.price ? p.salePrice : p.price)));
        return { name: m.name, buy, retail, margin: retail - buy, pct: retail ? Math.round(((retail - buy) / retail) * 100) : 0 };
      })
      .filter(Boolean)
      .sort((a, b) => b.margin - a.margin);
  }, [models, products]);

  if (loading) return <p className="text-ink-soft py-10 text-center">Loading…</p>;

  return (
    <div className="space-y-8">
      {seededOnly && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-[13px] text-amber-800 flex items-center justify-between gap-4">
          <span>These are the built-in default values. Load them into the database to edit them.</span>
          <button onClick={seedDefaults} disabled={!dbEnabled} className="rounded-full bg-ink text-white px-4 py-2 text-[13px] disabled:opacity-40 shrink-0">Load defaults</button>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* buy-back models */}
        <section>
          <h2 className="text-[17px] font-semibold text-ink mb-1">Buy-back values</h2>
          <p className="text-[13px] text-ink-soft mb-4">What you pay for a like-new 128GB unit. Storage &amp; condition adjust it automatically.</p>
          <div className="overflow-x-auto rounded-2xl border border-black/5">
            <table className="w-full text-[13px]">
              <thead className="bg-chalk text-ink-soft text-left">
                <tr><th className="px-3 py-2.5 font-medium">Model</th><th className="px-3 py-2.5 font-medium">£ base</th><th className="px-3 py-2.5 font-medium">Live</th><th className="px-3 py-2.5"></th></tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {models.map((m) => (
                  <tr key={m.id}>
                    <td className="px-3 py-2">
                      <input value={m.name} disabled={seededOnly} onChange={(e) => patchModel(m.id, "name", e.target.value)} className="w-full bg-transparent outline-none text-ink disabled:text-ink-soft" />
                      <span className="text-ink-soft text-[11px]">{m.brand}</span>
                    </td>
                    <td className="px-3 py-2 w-24">
                      <input type="number" value={m.baseValue} disabled={seededOnly} onChange={(e) => patchModel(m.id, "baseValue", Number(e.target.value))} className="w-20 rounded-lg border border-black/10 px-2 py-1 outline-none focus:border-accent disabled:bg-chalk disabled:border-transparent" />
                    </td>
                    <td className="px-3 py-2">
                      <label className="inline-flex items-center gap-1.5">
                        <input type="checkbox" checked={m.active !== false} disabled={seededOnly} onChange={(e) => patchModel(m.id, "active", e.target.checked)} className="w-4 h-4 accent-accent" />
                        <span className="text-ink-soft text-[12px]">on</span>
                      </label>
                    </td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">
                      {!seededOnly && (
                        <>
                          <button onClick={() => saveModel(m)} className="text-accent hover:underline">Save</button>
                          <span className="mx-1.5 text-black/15">|</span>
                          <button onClick={() => deleteModel(m.id)} className="text-ink-soft hover:text-red-600">✕</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!seededOnly && (
            <div className="mt-3 flex flex-wrap gap-2 items-end">
              <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="New model" className="rounded-lg border border-black/10 px-3 py-2 text-[13px] outline-none focus:border-accent" />
              <select value={draft.brand} onChange={(e) => setDraft({ ...draft, brand: e.target.value })} className="rounded-lg border border-black/10 px-3 py-2 text-[13px] outline-none focus:border-accent">{BRANDS.map((b) => <option key={b}>{b}</option>)}</select>
              <input type="number" value={draft.baseValue} onChange={(e) => setDraft({ ...draft, baseValue: e.target.value })} placeholder="£" className="w-20 rounded-lg border border-black/10 px-3 py-2 text-[13px] outline-none focus:border-accent" />
              <button onClick={addModel} className="rounded-full bg-accent text-white px-4 py-2 text-[13px] font-medium hover:bg-accent-hover">Add</button>
            </div>
          )}
        </section>

        {/* margin snapshot */}
        <section>
          <h2 className="text-[17px] font-semibold text-ink mb-1">Trade vs. retail margin</h2>
          <p className="text-[13px] text-ink-soft mb-4">For models you also sell: buy-back price vs. your live retail price.</p>
          {margins.length === 0 ? (
            <p className="text-[13px] text-ink-soft rounded-2xl border border-black/5 p-6 text-center">No overlapping models in stock yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-black/5">
              <table className="w-full text-[13px]">
                <thead className="bg-chalk text-ink-soft text-left">
                  <tr><th className="px-3 py-2.5 font-medium">Model</th><th className="px-3 py-2.5 font-medium">We pay</th><th className="px-3 py-2.5 font-medium">We sell</th><th className="px-3 py-2.5 font-medium">Margin</th></tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {margins.map((m) => (
                    <tr key={m.name}>
                      <td className="px-3 py-2 text-ink">{m.name}</td>
                      <td className="px-3 py-2 text-ink-soft">{gbp(m.buy)}</td>
                      <td className="px-3 py-2 text-ink-soft">{gbp(m.retail)}</td>
                      <td className={`px-3 py-2 font-medium ${m.margin >= 0 ? "text-green-600" : "text-red-600"}`}>{gbp(m.margin)} · {m.pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* multipliers */}
      <section className="rounded-2xl border border-black/5 p-6">
        <h2 className="text-[17px] font-semibold text-ink mb-1">Adjustments</h2>
        <p className="text-[13px] text-ink-soft mb-4">How storage and condition scale the buy-back value, plus the store-credit bonus.</p>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-[13px] font-semibold text-ink mb-2">Storage ×</h3>
            <div className="space-y-2">
              {multipliers.storages.map((s, i) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="text-[13px] text-ink-soft w-16">{s.label}</span>
                  <input type="number" step="0.01" value={s.mult} disabled={!dbEnabled} onChange={(e) => setMultipliers((mm) => ({ ...mm, storages: mm.storages.map((x, xi) => xi === i ? { ...x, mult: Number(e.target.value) } : x) }))} className="w-20 rounded-lg border border-black/10 px-2 py-1 text-[13px] outline-none focus:border-accent disabled:bg-chalk" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-ink mb-2">Condition ×</h3>
            <div className="space-y-2">
              {multipliers.conditions.map((c, i) => (
                <div key={c.label} className="flex items-center gap-2">
                  <span className="text-[13px] text-ink-soft w-20">{c.label}</span>
                  <input type="number" step="0.01" value={c.mult} disabled={!dbEnabled} onChange={(e) => setMultipliers((mm) => ({ ...mm, conditions: mm.conditions.map((x, xi) => xi === i ? { ...x, mult: Number(e.target.value) } : x) }))} className="w-20 rounded-lg border border-black/10 px-2 py-1 text-[13px] outline-none focus:border-accent disabled:bg-chalk" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-ink mb-2">Store-credit bonus</h3>
            <div className="flex items-center gap-2">
              <input type="number" value={multipliers.bonusPercent} disabled={!dbEnabled} onChange={(e) => setMultipliers((mm) => ({ ...mm, bonusPercent: Number(e.target.value) }))} className="w-20 rounded-lg border border-black/10 px-2 py-1 text-[13px] outline-none focus:border-accent disabled:bg-chalk" />
              <span className="text-[13px] text-ink-soft">% extra</span>
            </div>
          </div>
        </div>
        <button onClick={saveMultipliers} disabled={!dbEnabled} className="mt-5 rounded-full bg-accent px-5 py-2.5 text-[14px] font-medium text-white hover:bg-accent-hover disabled:opacity-40">Save adjustments</button>
      </section>
    </div>
  );
}
