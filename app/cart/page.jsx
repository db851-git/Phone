"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../components/CartProvider";
import PhoneVisual from "../../components/PhoneVisual";
import { getProduct, GRADE_INFO } from "../../lib/products";
import { gbp } from "../../lib/format";

export default function CartPage() {
  const { items, subtotal, setQty, remove, count } = useCart();
  const delivery = subtotal > 0 && subtotal < 500 ? 0 : 0; // free delivery always

  return (
    <div className="mx-auto max-w-page px-5 pt-28 pb-20 min-h-[70vh]">
      <h1 className="display text-[34px] md:text-[48px] font-semibold text-ink">Your bag</h1>

      {count === 0 ? (
        <div className="mt-10 rounded-3xl bg-chalk p-16 text-center">
          <p className="text-[17px] text-ink">Your bag is empty.</p>
          <p className="mt-1 text-[14px] text-ink-soft">Find your next phone in the shop.</p>
          <Link
            href="/shop"
            className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent-hover"
          >
            Shop phones
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid lg:grid-cols-[1fr_360px] gap-10">
          <div className="divide-y divide-black/5 border-y border-black/5">
            <AnimatePresence initial={false}>
              {items.map((item) => {
                const full = getProduct(item.id) || item;
                const grade = GRADE_INFO[item.grade];
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-4 py-5"
                  >
                    <Link href={`/product/${item.id}`} className="shrink-0 w-24 h-28 rounded-2xl bg-chalk flex items-center justify-center">
                      <PhoneVisual product={full} className="h-24 w-auto" />
                    </Link>
                    <div className="flex-1">
                      <div className="flex justify-between gap-4">
                        <div>
                          <Link href={`/product/${item.id}`} className="text-[15px] font-semibold text-ink hover:underline">
                            {item.name}
                          </Link>
                          <p className="text-[13px] text-ink-soft">
                            {item.storage} · {item.color}
                          </p>
                          <p className="mt-1 inline-flex items-center gap-1.5 text-[12px] text-ink-soft">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: grade?.dot }} />
                            {item.grade === "New" ? "New" : `Grade ${item.grade}`}
                          </p>
                        </div>
                        <p className="text-[15px] font-semibold text-ink whitespace-nowrap">
                          {gbp(item.price * item.qty)}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-black/10">
                          <button
                            onClick={() => setQty(item.id, item.qty - 1)}
                            className="px-3 py-1 text-ink-soft hover:text-ink"
                            aria-label="Decrease"
                          >
                            −
                          </button>
                          <span className="px-2 text-[14px] w-6 text-center">{item.qty}</span>
                          <button
                            onClick={() => setQty(item.id, item.qty + 1)}
                            className="px-3 py-1 text-ink-soft hover:text-ink"
                            aria-label="Increase"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => remove(item.id)}
                          className="text-[13px] text-ink-soft hover:text-accent"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* summary */}
          <aside className="lg:sticky lg:top-24 h-fit rounded-3xl bg-chalk p-6">
            <h2 className="text-[17px] font-semibold text-ink">Summary</h2>
            <div className="mt-4 space-y-2 text-[14px]">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal ({count} item{count !== 1 ? "s" : ""})</span>
                <span className="text-ink">{gbp(subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Delivery</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between pt-3 mt-2 border-t border-black/10 text-[17px] font-semibold text-ink">
                <span>Total</span>
                <span>{gbp(subtotal + delivery)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-6 block rounded-full bg-accent px-6 py-3.5 text-center text-[16px] font-medium text-white hover:bg-accent-hover"
            >
              Checkout
            </Link>
            <Link href="/shop" className="mt-3 block text-center text-[13px] text-accent hover:underline">
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
