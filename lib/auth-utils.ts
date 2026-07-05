import { scryptSync, randomBytes, timingSafeEqual, createHmac } from "crypto";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

const SESSION_COOKIE = "kasuwar_session";

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("Variable SESSION_SECRET manquante.");
  return secret;
}

export function signSession(userId: number): string {
  const payload = `${userId}.${Date.now() + 1000 * 60 * 60 * 24 * 30}`; // 30 jours
  const sig = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

export function verifySession(token: string | undefined): number | null {
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const [userId, expires, sig] = decoded.split(".");
    const payload = `${userId}.${expires}`;
    const expectedSig = createHmac("sha256", getSecret()).update(payload).digest("hex");
    if (sig !== expectedSig) return null;
    if (Date.now() > Number(expires)) return null;
    return Number(userId);
  } catch {
    return null;
  }
}

export { SESSION_COOKIE };
