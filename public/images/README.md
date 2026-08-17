# Product photos

By default every phone is drawn as a crisp SVG (`components/PhoneVisual.jsx`), so
the shop looks complete with no image files at all. To use **real photos**, drop
them here and point each product at its file.

## How to add a photo

1. Save the image in this folder, e.g. `public/images/ip15pro-128-a.jpg`
   (using the product `id` as the filename keeps things tidy).
2. Set the `image` field on that product to the public path:

   ```json
   { "id": "ip15pro-128-a", "image": "/images/ip15pro-128-a.jpg" }
   ```

   You can do this two ways:
   - **Via the admin UI** at `/admin` → edit the product → paste the Image URL, or
   - directly in `data/products.json`.

3. That's it. `components/ProductImage.jsx` automatically shows the photo when
   `image` is set and **falls back to the SVG** if the field is empty or the file
   fails to load — so you can migrate one phone at a time.

## Tips

- **Format**: `.webp` or `.jpg`, roughly square, ~1000×1000px, on a plain white
  or transparent background matches the storefront's look.
- **External URLs** work too (e.g. a CDN link) — just paste the full URL.
- Keep filenames lowercase with no spaces.
- Only use images you have the rights to (your own photos, or supplier/press
  assets you're licensed to use).
