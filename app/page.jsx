import Link from "next/link";
import HomeHero from "../components/HomeHero";
import Reveal from "../components/Reveal";
import ProductCard from "../components/ProductCard";
import ProductImage from "../components/ProductImage";
import { products, getProduct } from "../lib/products";
import { gbp } from "../lib/format";

const FEATURED = [
  "ip17pm-256-aplus",
  "ip16pro-128-a",
  "ip15pm-256-a",
  "sgs25u-256-a",
  "ip13pm-128-b",
  "ip11-128-a",
  "ip16-128-new",
  "ipxr-64-a",
];

const TRUST = [
  { k: "24-month", v: "warranty on every device" },
  { k: "100+ point", v: "diagnostic check" },
  { k: "Free", v: "next-day UK delivery" },
  { k: "14-day", v: "no-quibble returns" },
];

export default function Home() {
  const featured = FEATURED.map(getProduct).filter(Boolean);
  const iphone = getProduct("ip16pm-256-aplus");
  const samsung = getProduct("sgs25u-256-a");

  return (
    <>
      <HomeHero />

      {/* trust strip */}
      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto max-w-page px-5 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST.map((t, i) => (
            <Reveal key={t.k} delay={i * 0.05} y={16}>
              <div className="text-center md:text-left">
                <p className="text-[20px] font-semibold text-ink">{t.k}</p>
                <p className="text-[13px] text-ink-soft">{t.v}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* category split */}
      <section className="mx-auto max-w-page px-5 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { p: iphone, title: "iPhone", copy: "From the iPhone 17 Pro to the everyday SE.", href: "/shop?brand=Apple", bg: "from-[#eef1f6] to-[#dfe6f1]" },
            { p: samsung, title: "Galaxy", copy: "Ultra flagships to wallet-friendly A-series.", href: "/shop?brand=Samsung", bg: "from-[#f1eef6] to-[#e6def1]" },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1}>
              <Link
                href={c.href}
                className={`group relative flex flex-col justify-between rounded-[28px] bg-gradient-to-br ${c.bg} p-8 md:p-10 min-h-[320px] overflow-hidden`}
              >
                <div>
                  <h3 className="display text-[30px] md:text-[38px] font-semibold text-ink">{c.title}</h3>
                  <p className="mt-2 text-[15px] text-ink-soft max-w-xs">{c.copy}</p>
                  <p className="mt-3 text-[13px] text-ink">From {gbp(c.title === "iPhone" ? 64.99 : 74.99)}</p>
                  <span className="mt-4 inline-block text-accent text-[14px] font-medium group-hover:underline">
                    Explore {c.title} →
                  </span>
                </div>
                <ProductImage
                  product={c.p}
                  className="absolute -right-6 -bottom-6 h-64 w-auto opacity-90 drop-shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2"
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* featured grid */}
      <section className="bg-chalk">
        <div className="mx-auto max-w-page px-5 py-16 md:py-24">
          <Reveal>
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="display text-[30px] md:text-[42px] font-semibold text-ink">
                  This week&rsquo;s picks
                </h2>
                <p className="mt-2 text-[15px] text-ink-soft">Hand-checked stock, ready to ship.</p>
              </div>
              <Link href="/shop" className="hidden md:inline text-accent text-[14px] font-medium hover:underline">
                View all {products.length} →
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/shop" className="text-accent text-[14px] font-medium hover:underline">
              View all {products.length} phones →
            </Link>
          </div>
        </div>
      </section>

      {/* trade-in banner */}
      <section className="mx-auto max-w-page px-5 py-16 md:py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] bg-ink text-white p-10 md:p-16">
            <div className="relative z-10 max-w-lg">
              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-accent">
                Trade-In
              </p>
              <h2 className="display mt-3 text-[30px] md:text-[44px] font-semibold">
                Turn your old phone into instant credit.
              </h2>
              <p className="mt-4 text-[16px] text-white/70">
                Get a fair, upfront quote in seconds. Bring it in-store or post it
                free — we handle the data wipe and pay you the same day.
              </p>
              <Link
                href="/sell"
                className="mt-7 inline-block rounded-full bg-white px-6 py-3 text-[15px] font-medium text-ink transition-transform hover:scale-105"
              >
                Get your quote
              </Link>
            </div>
            <div className="pointer-events-none absolute -right-10 -bottom-16 opacity-30 md:opacity-70">
              <ProductImage product={getProduct("ip14pm-1tb-b")} className="h-80 w-auto rotate-12" />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
