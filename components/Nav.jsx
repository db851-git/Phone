"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";

const LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?brand=Apple", label: "iPhone" },
  { href: "/shop?brand=Samsung", label: "Samsung" },
  { href: "/sell", label: "Sell / Trade-In" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const { count } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // Live offer banner, controlled from the admin.
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setOffer(d.offer))
      .catch(() => {});
  }, []);

  const showOffer = offer?.active && offer?.text;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "bg-white/80 backdrop-blur-xl border-b border-black/5"
          : "bg-white/0"
      }`}
    >
      {showOffer && (
        <Link
          href={offer.link || "/shop"}
          className="block bg-ink text-white text-center text-[12px] py-1.5 px-4 hover:bg-ink/90 transition-colors"
        >
          {offer.text}
          {offer.code && (
            <span className="ml-1 opacity-80">
              · code <span className="font-semibold">{offer.code}</span>
            </span>
          )}
        </Link>
      )}
      <nav className="mx-auto max-w-page px-5 h-12 flex items-center justify-between text-[13px] text-ink">
        <Link href="/" className="flex items-center gap-1.5 font-semibold tracking-tight">
          <span className="text-ink">Phone</span>
          <span className="text-accent">Pro</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-ink/80 hover:text-ink transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative hover:opacity-70 transition-opacity" aria-label="Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-accent text-white text-[10px] font-semibold flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button
            className="md:hidden -mr-1"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-black/5 bg-white/95 backdrop-blur-xl">
          <div className="mx-auto max-w-page px-5 py-3 flex flex-col">
            {LINKS.map((l) => (
              <Link key={l.label} href={l.href} className="py-3 text-[15px] text-ink border-b border-black/5 last:border-0">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
