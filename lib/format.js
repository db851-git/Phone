export function gbp(n) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
  }).format(n);
}

// Rough "was" price so shoppers see the saving — refurb sits ~72% of RRP.
export function rrp(price) {
  return Math.round((price / 0.72) / 5) * 5 + 4.99 - 4.99 || Math.round(price / 0.72);
}
