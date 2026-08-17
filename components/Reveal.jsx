"use client";

import { motion } from "framer-motion";

// Apple-style scroll reveal: content eases up + fades in as it enters view.
export default function Reveal({ children, delay = 0, y = 32, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
