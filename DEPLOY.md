# Deploying PhonePro

The site is a standard Next.js 14 app. Pick whichever host suits you — Vercel is
the fastest path, Docker is best if you want to self-host.

---

## Option A — Vercel (recommended, ~2 minutes)

Vercel is made by the Next.js team and needs zero configuration.

1. Push this repo to GitHub (already done on your branch).
2. Go to **vercel.com → Add New → Project** and import the `Phone` repo.
3. Framework preset is auto-detected as **Next.js**. Leave every setting default.
4. Click **Deploy**.

You'll get a live URL like `phonepro.vercel.app` in about a minute. Every future
`git push` redeploys automatically. To use your own domain, add it under
**Project → Settings → Domains**.

> No environment variables are required — the catalog is read from
> `data/products.json` at build time.

---

## Option B — Netlify

1. **netlify.com → Add new site → Import from Git**, choose the repo.
2. Build command: `npm run build` · Publish directory: `.next`
3. Add the official **`@netlify/plugin-nextjs`** plugin when prompted (Netlify
   suggests it automatically for Next.js sites), then deploy.

---

## Option C — Docker (self-host anywhere)

A production `Dockerfile` is included. It uses Next's `standalone` output for a
small image.

```bash
docker build -t phonepro .
docker run -p 3000:3000 phonepro
# open http://localhost:3000
```

This runs anywhere Docker does — a VPS, Fly.io, Railway, Render, AWS, etc.

---

## Option D — any Node host

```bash
npm install
npm run build
npm run start      # serves on port 3000 (set PORT to change)
```

Put it behind Nginx/Caddy for TLS if you're exposing it publicly.

---

## After deploying

- **Manage stock** at `/admin` — add, edit or remove phones, then **Export JSON**
  and commit the file to `data/products.json` to publish changes.
- **Add real photos**: see `public/images/README.md`.
- **Take real payments**: the checkout is a front-end demo. Wire it to Stripe
  Checkout (needs your Stripe keys) when you're ready to sell live.
