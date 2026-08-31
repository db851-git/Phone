# PhonePro — Operator Guide

Everything you can manage yourself, no code required. PhonePro is your shop, your
stock, and your prices — all controlled from one back office. Changes go live on
the storefront within about 60 seconds.

> A styled, shareable version of this guide is also published as an Artifact —
> ask for the link if you don't have it.

---

## 1. Getting in

The back office lives at the **`/admin`** page of your site
(e.g. `yourstore.com/admin`). It's password-protected — customers never see it.

1. Open `/admin` in any browser.
2. Enter your **staff password** and select **Sign in**.
3. You land on the **Overview** dashboard, with tabs for **Products**,
   **Offers & pricing**, and **Trade-in**.

The password is whatever was set as `ADMIN_PASSWORD`. Until you set your own it
defaults to `phonepro` — change it before you open to the public
(see [Going live](#7-going-live)).

> **Tip:** The **Overview** tab is your daily glance — product count, total stock
> value, and how many are on sale, featured, or out of stock.

---

## 2. Products

The **Products** tab is your full catalogue. Add, edit, or remove any phone —
every change appears on the storefront within a minute.

### Adding or editing a phone

1. On the **Products** tab, select **+ Add product** (or **Edit** on a row).
2. Fill in the details, add photos, then **Add to catalog** / **Save changes**.

| Field | What it does |
| --- | --- |
| Name | The model, e.g. "iPhone 15 Pro". |
| Brand | Apple or Samsung — drives the menus and filters. |
| Colour | Shown on the card and product page. |
| Storage & Grade | Capacity and condition grade (New, A+, A, B+, B, C). |
| Price | The normal selling price, in £. |
| Sale price | Optional. When set below the price, the site shows a struck-through original with a **Sale** badge. |
| Stock | Units in stock. Zero flags as out-of-stock on the Overview. |
| Feature on homepage | Adds the phone to "This week's picks" on the landing page. |
| Tags | flagship / new / deal / budget / compact — used by menus and bulk pricing. |

### Removing & bulk work

- **Delete** removes a phone immediately.
- **Search** filters the list as you type.
- **Export** downloads your whole catalogue as a file; **Import** loads one back
  in — handy for backups or bulk edits in a spreadsheet.

---

## 3. Photos

Open a product and use the **Photos** box. Drag images in or click to choose
them — you can add several per phone.

### Background removal & auto-fit

With **Auto-remove background & fit** on (the default), each photo is cleaned up:

- the background is **removed automatically**, leaving just the phone;
- empty space is trimmed and the phone is **enlarged to fill the frame**;
- every image lands in the same tidy 4:5 shape, so **any photo, any size, looks
  consistent**.

> **Tip:** You don't need to resize or edit photos first. Upload whatever you
> have — a quick snap or a supplier image — and the shop tidies it up.

> **Note:** Background removal runs in your browser using a small AI model. The
> **first** photo after opening the admin downloads that model (a few seconds);
> after that it's quick. If it can't run, the photo still uploads (trimmed and
> fitted). Turn the toggle off to upload a photo exactly as-is.

### Ordering

- The first photo is the **Primary** — what shows on cards and menus.
- Hover any thumbnail to **Make primary** or remove it.
- Extra photos become a swipeable gallery on the product page.

---

## 4. Descriptions

The **Description** field accepts simple formatting (Markdown), so a paragraph, a
bullet list, or a full spec table all display cleanly.

Paste something like this and it renders as a real table:

```
Immaculate condition, includes cable & 24-month warranty.

| Feature | Detail |
| --- | --- |
| Display | 6.1" OLED |
| Battery | 90%+ |
| Camera | Dual 48MP |
```

- `**bold**` makes text **bold**.
- Lines starting with `-` become bullet points.
- The `| … |` rows become a formatted table.

> **Tip:** The edit box shows a ready-made table template — copy it, swap the
> values, done.

---

## 5. Offers & pricing

### Site offer banner

A strip across the top of every page. Turn on **Banner active**, write a message,
add an optional promo code and where it links, then **Save banner**. A live
preview shows how it'll look. Untick and save to take it down.

### Dynamic pricing

Apply a markdown to a whole group at once:

1. Choose **Apply to** — everything, a brand, or a tag.
2. Drag the **discount** slider to the percentage you want.
3. Select **Apply X% off**. It sets a sale price on each matching phone.

> **Tip:** **Clear all sales** removes every markdown in one click. Original
> prices are never lost — sale prices sit on top of them.

---

## 6. Trade-in

The **Trade-in** tab controls what customers are quoted when they sell a phone to
you — and shows your margin.

### Buy-back values

Each model has a **base value** — what you'd pay for a like-new 128GB unit. Edit
any value, add or remove models, or switch one off. The **Sell** page quote
updates from these instantly.

> **Note:** If you see "these are the built-in defaults", select **Load defaults**
> once to copy them into your database so you can edit them.

### Adjustments

- **Storage ×** and **Condition ×** scale the base value up or down (512GB pays
  more; "Fair" pays less).
- **Store-credit bonus** is the extra % offered when a customer takes credit
  instead of cash.

Select **Save adjustments** to apply.

### Trade vs. retail margin

For any model you both buy and sell, the table shows **what you pay** next to
**what you sell it for**, and the margin in £ and %.

---

## 7. Going live

The site runs on Vercel (hosting) with a Neon PostgreSQL database. Two settings
make it fully live:

| Setting | What to set it to |
| --- | --- |
| `DATABASE_URL` | Your Neon connection string. Powers saving, uploads and live stock. |
| `ADMIN_PASSWORD` | Your chosen staff password for `/admin`. |

Add both under **Vercel → Settings → Environment Variables** for the
**Production** environment, then redeploy.

> **The database sets itself up.** On each deploy the site creates any missing
> tables and loads a starter catalogue automatically — no database commands by
> hand.

Without a database connected, the site still runs in **preview mode** from its
built-in sample data — you can browse everything, but saving is off until
`DATABASE_URL` is set.

Full hosting steps are in [`DEPLOY.md`](../DEPLOY.md).

---

## 8. Troubleshooting

**"Save failed" or "table does not exist"** — the database hasn't been set up on
this deployment. **Redeploy** the site; the build creates the tables
automatically. In Vercel, open the deployment's **Build Logs** and look for
`[db-setup] Schema in sync.` If it says the sync **failed**, your `DATABASE_URL`
isn't available to the Production build — add it and redeploy.

**A change isn't showing** — storefront pages refresh about once a minute. Wait
up to 60 seconds and reload. The `/admin` view is always current.

**Background removal isn't cutting out a photo** — it works best on clear shots of
a single phone. If it struggles, the photo still uploads (trimmed and fitted), or
switch the toggle off and upload an already-clean image.

**Uploads say the database isn't configured** — photos are stored in the
database, so uploading needs `DATABASE_URL` set. Same fix as "Save failed".

---

## 9. Reference

| Page | |
| --- | --- |
| `/` | Landing page |
| `/shop` | All phones, with filters & search |
| `/sell` | Trade-in quote for customers |
| `/admin` | Staff back office |

**Built with:** Next.js · PostgreSQL & Prisma · Tailwind CSS · Framer Motion.
Photos are stored in the database, so there's no separate image service to manage.

> **Coming next:** Apple-style colour options — set the colours a phone comes in,
> each with its own photos, shown as clickable swatches on the product page.
