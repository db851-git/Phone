# PhonePro

A clean, Apple-inspired e-commerce site for **PhonePro** — a Buy · Sell · Trade-In
refurbished phone store. Built with Next.js, Tailwind CSS and Framer Motion for
smooth, tasteful scroll animations.

## Features

- **Storefront** with an animated hero, category tiles and featured picks
- **Shop** with live filtering by brand, condition grade and price, plus search & sort
- **Product pages** with grade badges, tech specs, savings and "you might also like"
- **Cart** with quantity controls, persisted to `localStorage`
- **Checkout** — a working multi-step order form with confirmation (demo, no real payment)
- **Sell / Trade-In** with an instant quote estimator (model × storage × condition)
- **About** page explaining grading, warranty and the store
- **Database-backed catalog** (PostgreSQL via Prisma) — the source of truth for
  the whole storefront, with automatic fallback to the seed JSON when no DB is set
- **Back-office admin** at `/admin` — password-gated, tabbed dashboard:
  - **Overview**: catalog size, stock value, on-sale / featured / out-of-stock counts
  - **Products**: add/edit/delete, drag-and-drop **photo uploads** (multiple per
    phone, auto-compressed), **descriptions**, **sale prices**, **featured** toggle,
    stock counts, JSON import/export
  - **Offers & pricing**: publish a site-wide **offer banner**, and apply
    **dynamic markdowns** in bulk (X% off a brand / tag / everything, one click)
  - **Trade-in**: manage buy-back values, storage/condition multipliers and the
    store-credit bonus — plus a live **trade-vs-retail margin** table
- Changes go live for all visitors (ISR ~60s)
- **REST API**: public catalog/settings/trade-in reads; protected product,
  trade-in, settings and image endpoints. Photos are stored in the database — no
  S3/Cloudinary to configure.
- **Product galleries** on the PDP with an SVG fallback when a phone has no photos
- Fully responsive, keyboard-friendly, and respects `prefers-reduced-motion`

The catalog lives in a **Postgres database** in production. `data/products.json`
is the starter seed (real models, grades and prices from the PhonePro shop window)
and the read-only fallback when `DATABASE_URL` isn't set. Manage stock from
`/admin`. See **DEPLOY.md** for database + hosting setup and
**public/images/README.md** to add real photos.

## Environment

Copy `.env.example` to `.env.local`:

```
DATABASE_URL=postgresql://…      # Postgres (Vercel Postgres / Neon / Supabase)
ADMIN_PASSWORD=your-password     # gate for /admin (defaults to "phonepro")
```

Then: `npm run db:push` (create tables) and `npm run db:seed` (load the catalog).

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build

```bash
npm run build
npm run start
```

## Tech

| Area        | Choice                       |
| ----------- | ---------------------------- |
| Framework   | Next.js 14 (App Router)      |
| Styling     | Tailwind CSS                 |
| Animation   | Framer Motion                |
| Database    | PostgreSQL + Prisma          |
| Cart state  | React Context + localStorage |

## Project structure

```
app/            routes (home, shop, product, cart, checkout, sell, about, admin)
app/api/        products CRUD + admin login/session route handlers
components/     Nav, Footer, ProductCard, PhoneVisual, CartProvider, …
lib/            catalog (DB), products (helpers/seed), db, auth, format
prisma/         schema.prisma + seed script
data/           products.json (starter seed / fallback)
```

## Notes

- Product imagery is rendered as crisp inline SVG (`components/PhoneVisual.jsx`)
  by default; add real photos any time (see `public/images/README.md`).
- The storefront reads from the database; `/admin` edits go live within ~60s
  (ISR). Without `DATABASE_URL` the site serves the seed JSON read-only.
- Checkout is a front-end demo — payment integration (Stripe) is the planned
  next step.
