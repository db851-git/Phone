// Browser-only image preparation for product photos.
// Pipeline: downscale → (optional) background removal → trim empty margins →
// export. The result drops into a fixed aspect frame with object-contain, so the
// phone always fills the frame regardless of the original photo's size.

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

// Draw an image onto a canvas, scaled so its longest side ≤ maxDim.
function toCanvas(img, maxDim = 1400) {
  let { width, height } = img;
  if (width > maxDim || height > maxDim) {
    const s = maxDim / Math.max(width, height);
    width = Math.round(width * s);
    height = Math.round(height * s);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(img, 0, 0, width, height);
  return canvas;
}

// Crop away uniform margins. With alpha, trims transparent pixels; otherwise
// trims near-white pixels. Returns a new tightly-cropped canvas (+ small pad).
function trim(canvas, { hasAlpha }) {
  const ctx = canvas.getContext("2d");
  const { width: w, height: h } = canvas;
  const { data } = ctx.getImageData(0, 0, w, h);
  let top = h, left = w, right = 0, bottom = 0, found = false;

  const isForeground = (i) => {
    const a = data[i + 3];
    if (hasAlpha) return a > 24;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    return !(r > 244 && g > 244 && b > 244); // not near-white
  };

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (isForeground((y * w + x) * 4)) {
        found = true;
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }
  if (!found) return canvas; // nothing detected — leave as-is

  const pad = Math.round(Math.max(right - left, bottom - top) * 0.04);
  left = Math.max(0, left - pad);
  top = Math.max(0, top - pad);
  right = Math.min(w - 1, right + pad);
  bottom = Math.min(h - 1, bottom + pad);

  const cw = right - left + 1;
  const ch = bottom - top + 1;
  const out = document.createElement("canvas");
  out.width = cw;
  out.height = ch;
  out.getContext("2d").drawImage(canvas, left, top, cw, ch, 0, 0, cw, ch);
  return out;
}

// Loaded from a CDN at runtime (browser only) so its ONNX/WASM runtime never
// goes through our build. webpackIgnore keeps the bundler from touching it.
let _bgModPromise = null;
function loadBgModule() {
  if (!_bgModPromise) {
    _bgModPromise = import(
      /* webpackIgnore: true */ "https://esm.sh/@imgly/background-removal@1.7.0"
    );
  }
  return _bgModPromise;
}

async function removeBg(canvas) {
  const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
  const mod = await loadBgModule();
  const removeBackground = mod.removeBackground || mod.default?.removeBackground || mod.default;
  const out = await removeBackground(blob, { output: { format: "image/png" } });
  return loadImage(URL.createObjectURL(out));
}

// Main entry. Returns { dataUrl, removed }.
export async function prepareImage(file, { removeBackground: doRemove = true } = {}) {
  const dataUrl = await fileToDataUrl(file);
  let canvas = toCanvas(await loadImage(dataUrl), 1400);
  let hasAlpha = false;

  if (doRemove) {
    try {
      const cutout = await removeBg(canvas);
      canvas = toCanvas(cutout, 1400);
      hasAlpha = true;
    } catch (e) {
      // Model failed to load/run — fall back to the plain image so uploads never break.
      console.warn("[imagePrep] background removal failed, keeping original:", e?.message);
    }
  }

  const trimmed = trim(canvas, { hasAlpha });
  const out = hasAlpha
    ? trimmed.toDataURL("image/png")
    : trimmed.toDataURL("image/jpeg", 0.85);
  return { dataUrl: out, removed: hasAlpha };
}
