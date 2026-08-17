import Link from "next/link";

const COLS = [
  {
    title: "Shop",
    links: [
      { href: "/shop?brand=Apple", label: "iPhone" },
      { href: "/shop?brand=Samsung", label: "Samsung Galaxy" },
      { href: "/shop?tag=deal", label: "Clearance deals" },
      { href: "/shop?tag=new", label: "Brand new" },
    ],
  },
  {
    title: "Services",
    links: [
      { href: "/sell", label: "Sell your phone" },
      { href: "/sell", label: "Trade-in" },
      { href: "/about", label: "24-month warranty" },
      { href: "/about", label: "Grading explained" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About PhonePro" },
      { href: "/about", label: "Visit the store" },
      { href: "/about", label: "Contact us" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-chalk text-ink-soft text-[12px]">
      <div className="mx-auto max-w-page px-5 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="text-[15px] font-semibold tracking-tight">
              <span className="text-ink">Phone</span>
              <span className="text-accent">Pro</span>
            </Link>
            <p className="mt-3 leading-relaxed">
              Buy · Sell · Trade-In.<br />Certified refurbished phones with a
              24-month warranty.
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-ink font-semibold mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="hover:text-ink transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-black/10 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} PhonePro. All rights reserved.</p>
          <p>Every device unlocked, tested and cleaned. Prices include VAT.</p>
        </div>
      </div>
    </footer>
  );
}
