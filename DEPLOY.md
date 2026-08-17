# Deploying PhonePro

The site is a standard Next.js 14 app backed by a PostgreSQL database (via
Prisma). Pick whichever host suits you — Vercel is the fastest path, Docker is
best if you want to self-host.

> **No database yet?** The site still runs — it falls back to `data/products.json`
> in read-only "preview mode". Add a database when you want live stock editing.

---

## Database setup (do this once)

1. **Create a free Postgres database.** Any of these work:
   - **Vercel Postgres** (Storage tab in your Vercel project) — easiest with Vercel
   - **Neon** (neon.tech) or **Supabase** (supabase.com) — free tiers, copy the connection string
2. **Set environment variables** on your host:
   - `DATABASE_URL` — the Postgres connection string
   - `ADMIN_PASSWORD` — the password for the `/admin` stock manager
3. **Create the tables and seed them** (run locally once, pointing at the DB, or
   from your host's shell):
   ```bash
   npm run db:push     # create the tables from prisma/schema.prisma
   npm run db:seed     # load the starter catalog from data/products.json
   ```

That's it — the storefront now reads from the database, and edits in `/admin`
go live for everyone.

---

## Option A — Vercel (recommended, ~2 minutes)

Vercel is made by the Next.js team and needs zero configuration.

1. Push this repo to GitHub (already done on your branch).
2. Go to **vercel.com → Add New → Project** and import the `Phone` repo.
3. Framework preset is auto-detected as **Next.js**. Leave every setting default.
4. Add environment variables under **Settings → Environment Variables**:
   `DATABASE_URL` and `ADMIN_PASSWORD` (see *Database setup* above).
5. Click **Deploy**, then run the one-time seed (`npm run db:push && npm run db:seed`
   locally against the same `DATABASE_URL`).

You'll get a live URL like `phonepro.vercel.app` in about a minute. Every future
`git push` redeploys automatically. To use your own domain, add it under
**Project → Settings → Domains**.

> Skip the env vars to deploy in preview mode first — the site runs from the seed
> JSON until you connect a database.

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
