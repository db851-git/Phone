"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ProductImage from "./ProductImage";
import { gbp } from "../lib/format";

export default function HomeHero({ hero }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="wash relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="mx-auto max-w-page px-5 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-[13px] font-medium text-accent uppercase tracking-[0.18em]"
        >
          Buy · Sell · Trade-In
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="display mt-3 text-[42px] md:text-[76px] font-semibold text-ink"
        >
          The phone you want.
          <br />
          <span className="text-ink-soft">For a lot less.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-5 max-w-xl text-[17px] md:text-[19px] text-ink-soft leading-relaxed"
        >
          Certified refurbished iPhone and Samsung Galaxy. Fully unlocked,
          rigorously tested, and backed by a 24-month warranty.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex items-center justify-center gap-4 text-[15px]"
        >
          <Link
            href="/shop"
            className="rounded-full bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Shop all phones
          </Link>
          <Link href="/sell" className="text-accent font-medium hover:underline">
            Sell your phone →
          </Link>
        </motion.div>
      </div>

      <motion.div
        style={{ y, scale, opacity: fade }}
        className="mx-auto mt-14 flex max-w-page items-center justify-center px-5"
      >
        <div className="relative">
          <ProductImage product={hero} className="h-[360px] md:h-[460px] w-auto drop-shadow-2xl" />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="absolute -right-4 top-8 md:right-10 rounded-2xl bg-white/90 backdrop-blur px-4 py-3 shadow-lg text-left"
          >
            <p className="text-[11px] text-ink-soft">
              {hero.name} · {hero.grade === "New" ? "New" : `Grade ${hero.grade}`}
            </p>
            <p className="text-[18px] font-semibold text-ink">{gbp(hero.price)}</p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
