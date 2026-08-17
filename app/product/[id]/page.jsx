import Link from "next/link";
import { notFound } from "next/navigation";
import ProductImage from "../../../components/ProductImage";
import AddToCart from "../../../components/AddToCart";
import ProductCard from "../../../components/ProductCard";
import Reveal from "../../../components/Reveal";
import { relatedProducts, specsFor, GRADE_INFO } from "../../../lib/products";
import { getProducts, getProductById } from "../../../lib/catalog";
import { gbp, rrp } from "../../../lib/format";

// Pre-render known products; new ones (added via /admin) render on demand.
export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const p = await getProductById(params.id);
  if (!p) return { title: "Not found — PhonePro" };
  return {
    title: `${p.name} ${p.storage} — PhonePro`,
    description: `${p.name} ${p.storage} in ${p.color}, ${p.grade === "New" ? "brand new" : "Grade " + p.grade}. ${gbp(p.price)}, unlocked with 24-month warranty.`,
  };
}

export default async function ProductPage({ params }) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  const all = await getProducts();
  const grade = GRADE_INFO[product.grade];
  const specs = specsFor(product);
  const was = rrp(product.price);
  const saving = was - product.price;
  const related = relatedProducts(product, all);

  return (
    <>
      <div className="mx-auto max-w-page px-5 pt-24 pb-16">
        <nav className="text-[13px] text-ink-soft mb-6">
          <Link href="/shop" className="hover:text-ink">Shop</Link>
          <span className="mx-2">/</span>
          <Link href={`/shop?brand=${product.brand}`} className="hover:text-ink">{product.brand}</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* visual */}
          <div className="md:sticky md:top-24">
            <div className="relative flex items-center justify-center rounded-[32px] bg-chalk p-10 h-[420px] md:h-[520px]">
              <ProductImage product={product} className="h-full w-auto drop-shadow-2xl" />
              <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-medium text-ink shadow-sm">
                <span className="w-2 h-2 rounded-full" style={{ background: grade.dot }} />
                {grade.label}
              </span>
            </div>
          </div>

          {/* details */}
          <div>
            <p className="text-[13px] uppercase tracking-wide text-ink-soft">{product.brand}</p>
            <h1 className="display mt-1 text-[32px] md:text-[44px] font-semibold text-ink">
              {product.name}
            </h1>
            <p className="mt-2 text-[16px] text-ink-soft">
              {product.storage} · {product.color} · Fully unlocked
            </p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-[32px] font-semibold text-ink">{gbp(product.price)}</span>
              {saving > 0 && (
                <>
                  <span className="text-[16px] text-ink-soft line-through">{gbp(was)}</span>
                  <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[12px] font-medium text-accent">
                    Save {gbp(saving)}
                  </span>
                </>
              )}
            </div>

            <div className="mt-6 rounded-2xl bg-chalk p-4 flex items-start gap-3">
              <span className="mt-1 w-2.5 h-2.5 rounded-full shrink-0" style={{ background: grade.dot }} />
              <div>
                <p className="text-[14px] font-semibold text-ink">{grade.label} condition</p>
                <p className="text-[13px] text-ink-soft">{grade.blurb}</p>
              </div>
            </div>

            <div className="mt-6">
              <AddToCart product={product} />
            </div>

            <ul className="mt-7 grid grid-cols-2 gap-y-3 gap-x-4 text-[13px] text-ink-soft">
              <li className="flex items-center gap-2"><Dot /> 24-month warranty</li>
              <li className="flex items-center gap-2"><Dot /> Free next-day delivery</li>
              <li className="flex items-center gap-2"><Dot /> 14-day returns</li>
              <li className="flex items-center gap-2"><Dot /> 100+ point tested</li>
            </ul>

            {/* specs */}
            <div className="mt-10">
              <h2 className="text-[18px] font-semibold text-ink mb-3">Tech specs</h2>
              <dl className="divide-y divide-black/5 border-y border-black/5">
                {specs.map((s) => (
                  <div key={s.k} className="flex justify-between gap-6 py-3 text-[14px]">
                    <dt className="text-ink-soft">{s.k}</dt>
                    <dd className="text-ink text-right">{s.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="bg-chalk">
          <div className="mx-auto max-w-page px-5 py-16">
            <Reveal>
              <h2 className="display text-[26px] md:text-[34px] font-semibold text-ink mb-8">
                You might also like
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function Dot() {
  return <span className="w-1.5 h-1.5 rounded-full bg-accent" />;
}
