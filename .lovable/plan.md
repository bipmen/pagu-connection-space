## Problem
All three forms (Contact, Newsletter, Registration tracking) fail to write to Google Sheets. Contact/Newsletter show "Something went wrong" because they `await` the call; Registration appears to work because it uses fire-and-forget (`trackToSheet`) that swallows errors.

Root cause: `src/lib/sheets.ts` sends `Content-Type: application/json`, which makes the browser fire a CORS **preflight** (`OPTIONS`). Google Apps Script `/exec` endpoints don't respond to preflight, so `fetch` throws before the POST runs.

## Fix
Edit only `src/lib/sheets.ts`:

- Change the request header to `Content-Type: text/plain;charset=utf-8` so the request qualifies as a "simple" CORS request and skips preflight.
- Keep the body as `JSON.stringify(payload)` — Apps Script reads `e.postData.contents` regardless of content type.
- Keep `mode: "cors"`, `redirect: "follow"`, and the existing function signatures (`submitToSheet`, `trackToSheet`, `SheetPayload`) so no other files need to change.

## Out of scope
- No changes to `contact-section.tsx`, `mailing-section.tsx`, or `register.tsx`.
- No changes to auth, validation, UI copy, or the Apps Script endpoint URL.

## Verification
1. Build passes.
2. Submit a test message via Contact and a test email via Newsletter from the preview; confirm success UI appears and rows land in the spreadsheet.

## Caveat
If the Apps Script's `doPost` reads `e.parameter.*` instead of `JSON.parse(e.postData.contents)`, the header fix alone won't make rows appear — the script must parse the JSON body. If rows still don't show up after this change, the Apps Script source needs a small tweak.
