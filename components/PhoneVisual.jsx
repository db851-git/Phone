// A crisp, Apple-style SVG render of a phone back.
// Colour + camera layout are derived from the model so each product looks distinct.

const COLOR_MAP = {
  "Cosmic Orange": "#d3522a",
  "Deep Blue": "#2b3a67",
  "Blue Titanium": "#3f4c66",
  "Natural Titanium": "#b7b1a6",
  "Black Titanium": "#2a2a2c",
  "White Titanium": "#e9e7e2",
  "Desert Titanium": "#c1a57b",
  Silver: "#d7d9dc",
  Graphite: "#42433f",
  "Sierra Blue": "#9fb6d1",
  "Deep Purple": "#5a5570",
  "Space Black": "#26262a",
  "Space Grey": "#5b5d61",
  Midnight: "#2b3040",
  Ultramarine: "#3d55c9",
  Purple: "#b6b2e0",
  Green: "#cfe3d0",
  Pink: "#f4d4dc",
  Coral: "#ff6f5e",
  Red: "#c8102e",
  Black: "#2a2a2c",
  White: "#ededf0",
  "Onyx Black": "#1f2023",
  "Titanium Gray": "#7c7f86",
  "Awesome Blue": "#8fb7e8",
  "Prism Blue": "#8aa0c6",
  Blue: "#4a76c4",
};

function isPro(name) {
  return /Pro/.test(name);
}

export default function PhoneVisual({ product, className = "" }) {
  const fill = COLOR_MAP[product?.color] || "#3f4c66";
  const pro = isPro(product?.name || "");
  const samsung = product?.brand === "Samsung";
  const lensRing = "#0b0b0c";
  const lensGlass = "#1c1c22";

  return (
    <svg
      viewBox="0 0 220 440"
      className={className}
      role="img"
      aria-label={`${product?.name} in ${product?.color}`}
    >
      <defs>
        <linearGradient id={`body-${product?.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity="0.95" />
          <stop offset="55%" stopColor={fill} />
          <stop offset="100%" stopColor={fill} stopOpacity="0.82" />
        </linearGradient>
        <linearGradient id={`sheen-${product?.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="30%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* body */}
      <rect x="26" y="10" width="168" height="420" rx="40" fill={`url(#body-${product?.id})`} />
      <rect x="26" y="10" width="168" height="420" rx="40" fill={`url(#sheen-${product?.id})`} />
      <rect x="26" y="10" width="168" height="420" rx="40" fill="none" stroke="#000" strokeOpacity="0.12" />

      {/* camera cluster */}
      {samsung ? (
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(56, ${58 + i * 46})`}>
              <circle cx="0" cy="0" r="17" fill={lensRing} />
              <circle cx="0" cy="0" r="11" fill={lensGlass} />
              <circle cx="-3" cy="-3" r="3" fill="#4a4a55" />
            </g>
          ))}
        </g>
      ) : pro ? (
        <g transform="translate(46, 44)">
          <rect x="0" y="0" width="88" height="88" rx="26" fill="#000" fillOpacity="0.16" />
          {[
            [24, 24],
            [64, 24],
            [24, 64],
          ].map(([cx, cy], i) => (
            <g key={i} transform={`translate(${cx}, ${cy})`}>
              <circle r="16" fill={lensRing} />
              <circle r="10" fill={lensGlass} />
              <circle cx="-3" cy="-3" r="2.6" fill="#565663" />
            </g>
          ))}
          <circle cx="64" cy="64" r="6" fill="#d9d55a" />
        </g>
      ) : (
        <g transform="translate(46, 44)">
          <rect x="0" y="0" width="66" height="66" rx="22" fill="#000" fillOpacity="0.16" />
          {[
            [22, 22],
            [22, 44],
          ].map(([cx, cy], i) => (
            <g key={i} transform={`translate(${cx}, ${cy})`}>
              <circle r="14" fill={lensRing} />
              <circle r="9" fill={lensGlass} />
              <circle cx="-3" cy="-3" r="2.4" fill="#565663" />
            </g>
          ))}
          <circle cx="46" cy="46" r="5" fill="#d9d55a" />
        </g>
      )}

      {/* logo hint */}
      {product?.brand === "Apple" ? (
        <path
          transform="translate(101, 250) scale(0.9)"
          d="M11.7 6.6c-.7.9-1.9 1.6-3 1.5-.2-1.2.4-2.4 1-3.2.7-.9 2-1.5 3-1.6.2 1.3-.3 2.5-1 3.3zm1 .7c-1.6-.1-3 .9-3.7.9-.8 0-2-.9-3.3-.8-1.7 0-3.2 1-4.1 2.5-1.7 3-.4 7.5 1.3 9.9.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.6-1-2.6-3.9 0-2.4 2-3.6 2-3.6-1.1-1.6-2.8-1.8-3.5-1.9z"
          fill="#ffffff"
          fillOpacity="0.5"
        />
      ) : (
        <text
          x="110"
          y="256"
          textAnchor="middle"
          fontSize="15"
          letterSpacing="1"
          fill="#ffffff"
          fillOpacity="0.5"
          fontFamily="sans-serif"
        >
          SAMSUNG
        </text>
      )}
    </svg>
  );
}
