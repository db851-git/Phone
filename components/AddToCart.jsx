"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartProvider";
import { effectivePrice } from "../lib/products";

export default function AddToCart({ product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const onAdd = () => {
    add({
      id: product.id,
      name: product.name,
      brand: product.brand,
      storage: product.storage,
      color: product.color,
      grade: product.grade,
      price: effectivePrice(product),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={onAdd}
        className="rounded-full bg-accent px-6 py-3.5 text-[16px] font-medium text-white transition-colors hover:bg-accent-hover"
      >
        Add to bag
      </button>
      <Link
        href="/cart"
        className="rounded-full border border-black/15 px-6 py-3.5 text-center text-[16px] font-medium text-ink transition-colors hover:border-ink"
      >
        Go to bag
      </Link>
      <AnimatePresence>
        {added && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-[13px] text-green-600"
          >
            ✓ Added to your bag
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
