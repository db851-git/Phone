import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-5 pt-40 pb-24 text-center min-h-[70vh]">
      <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-accent">404</p>
      <h1 className="display mt-3 text-[36px] font-semibold text-ink">Page not found</h1>
      <p className="mt-3 text-[15px] text-ink-soft">
        The page you&rsquo;re after has moved or never existed.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent-hover"
      >
        Back to home
      </Link>
    </div>
  );
}
