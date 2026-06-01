// Reusable Google Sheets submission utility (via Apps Script web app).
// All form submissions across the platform funnel through submitToSheet().

const SHEETS_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbyMaEorzrkE_erHAuBlYLrglRew4G8AmThbfP_oO_EhHoaVvxxpwzEx8cxpbPmouvc03Q/exec";

export type SheetName =
  | "Contact Messages"
  | "Newsletter Subscribers"
  | "User Registrations";

export interface SheetPayload {
  sheet: SheetName;
  values: (string | number | boolean | null | undefined)[];
}

export async function submitToSheet(payload: SheetPayload): Promise<void> {
  const res = await fetch(SHEETS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Apps Script web apps accept simple requests without preflight when
    // Content-Type is text/plain; using application/json here per spec.
    body: JSON.stringify(payload),
    redirect: "follow",
    mode: "cors",
  });
  if (!res.ok) {
    throw new Error(`Sheet submission failed: ${res.status}`);
  }
}

// Fire-and-forget tracking; never throws (used for non-blocking analytics).
export function trackToSheet(payload: SheetPayload): void {
  submitToSheet(payload).catch((err) => {
    if (import.meta.env.DEV) {
      console.warn("[sheets] tracking failed:", err);
    }
  });
}
