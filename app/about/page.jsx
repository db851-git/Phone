import Reveal from "../../components/Reveal";
import { GRADE_INFO } from "../../lib/products";

export const metadata = {
  title: "About & Store — PhonePro",
  description: "How PhonePro grades, tests and warranties every refurbished phone. Visit us in-store or get in touch.",
};

const VALUES = [
  { t: "Rigorously tested", d: "Every device passes a 100+ point diagnostic covering battery, cameras, speakers, buttons and connectivity before it reaches the shelf." },
  { t: "Fully unlocked", d: "Use any network, any SIM. No carrier locks, no surprises." },
  { t: "24-month warranty", d: "Twice the industry norm. If something goes wrong, we fix or replace it — no fuss." },
  { t: "Data wiped & clean", d: "Professionally sanitised and cleaned, so your phone arrives fresh and secure." },
];

export default function AboutPage() {
  return (
    <>
      <section className="wash pt-32 pb-14 md:pt-40 md:pb-20 text-center">
        <div className="mx-auto max-w-3xl px-5">
          <Reveal>
            <h1 className="display text-[40px] md:text-[64px] font-semibold text-ink">
              Refurbished, done right.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[17px] md:text-[19px] text-ink-soft">
              PhonePro is your local specialist for buying, selling and trading
              phones. Great devices, honest grading, and a warranty that actually
              means something.
            </p>
          </Reveal>
        </div>
      </section>

      {/* values */}
      <section className="mx-auto max-w-page px-5 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-5">
          {VALUES.map((v, i) => (
            <Reveal key={v.t} delay={i * 0.06}>
              <div className="rounded-3xl bg-chalk p-8 h-full">
                <h3 className="text-[20px] font-semibold text-ink">{v.t}</h3>
                <p className="mt-2 text-[15px] text-ink-soft leading-relaxed">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* grading explained */}
      <section className="bg-chalk">
        <div className="mx-auto max-w-page px-5 py-16 md:py-24">
          <Reveal>
            <h2 className="display text-[28px] md:text-[40px] font-semibold text-ink mb-3">
              Our grading, explained
            </h2>
            <p className="text-[15px] text-ink-soft mb-10 max-w-2xl">
              No jargon. Here&rsquo;s exactly what each grade means so you know
              precisely what you&rsquo;re getting.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(GRADE_INFO).map(([g, info], i) => (
              <Reveal key={g} delay={(i % 3) * 0.06}>
                <div className="rounded-2xl bg-white p-6 h-full">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: info.dot }} />
                    <h3 className="text-[16px] font-semibold text-ink">{info.label}</h3>
                  </div>
                  <p className="mt-2 text-[14px] text-ink-soft">{info.blurb}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* store / contact */}
      <section className="mx-auto max-w-page px-5 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <Reveal>
            <div>
              <h2 className="display text-[28px] md:text-[40px] font-semibold text-ink">Visit the store</h2>
              <p className="mt-4 text-[15px] text-ink-soft leading-relaxed">
                Come and see our full range in person. Our team can help you buy,
                sell, or trade in on the spot — usually while you wait.
              </p>
              <dl className="mt-6 space-y-3 text-[15px]">
                <div className="flex gap-3">
                  <dt className="w-24 text-ink-soft">Hours</dt>
                  <dd className="text-ink">Mon–Sat 9:00–18:30 · Sun 11:00–17:00</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-24 text-ink-soft">Phone</dt>
                  <dd className="text-ink">Call in-store for stock &amp; quotes</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-24 text-ink-soft">Services</dt>
                  <dd className="text-ink">Buy · Sell · Trade-In · Accessories · Repairs</dd>
                </div>
              </dl>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-[28px] bg-gradient-to-br from-[#2a2a2c] to-[#1d1d1f] text-white p-10 min-h-[280px] flex flex-col justify-center">
              <p className="text-[13px] uppercase tracking-[0.18em] text-accent">PhonePro</p>
              <p className="mt-2 text-[26px] font-semibold">Buy · Sell · Trade In</p>
              <p className="mt-3 text-[15px] text-white/70">
                Accessories too — cases, tempered glass, chargers, power banks and
                more for every model, old and new.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
