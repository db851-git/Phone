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
- **Admin stock manager** at `/admin` — add/edit/delete products, import/export JSON
- **`/api/products`** endpoint serving the live catalog as JSON
- **Real-photo support** with automatic SVG fallback (`components/ProductImage.jsx`)
- Fully responsive, keyboard-friendly, and respects `prefers-reduced-motion`

Inventory lives in `data/products.json` (seeded with real models, grades and
prices from the PhonePro shop window). Manage it from `/admin`, or swap it for a
CMS / database when you're ready. See **DEPLOY.md** to go live and
**public/images/README.md** to add real photos.

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

| Area        | Choice                     |
| ----------- | -------------------------- |
| Framework   | Next.js 14 (App Router)    |
| Styling     | Tailwind CSS               |
| Animation   | Framer Motion              |
| State       | React Context + localStorage |

## Project structure

```
app/            routes (home, shop, product, cart, checkout, sell, about)
components/     Nav, Footer, ProductCard, PhoneVisual, CartProvider, …
lib/            products data + formatting helpers
```

## Notes

- Product imagery is rendered as crisp inline SVG (`components/PhoneVisual.jsx`),
  so there are no external image assets to manage. Drop in real photos later by
  swapping that component for `<Image>`.
- Checkout and trade-in are front-end demos — wire them to Stripe and a backend
  to go fully live.
