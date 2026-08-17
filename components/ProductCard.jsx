"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import PhoneVisual from "./PhoneVisual";
import { GRADE_INFO } from "../lib/products";
import { gbp } from "../lib/format";

export default function ProductCard({ product, index = 0 }) {
  const grade = GRADE_INFO[product.grade];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/product/${product.id}`}
        className="group block rounded-3xl bg-white p-6 transition-all duration-300 hover:shadow-[0_18px_50px_-20px_rgba(0,0,0,0.25)] hover:-translate-y-1"
      >
        <div className="relative flex items-center justify-center h-52 rounded-2xl bg-chalk overflow-hidden">
          <span
            className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-ink"
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: grade.dot }} />
            {product.grade === "New" ? "New" : `Grade ${product.grade}`}
          </span>
          <PhoneVisual
            product={product}
            className="h-44 w-auto drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="mt-5">
          <p className="text-[11px] uppercase tracking-wide text-ink-soft">{product.brand}</p>
          <h3 className="mt-0.5 text-[15px] font-semibold text-ink leading-snug">
            {product.name}
          </h3>
          <p className="text-[13px] text-ink-soft">{product.storage} · {product.color}</p>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-[17px] font-semibold text-ink">{gbp(product.price)}</span>
            <span className="text-[12px] text-accent group-hover:underline">View →</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
