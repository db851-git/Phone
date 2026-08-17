import crypto from "node:crypto";

// Lightweight staff auth for the admin write API. A shared password (ADMIN_PASSWORD)
// is exchanged for an HMAC token stored in an httpOnly cookie. Reads stay public;
// only create/update/delete require the cookie.
export const ADMIN_COOKIE = "pp_admin";
const TOKEN_SUBJECT = "phonepro-admin-v1";

function secret() {
  // Falls back to a demo password so the feature works out of the box; set
  // ADMIN_PASSWORD in production to lock it down.
  return process.env.ADMIN_PASSWORD || "phonepro";
}

export function makeToken() {
  return crypto.createHmac("sha256", secret()).update(TOKEN_SUBJECT).digest("hex");
}

export function verifyToken(token) {
  if (!token) return false;
  const expected = makeToken();
  const a = Buffer.from(String(token));
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function checkPassword(pw) {
  return typeof pw === "string" && pw.length > 0 && pw === secret();
}

export function usingDefaultPassword() {
  return !process.env.ADMIN_PASSWORD;
}
