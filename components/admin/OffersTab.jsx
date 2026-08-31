"use client";

import { useEffect, useState } from "react";
import { BRANDS } from "../../lib/products";

const DEFAULT_OFFER = { active: false, text: "", code: "", link: "/shop" };

export default function OffersTab({ dbEnabled, flash }) {
  const [offer, setOffer] = useState(DEFAULT_OFFER);
  const [saving, setSaving] = useState(false);

  // bulk pricing
  const [scope, setScope] = useState("all"); // all | brand | tag
  const [scopeValue, setScopeValue] = useState("Apple");
  const [percent, setPercent] = useState(10);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((d) => setOffer({ ...DEFAULT_OFFER, ...(d.offer || {}) })).catch(() => {});
  }, []);

  const saveOffer = async () => {
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "offer", value: offer }),
    });
    setSaving(false);
    if (res.ok) flash("Offer banner saved");
    else {
      const err = await res.json().catch(() => ({}));
      flash(err.error || `Save failed (${res.status})`);
    }
  };

  const applyBulk = async (clear = false) => {
    if (!dbEnabled) return flash("Connect a database first");
    const label = clear ? "Remove all sale prices?" : `Apply ${percent}% off to ${scope === "all" ? "all products" : `${scope}: ${scopeValue}`}?`;
    if (!confirm(label)) return;
    setApplying(true);
    const products = await fetch("/api/products").then((r) => r.json());
    const target = products.filter((p) => {
      if (clear) return typeof p.salePrice === "number";
      if (scope === "brand") return p.brand === scopeValue;
      if (scope === "tag") return (p.tags || []).includes(scopeValue);
      return true;
    });
    let ok = 0;
    for (const p of target) {
      const salePrice = clear ? "" : Math.max(1, Math.round(p.price * (1 - percent / 100)));
      const res = await fetch(`/api/products/${p.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...p, salePrice }),
      });
      if (res.ok) ok++;
    }
    setApplying(false);
    flash(clear ? `Cleared ${ok} sale prices` : `Applied to ${ok} products`);
  };

  const TAGS = ["flagship", "new", "deal", "budget", "compact"];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* offer banner */}
      <section className="rounded-2xl border border-black/5 p-6">
        <h2 className="text-[17px] font-semibold text-ink">Site offer banner</h2>
        <p className="text-[13px] text-ink-soft mt-1">Shows as a strip across the top of every page.</p>

        <label className="flex items-center gap-2 mt-4 cursor-pointer">
          <input type="checkbox" checked={offer.active} onChange={(e) => setOffer({ ...offer, active: e.target.checked })} className="w-4 h-4 accent-accent" />
          <span className="text-[14px] text-ink">Banner active</span>
        </label>

        <div className="mt-4 space-y-3">
          <Field label="Message">
            <input value={offer.text} onChange={(e) => setOffer({ ...offer, text: e.target.value })} className={inputCls} placeholder="Summer sale — up to 20% off selected iPhones" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Promo code (optional)"><input value={offer.code} onChange={(e) => setOffer({ ...offer, code: e.target.value })} className={inputCls} placeholder="SUMMER20" /></Field>
            <Field label="Links to"><input value={offer.link} onChange={(e) => setOffer({ ...offer, link: e.target.value })} className={inputCls} placeholder="/shop" /></Field>
          </div>
        </div>

        {/* preview */}
        {offer.active && offer.text && (
          <div className="mt-4">
            <p className="text-[11px] text-ink-soft mb-1">Preview</p>
            <div className="rounded-lg bg-ink text-white text-center text-[12px] py-1.5 px-4">
              {offer.text}{offer.code && <span className="opacity-80"> · code <span className="font-semibold">{offer.code}</span></span>}
            </div>
          </div>
        )}

        <button onClick={saveOffer} disabled={saving} className="mt-5 rounded-full bg-accent px-5 py-2.5 text-[14px] font-medium text-white hover:bg-accent-hover disabled:opacity-40">
          {saving ? "Saving…" : "Save banner"}
        </button>
      </section>

      {/* bulk pricing */}
      <section className="rounded-2xl border border-black/5 p-6">
        <h2 className="text-[17px] font-semibold text-ink">Dynamic pricing</h2>
        <p className="text-[13px] text-ink-soft mt-1">Apply a percentage markdown across a group in one click.</p>

        <div className="mt-4 space-y-3">
          <Field label="Apply to">
            <select value={scope} onChange={(e) => { setScope(e.target.value); setScopeValue(e.target.value === "tag" ? "deal" : "Apple"); }} className={inputCls}>
              <option value="all">All products</option>
              <option value="brand">A brand</option>
              <option value="tag">A tag</option>
            </select>
          </Field>
          {scope === "brand" && (
            <Field label="Brand"><select value={scopeValue} onChange={(e) => setScopeValue(e.target.value)} className={inputCls}>{BRANDS.map((b) => <option key={b}>{b}</option>)}</select></Field>
          )}
          {scope === "tag" && (
            <Field label="Tag"><select value={scopeValue} onChange={(e) => setScopeValue(e.target.value)} className={inputCls}>{TAGS.map((t) => <option key={t}>{t}</option>)}</select></Field>
          )}
          <Field label={`Discount · ${percent}%`}>
            <input type="range" min="5" max="60" step="5" value={percent} onChange={(e) => setPercent(Number(e.target.value))} className="w-full accent-accent" />
          </Field>
        </div>

        <div className="mt-5 flex gap-2">
          <button onClick={() => applyBulk(false)} disabled={applying} className="rounded-full bg-accent px-5 py-2.5 text-[14px] font-medium text-white hover:bg-accent-hover disabled:opacity-40">
            {applying ? "Applying…" : `Apply ${percent}% off`}
          </button>
          <button onClick={() => applyBulk(true)} disabled={applying} className="rounded-full border border-black/15 px-5 py-2.5 text-[14px] text-ink hover:border-ink disabled:opacity-40">
            Clear all sales
          </button>
        </div>
        <p className="mt-3 text-[12px] text-ink-soft">Sets each product&rsquo;s sale price. Clear any time — original prices are untouched.</p>
      </section>
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-accent transition-colors";
function Field({ label, children }) {
  return <label className="block"><span className="block text-[12px] text-ink-soft mb-1">{label}</span>{children}</label>;
}
