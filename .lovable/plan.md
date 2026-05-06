# Login Page UX Improvements

Update `src/routes/login.tsx` to clarify the email login flow and explain 2FA in human language.

## Changes

1. **Dynamic input label** — Track the active tab (`email` | `phone`) in component state. Label reads "Email" when Email tab is active, "Phone" when Phone tab is active. Input `type` and placeholder switch accordingly.

2. **Reworded helper text** — Replace:
   > "We'll send you a 2FA code to sign in. No passwords required."
   
   with:
   > "We'll send you a one-time verification code to sign in — no password needed."

3. **Tooltip on "one-time verification code"** — Wrap that phrase in a trigger element (underlined, dotted, gold accent) that opens a small bubble on hover (desktop) AND tap (mobile).
   
   Content: *"2FA (two-factor authentication) is an extra security step. We send a code to your email so only you can access your account."*

## Technical Approach

- Use the existing **`Popover`** primitive (`src/components/ui/popover.tsx`) instead of `Tooltip`. Radix Popover handles both click/tap and works reliably on touch devices; Radix Tooltip is hover-focused and inconsistent on mobile. Tap-outside-to-close is built in.
- Trigger: an inline `<button type="button">` styled as underlined text so it's keyboard-focusable and accessible.
- Add `onMouseEnter` / `onMouseLeave` handlers on the trigger to also open on hover for desktop parity, while Popover's click behavior covers mobile tap.
- Style the `PopoverContent` with `max-w-xs`, smaller text, and rely on existing `bg-popover` / `shadow-md` tokens (already dark-mode aware). Add a subtle gold border to match brand.
- Convert the tab buttons to controlled state (`useState<"email" | "phone">`), apply active styling conditionally rather than hard-coded.

## Files Touched

- `src/routes/login.tsx` — only file modified. Add `useState` import and `Popover` imports from existing UI primitives. No new dependencies.

## Out of Scope

- No backend/auth wiring changes.
- No changes to the register page (can mirror this pattern in a follow-up if desired).
