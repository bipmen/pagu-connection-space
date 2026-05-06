# Login Verification Flow + Logo Refresh

Two related changes: implement the full passwordless login flow (email/phone → 5-digit code → profile) and clean up the brand mark in header & footer.

---

## Part 1 — Login Flow

### State machine (single page, two steps)

Keep everything inside `src/routes/login.tsx`. Use a local `step` state:
- `"request"` → email/phone form
- `"verify"` → 5-digit code form

No URL change between steps (avoids exposing intermediate state). On successful verify → `useNavigate({ to: "/profile" })`.

### Mock auth store — `src/lib/auth-mock.ts` (new)

Module-scoped (in-memory) helpers, easy to swap for a backend later:

```ts
type Pending = { method: "email" | "phone"; identifier: string; code: string; expiresAt: number };
let pending: Pending | null = null;
const TTL_MS = 5 * 60 * 1000;        // 5 min expiry
const RESEND_COOLDOWN_MS = 30 * 1000; // 30s

export function issueCode(method, identifier): { ok: true } | { ok: false; retryInMs: number }
export function verifyCode(code: string): "ok" | "invalid" | "expired"
export function getPending(): { method, identifier } | null
export function clearPending(): void
```

- Code is generated with `crypto.getRandomValues` → 5-digit string.
- **Never** rendered to the DOM. Logged to `console.info` only in dev (so the user can test). Comment marks it as a mock seam.
- Cooldown tracked via `lastIssuedAt`; `issueCode` returns `retryInMs` if still cooling down.

### Request step UI (Email / Phone tabs)

Reuse the existing tab + Popover (2FA tooltip) layout. Validation with **zod**:

- Email: `z.string().trim().email()` → "Please enter a valid email address."
- Phone: `z.string().trim().regex(/^\+?[1-9]\d{6,14}$/)` (E.164-ish) → "Please enter a valid phone number."

Inline error appears under the input in destructive color; input border switches to `border-destructive` while invalid. Submit calls `issueCode`, then transitions to `verify` step.

### Verify step UI

- Headline: "Enter your verification code"
- Description: "We sent a 5-digit code to your {email|phone}. It may take a few minutes to arrive." (Shows the masked identifier, e.g. `j••••@gmail.com` or `+49 ••• ••• 1234`.)
- Input: existing `InputOTP` primitive (`src/components/ui/input-otp.tsx`) with 5 slots — looks great, accessible, paste-friendly.
- Primary: **Verify Code** (disabled until 5 digits entered).
- Secondary: **Send a new code** — disabled with countdown text "Send a new code in 23s" while cooldown is active. On success shows toast/inline note: "A new code has been sent. It may take a few minutes to arrive."
- Tertiary link: **Try a different email or phone number** → returns to `request` step and clears state.
- Error state (invalid/expired): "The login details are not valid or the code has expired. Please try again." plus a **Try again** button that just clears the input (cooldown rules still apply for resend).

Use `sonner` (already in the project) for the resend confirmation toast.

### Profile placeholder — `src/routes/profile.tsx` (new)

```tsx
export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [
    { title: "Your Profile — Pagu" },
    { name: "description", content: "Your Pagu community space." },
  ]}),
  component: ProfilePage,
});
```

Centered card with Header/Footer wrapper:
- Headline: "Welcome to your Pagu profile"
- Subtext: "Your community space is being prepared."
- Subtle gold divider, no further features.

`routeTree.gen.ts` is auto-regenerated — do not touch.

---

## Part 2 — Logo Refresh (Header + Footer)

### `src/components/header.tsx`
- Remove the `<span>Pagu</span>` next to the logo.
- Increase image size: `h-10 w-auto` on mobile, `lg:h-12` on desktop (current is `h-9`). Bump header height tracking with it: `h-16 lg:h-20` stays fine.
- Keep the wrapping `<Link to="/">` so the logo is still the home anchor. Add `aria-label="Pagu — home"` since the visible text is gone.

### `src/components/footer.tsx`
- Remove the `<span>Pagu</span>` next to the logo.
- Increase image size from `h-10` to `h-14` (slightly larger, still balanced with the tagline below).
- Add `aria-label="Pagu — home"` on the link.

No CSS-token changes; existing dark/light contrast on `pagu-logo.webp` already works in both themes.

---

## Files

**New**
- `src/lib/auth-mock.ts`
- `src/routes/profile.tsx`

**Edited**
- `src/routes/login.tsx` — full two-step flow, validation, masked identifier, OTP input, resend cooldown, error states.
- `src/components/header.tsx` — drop wordmark, enlarge logo, aria-label.
- `src/components/footer.tsx` — drop wordmark, enlarge logo, aria-label.

**Untouched**
- `src/routeTree.gen.ts` (auto-regenerates).
- Design tokens in `src/styles.css` already cover the requested palette.

---

## Out of scope
- Real email/SMS delivery (clearly marked seam in `auth-mock.ts`).
- Auth session persistence / route guards on `/profile` — placeholder is publicly reachable for now.
- Register page parity (can mirror the same pattern in a follow-up).
