"use client";

import { useState } from "react";
import PhoneVisual from "./PhoneVisual";

// Shows a real product photo when `product.image` is set (and loads OK),
// otherwise falls back to the crisp SVG render. Keeps the same height-class
// API as PhoneVisual so it can be dropped in anywhere the SVG was used.
export default function ProductImage({ product, className = "" }) {
  const [ok, setOk] = useState(true);
  const src = product?.image;

  if (src && ok) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={`${product.name} in ${product.color}`}
        className={`${className} object-contain`}
        loading="lazy"
        onError={() => setOk(false)}
      />
    );
  }
  return <PhoneVisual product={product} className={className} />;
}
