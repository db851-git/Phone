"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../../components/Reveal";
import { gbp } from "../../lib/format";

// Base trade-in values keyed by model line; multiplied by condition + storage.
const MODELS = [
  { name: "iPhone 17 Pro Max", base: 780 },
  { name: "iPhone 17 Pro", base: 700 },
  { name: "iPhone 16 Pro Max", base: 620 },
  { name: "iPhone 16 Pro", base: 520 },
  { name: "iPhone 16", base: 430 },
  { name: "iPhone 15 Pro Max", base: 500 },
  { name: "iPhone 15 Pro", base: 420 },
  { name: "iPhone 15", base: 340 },
  { name: "iPhone 14 Pro Max", base: 380 },
  { name: "iPhone 14", base: 280 },
  { name: "iPhone 13 Pro", base: 260 },
  { name: "iPhone 13", base: 220 },
  { name: "iPhone 12", base: 160 },
  { name: "iPhone 11", base: 120 },
  { name: "iPhone SE (2020)", base: 70 },
  { name: "Galaxy S25 Ultra", base: 560 },
  { name: "Galaxy S24 Ultra", base: 440 },
  { name: "Galaxy S24", base: 320 },
  { name: "Galaxy S23", base: 240 },
  { name: "Galaxy A55 / A5x", base: 130 },
];

const STORAGES = [
  { label: "64GB", mult: 0.92 },
  { label: "128GB", mult: 1 },
  { label: "256GB", mult: 1.1 },
  { label: "512GB", mult: 1.2 },
  { label: "1TB", mult: 1.28 },
];

const CONDITIONS = [
  { label: "Like new", desc: "Flawless, no marks", mult: 1 },
  { label: "Good", desc: "Light wear, screen perfect", mult: 0.82 },
  { label: "Fair", desc: "Visible scratches, works fully", mult: 0.62 },
  { label: "Broken", desc: "Cracked or faulty", mult: 0.32 },
];

const STEPS = [
  { n: 1, t: "Get your quote", d: "Pick your model and condition for an instant price." },
  { n: 2, t: "Send it free or drop in", d: "Post it with a prepaid label, or visit the store." },
  { n: 3, t: "Get paid same day", d: "Bank transfer or store credit — your choice." },
];

export default function SellPage() {
  const [model, setModel] = useState(MODELS[5].name);
  const [storage, setStorage] = useState("128GB");
  const [condition, setCondition] = useState("Good");

  const quote = useMemo(() => {
    const m = MODELS.find((x) => x.name === model)?.base || 100;
    const s = STORAGES.find((x) => x.label === storage)?.mult || 1;
    const c = CONDITIONS.find((x) => x.label === condition)?.mult || 1;
    return Math.round((m * s * c) / 5) * 5;
  }, [model, storage, condition]);

  const tradeBonus = Math.round(quote * 1.1 / 5) * 5;

  return (
    <>
      {/* hero */}
      <section className="wash pt-32 pb-14 md:pt-40 md:pb-20 text-center">
        <div className="mx-auto max-w-page px-5">
          <Reveal>
            <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-accent">Sell · Trade-In</p>
            <h1 className="display mt-3 text-[40px] md:text-[64px] font-semibold text-ink">
              Your old phone
              <br />
              <span className="text-ink-soft">is worth money.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[17px] text-ink-soft">
              Get an instant, fair quote. Free postage, same-day payment, and
              10% extra when you trade in against a phone from us.
            </p>
          </Reveal>
        </div>
      </section>

      {/* estimator */}
      <section className="mx-auto max-w-page px-5 -mt-4 pb-16">
        <Reveal>
          <div className="grid md:grid-cols-[1fr_320px] gap-6 rounded-[28px] bg-white p-6 md:p-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)] border border-black/5">
            <div className="space-y-6">
              <div>
                <label className="block text-[13px] font-semibold text-ink mb-2">Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-white px-3.5 py-3 text-[15px] outline-none focus:border-accent"
                >
                  {MODELS.map((m) => (
                    <option key={m.name} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-ink mb-2">Storage</label>
                <div className="flex flex-wrap gap-2">
                  {STORAGES.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => setStorage(s.label)}
                      className={`rounded-full px-4 py-2 text-[14px] border transition-colors ${
                        storage === s.label ? "bg-ink text-white border-ink" : "bg-white text-ink border-black/10 hover:border-ink"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-ink mb-2">Condition</label>
                <div className="grid grid-cols-2 gap-2">
                  {CONDITIONS.map((c) => (
                    <button
                      key={c.label}
                      onClick={() => setCondition(c.label)}
                      className={`text-left rounded-xl px-3.5 py-3 border transition-colors ${
                        condition === c.label ? "border-accent bg-accent/5" : "border-black/10 hover:border-ink"
                      }`}
                    >
                      <span className="block text-[14px] font-medium text-ink">{c.label}</span>
                      <span className="block text-[12px] text-ink-soft">{c.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* quote card */}
            <div className="rounded-2xl bg-ink text-white p-6 flex flex-col justify-between">
              <div>
                <p className="text-[13px] text-white/60">We&rsquo;ll pay you</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={quote}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="mt-1 text-[42px] font-semibold"
                  >
                    {gbp(quote)}
                  </motion.p>
                </AnimatePresence>
                <p className="mt-3 text-[13px] text-white/70">
                  or <span className="font-semibold text-white">{gbp(tradeBonus)}</span> in store credit
                  <span className="block text-white/50">(+10% trade-in bonus)</span>
                </p>
              </div>
              <div className="mt-6 space-y-2">
                <a href="/about" className="block rounded-full bg-white px-5 py-3 text-center text-[15px] font-medium text-ink hover:scale-[1.02] transition-transform">
                  Book a trade-in
                </a>
                <p className="text-center text-[11px] text-white/50">Final price confirmed after inspection.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* how it works */}
      <section className="bg-chalk">
        <div className="mx-auto max-w-page px-5 py-16 md:py-24">
          <Reveal>
            <h2 className="display text-[28px] md:text-[40px] font-semibold text-ink text-center mb-12">
              Three easy steps
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="rounded-3xl bg-white p-8 h-full">
                  <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-accent text-white text-[16px] font-semibold">
                    {s.n}
                  </span>
                  <h3 className="mt-4 text-[19px] font-semibold text-ink">{s.t}</h3>
                  <p className="mt-2 text-[14px] text-ink-soft leading-relaxed">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
