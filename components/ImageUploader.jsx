"use client";

import { useRef, useState } from "react";

// Reads a File, downsizes it on a canvas and returns a compressed JPEG data URL.
// Keeps uploads small (~100–400KB) so DB-stored photos stay lean.
function compress(file, maxDim = 1400, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function ImageUploader({ value = [], onChange }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    setBusy(true);
    setError("");
    const added = [];
    for (const file of files) {
      try {
        const dataUrl = await compress(file);
        const res = await fetch("/api/images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUrl }),
        });
        const json = await res.json();
        if (res.ok) added.push(json.url);
        else setError(json.error || "Upload failed");
      } catch {
        setError("Couldn't process that image");
      }
    }
    if (added.length) onChange([...value, ...added]);
    setBusy(false);
  };

  const removeAt = (i) => onChange(value.filter((_, idx) => idx !== i));
  const makePrimary = (i) => {
    if (i === 0) return;
    const next = [...value];
    const [item] = next.splice(i, 1);
    next.unshift(item);
    onChange(next);
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`cursor-pointer rounded-2xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
          dragOver ? "border-accent bg-accent/5" : "border-black/15 hover:border-ink"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <p className="text-[14px] text-ink">
          {busy ? "Uploading…" : "Drag photos here or click to upload"}
        </p>
        <p className="text-[12px] text-ink-soft mt-0.5">JPG / PNG · multiple allowed</p>
      </div>

      {error && <p className="mt-2 text-[12px] text-red-600">{error}</p>}

      {value.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {value.map((url, i) => (
            <div key={url + i} className="relative group aspect-square rounded-xl overflow-hidden bg-chalk border border-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute top-1 left-1 rounded-full bg-accent text-white text-[9px] px-1.5 py-0.5">
                  Primary
                </span>
              )}
              <div className="absolute inset-0 flex items-end justify-between p-1 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                {i !== 0 ? (
                  <button
                    type="button"
                    onClick={() => makePrimary(i)}
                    className="text-white text-[10px] bg-black/50 rounded px-1.5 py-0.5"
                  >
                    Make primary
                  </button>
                ) : <span />}
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="text-white text-[11px] bg-black/50 rounded px-1.5 py-0.5"
                  aria-label="Remove"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
