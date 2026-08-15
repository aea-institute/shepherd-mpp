import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Signed identity handoff between the Shepherd Mental Edge apps.
 *
 * The main app is the identity provider: it confirms the athlete is a real
 * member of a real team, then mints a short-lived HMAC-signed token that rides
 * along in the tile link. Each sub-app verifies the token with the same shared
 * secret and signs the athlete straight in — no second login.
 *
 * Shared secret: SHEPHERD_HANDOFF_SECRET (identical in every Shepherd project).
 * With no secret configured, minting and verification both return null and the
 * apps fall back to their normal login screens.
 *
 * Keep this file byte-identical across the Shepherd repos.
 */

export type HandoffPayload = {
  /** athlete display name */
  n: string;
  /** athlete email, lowercased */
  e: string;
  /** team name, when known */
  t?: string | null;
  /** sport, when known */
  s?: string | null;
  /** expiry, unix seconds */
  exp: number;
};

/** Query-string parameter the token travels in. */
export const HANDOFF_PARAM = "sme";

/** One hour — long enough to cover a sitting, short enough that a shared link goes stale. */
const TTL_SECONDS = 60 * 60;

function b64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string): Buffer {
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

function secret(): string | null {
  const s = process.env.SHEPHERD_HANDOFF_SECRET;
  return s && s.length >= 32 ? s : null;
}

function sign(body: string, key: string): string {
  return b64url(createHmac("sha256", key).update(body).digest());
}

/** True when the shared secret is configured on this deployment. */
export function handoffConfigured(): boolean {
  return secret() !== null;
}

/** Mint a handoff token. Returns null when no secret is configured. */
export function createHandoffToken(input: Omit<HandoffPayload, "exp">): string | null {
  const key = secret();
  if (!key) return null;

  const payload: HandoffPayload = {
    ...input,
    exp: Math.floor(Date.now() / 1000) + TTL_SECONDS,
  };
  const body = b64url(Buffer.from(JSON.stringify(payload), "utf8"));
  return `${body}.${sign(body, key)}`;
}

/** Verify a handoff token. Returns the payload, or null if missing/forged/expired. */
export function verifyHandoffToken(token: string | null | undefined): HandoffPayload | null {
  const key = secret();
  if (!key || !token) return null;

  const dot = token.indexOf(".");
  if (dot < 1) return null;
  const body = token.slice(0, dot);
  const mac = token.slice(dot + 1);

  const expected = sign(body, key);
  const a = Buffer.from(mac, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(fromB64url(body).toString("utf8")) as HandoffPayload;
    if (!payload || typeof payload.e !== "string" || !payload.e) return null;
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
