import { createHmac, timingSafeEqual } from 'node:crypto';

// A token is `<recipient>.<expiresAt>.<hex hmac>`, signed with the gateway's key.
export function sign(recipient, expiresAt, key) {
  const body = `${recipient}.${expiresAt}`;
  return `${body}.${createHmac('sha256', key).update(body).digest('hex')}`;
}

// The recipient a token names, or null when it is malformed, forged or expired.
export function verify(token, key, now = Date.now()) {
  const parts = String(token).split('.');
  if (parts.length !== 3) return null;
  const [recipient, expiresAt, mac] = parts;
  const want = createHmac('sha256', key).update(`${recipient}.${expiresAt}`).digest();
  const got = Buffer.from(mac, 'hex');
  if (got.length !== want.length || !timingSafeEqual(got, want)) return null;
  if (!(Number(expiresAt) > now)) return null;
  return recipient;
}
