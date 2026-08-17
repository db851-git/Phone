"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductImage from "./ProductImage";

// PDP gallery: real uploaded photos with thumbnails, or the SVG fallback when
// a product has no photos yet.
export default function ProductGallery({ product }) {
  const images = product.images || [];
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative flex items-center justify-center rounded-[32px] bg-chalk p-10 h-[420px] md:h-[520px]">
        <ProductImage product={product} className="h-full w-auto drop-shadow-2xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="relative flex items-center justify-center rounded-[32px] bg-chalk overflow-hidden h-[420px] md:h-[520px]">
        <AnimatePresence mode="wait">
          <motion.img
            key={images[active]}
            src={images[active]}
            alt={`${product.name} photo ${active + 1}`}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-contain p-6"
          />
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2.5 flex-wrap">
          {images.map((url, i) => (
            <button
              key={url + i}
              onClick={() => setActive(i)}
              className={`w-16 h-16 rounded-xl overflow-hidden bg-chalk border-2 transition-colors ${
                i === active ? "border-accent" : "border-transparent hover:border-black/20"
              }`}
              aria-label={`View photo ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
