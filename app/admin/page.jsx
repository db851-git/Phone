"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Overview from "../../components/admin/Overview";
import ProductsTab from "../../components/admin/ProductsTab";
import OffersTab from "../../components/admin/OffersTab";
import TradeInTab from "../../components/admin/TradeInTab";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "products", label: "Products" },
  { id: "offers", label: "Offers & pricing" },
  { id: "tradein", label: "Trade-in" },
];

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [tab, setTab] = useState("overview");
  const [toast, setToast] = useState("");

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const loadSession = async () => {
    const s = await fetch("/api/admin/session").then((r) => r.json());
    setSession(s);
    return s;
  };

  useEffect(() => { loadSession(); }, []);

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    loadSession();
  };

  if (session && !session.authed) {
    return <LoginGate session={session} onDone={loadSession} />;
  }

  const dbEnabled = !!session?.dbEnabled;

  return (
    <div className="mx-auto max-w-page px-5 pt-24 pb-20 min-h-screen">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] uppercase tracking-[0.18em] text-accent">PhonePro · Staff</p>
          <h1 className="display text-[32px] md:text-[44px] font-semibold text-ink">Back office</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="rounded-full border border-black/15 px-4 py-2 text-[14px] text-ink hover:border-ink">View store</Link>
          <button onClick={logout} className="rounded-full border border-black/15 px-4 py-2 text-[14px] text-ink-soft hover:border-ink">Log out</button>
        </div>
      </div>

      {/* banners */}
      {session && !dbEnabled && (
        <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-[13px] text-amber-800">
          <span className="font-medium">Preview mode —</span> no database is connected, so changes won&rsquo;t save.
          Set <code>DATABASE_URL</code> (see DEPLOY.md) to go live.
        </div>
      )}
      {dbEnabled && session?.defaultPassword && (
        <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-[13px] text-amber-800">
          <span className="font-medium">Heads up —</span> using the default admin password. Set <code>ADMIN_PASSWORD</code> to secure this.
        </div>
      )}

      {/* tabs */}
      <div className="mt-6 flex gap-1 border-b border-black/10 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-[14px] font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              tab === t.id ? "border-accent text-ink" : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "overview" && <Overview onGoTo={setTab} />}
        {tab === "products" && <ProductsTab dbEnabled={dbEnabled} flash={flash} />}
        {tab === "offers" && <OffersTab dbEnabled={dbEnabled} flash={flash} />}
        {tab === "tradein" && <TradeInTab dbEnabled={dbEnabled} flash={flash} />}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] rounded-full bg-ink text-white text-[13px] px-4 py-2 shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function LoginGate({ session, onDone }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    setBusy(false);
    if (res.ok) onDone();
    else setErr("Incorrect password");
  };

  return (
    <div className="mx-auto max-w-sm px-5 pt-40 pb-24 min-h-[70vh]">
      <p className="text-[12px] uppercase tracking-[0.18em] text-accent text-center">Staff area</p>
      <h1 className="display text-[30px] font-semibold text-ink text-center mt-2">Back office</h1>
      <form onSubmit={submit} className="mt-8 rounded-3xl bg-chalk p-6">
        <label className="block text-[13px] text-ink-soft mb-1">Password</label>
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus className="w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-accent" />
        {err && <p className="mt-2 text-[13px] text-red-600">{err}</p>}
        <button type="submit" disabled={busy} className="mt-4 w-full rounded-full bg-accent px-5 py-3 text-[15px] font-medium text-white hover:bg-accent-hover disabled:opacity-40">
          {busy ? "Checking…" : "Sign in"}
        </button>
        {session?.defaultPassword && (
          <p className="mt-3 text-center text-[12px] text-ink-soft">Demo password: <code className="text-ink">phonepro</code></p>
        )}
      </form>
      <Link href="/" className="mt-6 block text-center text-[13px] text-accent hover:underline">← Back to store</Link>
    </div>
  );
}
