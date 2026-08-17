"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "../../components/CartProvider";
import { gbp } from "../../lib/format";

const FIELDS = [
  { name: "email", label: "Email", type: "email", auto: "email", group: "Contact" },
  { name: "firstName", label: "First name", type: "text", auto: "given-name", half: true, group: "Delivery" },
  { name: "lastName", label: "Last name", type: "text", auto: "family-name", half: true },
  { name: "address", label: "Address", type: "text", auto: "street-address" },
  { name: "city", label: "Town / City", type: "text", auto: "address-level2", half: true },
  { name: "postcode", label: "Postcode", type: "text", auto: "postal-code", half: true },
  { name: "card", label: "Card number", type: "text", auto: "cc-number", group: "Payment", placeholder: "4242 4242 4242 4242" },
  { name: "expiry", label: "Expiry", type: "text", auto: "cc-exp", half: true, placeholder: "MM/YY" },
  { name: "cvc", label: "CVC", type: "text", auto: "cc-csc", half: true, placeholder: "123" },
];

export default function CheckoutPage() {
  const { items, subtotal, count, clear } = useCart();
  const [form, setForm] = useState({});
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const set = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const onSubmit = (e) => {
    e.preventDefault();
    const id = "PP-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    setOrderId(id);
    setPlaced(true);
    clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (placed) {
    return (
      <div className="mx-auto max-w-lg px-5 pt-36 pb-24 text-center min-h-[70vh]">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 16 }}
          className="mx-auto w-16 h-16 rounded-full bg-green-500 flex items-center justify-center"
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </motion.div>
        <h1 className="display mt-6 text-[32px] font-semibold text-ink">Order confirmed</h1>
        <p className="mt-3 text-[15px] text-ink-soft">
          Thanks{form.firstName ? `, ${form.firstName}` : ""}! Your order{" "}
          <span className="font-medium text-ink">{orderId}</span> is being prepared.
          A confirmation has been sent to {form.email || "your email"}.
        </p>
        <p className="mt-1 text-[14px] text-ink-soft">Free next-day delivery — you&rsquo;ll get tracking shortly.</p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent-hover"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="mx-auto max-w-lg px-5 pt-36 pb-24 text-center min-h-[60vh]">
        <h1 className="display text-[30px] font-semibold text-ink">Your bag is empty</h1>
        <Link href="/shop" className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-white text-[15px] font-medium hover:bg-accent-hover">
          Shop phones
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-page px-5 pt-28 pb-20">
      <h1 className="display text-[34px] md:text-[48px] font-semibold text-ink mb-10">Checkout</h1>
      <form onSubmit={onSubmit} className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">
        <div className="space-y-8">
          {["Contact", "Delivery", "Payment"].map((group) => (
            <section key={group}>
              <h2 className="text-[18px] font-semibold text-ink mb-4">{group}</h2>
              <div className="grid grid-cols-2 gap-4">
                {FIELDS.filter((f) => (f.group || currentGroup(f)) === group).map((f) => (
                  <div key={f.name} className={f.half ? "col-span-1" : "col-span-2"}>
                    <label className="block text-[12px] text-ink-soft mb-1">{f.label}</label>
                    <input
                      required
                      type={f.type}
                      autoComplete={f.auto}
                      placeholder={f.placeholder || ""}
                      value={form[f.name] || ""}
                      onChange={(e) => set(f.name, e.target.value)}
                      className="w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-accent transition-colors"
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
          <p className="text-[12px] text-ink-soft">
            🔒 This is a demo checkout — no card is charged and no data is stored.
          </p>
        </div>

        {/* summary */}
        <aside className="lg:sticky lg:top-24 h-fit rounded-3xl bg-chalk p-6">
          <h2 className="text-[16px] font-semibold text-ink mb-4">Your order</h2>
          <div className="space-y-3 max-h-64 overflow-auto">
            {items.map((i) => (
              <div key={i.id} className="flex justify-between gap-3 text-[13px]">
                <span className="text-ink">
                  {i.name} <span className="text-ink-soft">×{i.qty}</span>
                  <br />
                  <span className="text-ink-soft text-[12px]">{i.storage} · {i.grade === "New" ? "New" : "Grade " + i.grade}</span>
                </span>
                <span className="text-ink whitespace-nowrap">{gbp(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-black/10 space-y-1.5 text-[14px]">
            <div className="flex justify-between text-ink-soft">
              <span>Subtotal</span><span className="text-ink">{gbp(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>Delivery</span><span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between pt-2 mt-1 border-t border-black/10 text-[16px] font-semibold text-ink">
              <span>Total</span><span>{gbp(subtotal)}</span>
            </div>
          </div>
          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-accent px-6 py-3.5 text-[16px] font-medium text-white hover:bg-accent-hover"
          >
            Pay {gbp(subtotal)}
          </button>
        </aside>
      </form>
    </div>
  );
}

function currentGroup(f) {
  // Fields without an explicit group inherit the previous field's group.
  const idx = FIELDS.indexOf(f);
  for (let i = idx; i >= 0; i--) if (FIELDS[i].group) return FIELDS[i].group;
  return "Contact";
}
