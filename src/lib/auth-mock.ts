// MOCK auth seam — replace with backend (email/SMS provider) later.
// No code is rendered to the DOM. In dev we log to console for testing.

export type AuthMethod = "email" | "phone";

type Pending = {
  method: AuthMethod;
  identifier: string;
  code: string;
  expiresAt: number;
  issuedAt: number;
};

const TTL_MS = 5 * 60 * 1000;
export const RESEND_COOLDOWN_MS = 30 * 1000;

let pending: Pending | null = null;

function generate5Digit(): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return String(buf[0] % 100000).padStart(5, "0");
}

export type IssueResult =
  | { ok: true }
  | { ok: false; reason: "cooldown"; retryInMs: number };

export function issueCode(method: AuthMethod, identifier: string): IssueResult {
  const now = Date.now();
  if (
    pending &&
    pending.method === method &&
    pending.identifier === identifier &&
    now - pending.issuedAt < RESEND_COOLDOWN_MS
  ) {
    return {
      ok: false,
      reason: "cooldown",
      retryInMs: RESEND_COOLDOWN_MS - (now - pending.issuedAt),
    };
  }

  const code = generate5Digit();
  pending = {
    method,
    identifier,
    code,
    issuedAt: now,
    expiresAt: now + TTL_MS,
  };

  // Mock delivery — in production, send via email/SMS provider here.
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info(`[pagu mock] verification code for ${identifier}: ${code}`);
  }

  return { ok: true };
}

export type VerifyResult = "ok" | "invalid" | "expired" | "none";

// Dev master code — lets you bypass real code delivery while testing.
const DEV_MASTER_CODE = "12345";

export function verifyCode(code: string): VerifyResult {
  if (code === DEV_MASTER_CODE) {
    pending = null;
    return "ok";
  }
  if (!pending) return "none";
  if (Date.now() > pending.expiresAt) return "expired";
  if (code !== pending.code) return "invalid";
  pending = null;
  return "ok";
}

export function getPending(): { method: AuthMethod; identifier: string } | null {
  if (!pending) return null;
  return { method: pending.method, identifier: pending.identifier };
}

export function getCooldownRemaining(): number {
  if (!pending) return 0;
  return Math.max(0, RESEND_COOLDOWN_MS - (Date.now() - pending.issuedAt));
}

export function clearPending(): void {
  pending = null;
}

export function maskIdentifier(method: AuthMethod, value: string): string {
  if (method === "email") {
    const [local, domain] = value.split("@");
    if (!domain) return value;
    const head = local.slice(0, 1);
    return `${head}${"•".repeat(Math.max(1, local.length - 1))}@${domain}`;
  }
  // phone
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 4) return value;
  const last = digits.slice(-4);
  const prefix = value.startsWith("+") ? "+" : "";
  return `${prefix}${"•".repeat(Math.max(3, digits.length - 4))} ${last}`;
}
