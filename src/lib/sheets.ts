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
    // Use text/plain to keep this a "simple" CORS request — Apps Script
    // /exec endpoints do not respond to OPTIONS preflight. Body is still JSON;
    // Apps Script reads it from e.postData.contents regardless of Content-Type.
    headers: { "Content-Type": "text/plain;charset=utf-8" },
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
