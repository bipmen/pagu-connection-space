# Register page UX + 2FA code flow

Bring `src/routes/register.tsx` in line with the passwordless flow already implemented on `/login`, and reuse the same verification step.

## 1. Refactor: extract shared verify step

Move the existing `VerifyStep` component out of `src/routes/login.tsx` into a new shared file:

- New file: `src/components/auth/verify-step.tsx`
- Export `VerifyStep` (same props/behavior as today).
- Update `src/routes/login.tsx` to import it from the new location (no behavior change).

This lets both Login and Register render the identical verification UI.

## 2. Register page: request step

Rewrite `src/routes/register.tsx` so the "request" view contains:

- **Name** — required, non-empty, max 100 chars (zod).
- **Method tabs** — same Email / Phone pill selector as Login (`Mail` / `Phone` icons, `bg-muted` rounded-full container).
- **Identifier input** — label switches between "Email" and "Phone number"; same validators as Login:
  - Email: `z.string().trim().email()` → "Please enter a valid email address."
  - Phone: `/^\+?[1-9]\d{6,14}$/` → "Please enter a valid phone number."
- **Referral email** — required, validated as email.
  - Empty → "Please enter a referral email."
  - Invalid → "Please enter a valid referral email."
- **Remove** the existing "2FA method" field entirely (method is implied by the tab).
- Keep the existing FLINTA* approval reassurance card.

## 3. Primary CTA with tooltip

Replace "Send request" with **"Request access code"**.

- Wrap the button with Radix `Tooltip` (already in `src/components/ui/tooltip.tsx`).
- Trigger: hover on desktop, tap on mobile (Radix Tooltip opens on focus, which covers tap on touch devices; we'll also wire `onClick` to toggle controlled `open` state for reliable mobile behavior).
- Tooltip copy:
  > "To keep Pagu safe, registration and login use 2FA — a two-factor authentication method. We'll send a one-time code to your email or phone so only you can continue."
- Style: small rounded bubble, soft shadow, gold-tinted border to match the login popover (`border-gold/30 shadow-md`), max width ~64, positioned `side="top"` so it never overlaps inputs.
- Wrap the page in `TooltipProvider` (or rely on the one already in `__root.tsx` if present — will verify and add locally if not).

## 4. Submit behavior

On click:
1. Validate Name, Identifier (per selected method), and Referral email.
2. Show inline errors per field if invalid; do not advance.
3. Call `issueCode(method, identifier)` from `src/lib/auth-mock.ts` (already exists, generates a 5-digit code, logs it in dev, enforces 30s cooldown).
4. Switch local state to the verify step (same two-step pattern as Login — no URL change, so refreshing doesn't lose the pending code in the in-memory mock).
5. Render the shared `<VerifyStep />` with the chosen method and identifier.
6. On successful verify → `navigate({ to: "/profile" })`. On failure → "The login details are not valid or the code has expired. Please try again." (already wired inside `VerifyStep`).
7. "Send a new code" and "Try a different email or phone number" controls come for free from the shared component; "Back" returns to the register form (we'll pass an `onBack` that resets to the request step).

Note: Name and Referral are not persisted by the mock auth (no backend yet); they're validated client-side and held in component state. A real backend hookup is out of scope for this task.

## 5. Visual identity

Reuse existing tokens — no new colors. Cards keep `bg-card border border-border/60 rounded-2xl p-6 shadow-soft`, gold accents via `text-gold`, mobile-first single-column layout (already the case at `max-w-md`).

## Files

- **New**: `src/components/auth/verify-step.tsx` — extracted shared component.
- **Edit**: `src/routes/login.tsx` — import `VerifyStep` from new location; remove local copy.
- **Edit**: `src/routes/register.tsx` — full rewrite per above.

No new dependencies; no route additions (verification stays inline on `/register` and `/login`, redirecting to existing `/profile` on success).
