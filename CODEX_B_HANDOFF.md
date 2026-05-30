# Codex B Handoff

This document is the current backend/auth/data handoff from Codex A on branch `codex/platform-next-migration`.

Use this together with [TEAM_BACKEND_INTEGRATION_TASKS.md](C:/Users/Dell/Documents/Pagu/pagu-connection-space/TEAM_BACKEND_INTEGRATION_TASKS.md:1) and [Spec.md](C:/Users/Dell/Documents/Pagu/pagu-connection-space/Spec.md:1).

## Goal

Codex B should now build backend/auth/data work against the `Next.js` app surface, not the old TanStack/Vite route files.

The platform state is now:

- Active runtime: `Next.js 16 App Router`
- Default local dev command: `npm run dev`
- Active typecheck for Next: `npm run typecheck`
- Legacy fallback typecheck: `npm run typecheck:legacy`
- Legacy Vite/TanStack files still exist for reference and Lovable-based UI work, but they are not the primary runtime

Codex A has also now extended the active Next surface beyond the original handoff:

- `/profile` now has the newer profile-completion UI
- `/community-events` now exists as a Next route with isolated mock data
- `/contact` text cleanup is done, but the form is still a mock submit

## Branch And Ownership

Current Codex A branch:

- `codex/platform-next-migration`

Codex B should work on its own branch:

- suggested: `codex/backend-auth-data`

If two people split Codex B, use:

- `codex/backend-auth-membership`
- `codex/backend-profile-support-contact`

Do not change these Codex A owner files unless explicitly coordinated:

- `package.json`
- `package-lock.json`
- `next.config.ts`
- `tsconfig.json`
- `tsconfig.legacy.json`
- `src/app/layout.tsx`
- broad route migration files in `src/app/**`

Codex B should own:

- `src/app/api/**`
- `middleware.ts`
- `.env.example`
- database schema and migrations
- Clerk setup
- Neon connection
- Drizzle setup
- Resend setup
- server-side validation and route handler logic

If splitting Codex B in two, the clean ownership boundary is:

### B1 Owns

- `.env.example`
- Clerk setup
- `middleware.ts`
- DB bootstrap
- Drizzle bootstrap
- membership tables and migrations
- `POST /api/membership/registration-request`
- `GET /api/membership/me`
- `POST /api/membership/registration-request/:id/approve`
- `POST /api/membership/registration-request/:id/reject`
- approval emails
- expiry logic

### B2 Owns

- `GET /api/profile`
- `PATCH /api/profile`
- `POST /api/support/login-help`
- `POST /api/contact`
- support/contact persistence if used
- support/contact delivery emails
- profile/support/contact validation

### B2 Must Not Touch First

- shared auth bootstrap conventions before B1 defines them
- middleware protection logic
- membership approval state rules
- shared DB/schema barrel files unless coordinated

## Active Next Route Surface

These routes now exist in the active Next app and are stable targets for backend work:

- [src/app/page.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/app/page.tsx:1) -> `/`
- [src/app/about/page.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/app/about/page.tsx:1) -> `/about`
- [src/app/events/page.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/app/events/page.tsx:1) -> `/events`
- [src/app/contact/page.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/app/contact/page.tsx:1) -> `/contact`
- [src/app/login/page.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/app/login/page.tsx:1) -> `/login`
- [src/app/register/page.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/app/register/page.tsx:1) -> `/register`
- [src/app/pending/page.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/app/pending/page.tsx:1) -> `/pending`
- [src/app/profile/page.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/app/profile/page.tsx:1) -> `/profile`
- [src/app/community-events/page.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/app/community-events/page.tsx:1) -> `/community-events`
- [src/app/support-login/page.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/app/support-login/page.tsx:1) -> `/support-login`
- [src/app/support-thank-you/page.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/app/support-thank-you/page.tsx:1) -> `/support-thank-you`

These page-level client components are the main UI targets Codex C will later wire to your backend:

- [src/components/pages/login-page.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/components/pages/login-page.tsx:1)
- [src/components/pages/register-page.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/components/pages/register-page.tsx:1)
- [src/components/pages/pending-page.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/components/pages/pending-page.tsx:1)
- [src/components/pages/profile-page.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/components/pages/profile-page.tsx:1)
- [src/components/pages/community-events-page.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/components/pages/community-events-page.tsx:1)
- [src/components/pages/support-login-page.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/components/pages/support-login-page.tsx:1)

## Current Frontend Behavior You Should Assume

The current UI is still using mock/local behavior in these areas:

- [src/lib/auth-mock.ts](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/lib/auth-mock.ts:1)
  Current behavior:
  - browser-generated 5-digit code
  - local in-memory verification
  - no real session

- [src/components/pages/login-page.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/components/pages/login-page.tsx:1)
  Current behavior:
  - still shows email/phone choice in UI
  - on successful mock verify, sends user to `/profile`

- [src/components/pages/register-page.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/components/pages/register-page.tsx:1)
  Current behavior:
  - collects name, identifier, referral email
  - on successful mock verify, sends user to `/pending`

- [src/components/pages/profile-page.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/components/pages/profile-page.tsx:1)
  Current behavior:
  - local-only draft persistence in `localStorage`
  - no real protected session
  - no backend profile save yet

- [src/components/pages/community-events-page.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/components/pages/community-events-page.tsx:1)
  Current behavior:
  - reads mock data from [src/lib/events-mock.ts](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/lib/events-mock.ts:1)
  - no event detail route
  - no event creation flow
  - no real auth gating

- [src/components/pages/support-login-page.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/components/pages/support-login-page.tsx:1)
  Current behavior:
  - validates locally
  - mock-submits then routes to `/support-thank-you`

- [src/components/sections/contact-section.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/components/sections/contact-section.tsx:1)
  Current behavior:
  - only local `sent` state

Important for backend contributors:

- do not treat `/community-events` as a required backend phase-1 blocker unless the team explicitly promotes it into scope
- the current backend critical path is still membership, pending approval, profile, support, and contact

## Product Decisions Already Reflected In The Route Structure

These are the important decisions Codex B should treat as fixed for phase 1:

- auth is email-first for the real implementation
- unapproved users may sign in, but should only reach a pending approval experience
- registration approval is referral-driven and expires after 24 hours
- support and contact are email-based in phase 1

Important route consequence:

- registration now lands on `/pending`, not `/profile`
- `/pending` already supports query-driven status display for:
  - `pending`
  - `approved`
  - `rejected`
  - `expired`
  - `needs_more_info`

See:

- [src/components/pages/pending-page.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/components/pages/pending-page.tsx:1)

## Recommended Backend Contract Targets

These are the route handler targets already expected by the main task file and now have stable page targets on the frontend side:

- `POST /api/membership/registration-request`
- `GET /api/membership/me`
- `POST /api/membership/registration-request/:id/approve`
- `POST /api/membership/registration-request/:id/reject`
- `GET /api/profile`
- `PATCH /api/profile`
- `POST /api/support/login-help`
- `POST /api/contact`

Codex C should not invent these independently. Codex B should define the request/response contract first.

## Suggested Backend Work Order

Recommended order for Codex B:

### If One Person Owns All Codex B Work

1. Add `.env.example` with placeholders only.
2. Add Clerk setup for the Next app.
3. Add Neon connection and Drizzle scaffold.
4. Add schema and migrations for:
   - `User`
   - `RegistrationRequest`
   - `SupportRequest`
   - `ContactMessage` if you choose to persist contact in phase 1
5. Define and implement membership endpoints.
6. Add support/contact handlers.
7. Add approval email flow via Resend.
8. Add expiry logic for pending approvals.
9. Add `middleware.ts` only once the route-protection plan is clear.

### If Two People Split Codex B

#### B1 Sequence

1. Add `.env.example` placeholders.
2. Add Clerk setup for the Next app.
3. Add Neon connection and Drizzle scaffold.
4. Add schema and migrations for:
   - `User`
   - `RegistrationRequest`
5. Define membership endpoint contracts.
6. Implement membership endpoints.
7. Add approval email flow and expiry logic.
8. Add `middleware.ts` strategy if needed.

#### B2 Sequence

1. Wait for B1 to publish shared backend folder conventions and membership/auth helpers.
2. Add schema and migrations for:
   - `SupportRequest`
   - `ContactMessage` if persisted
   - profile-related non-auth fields if they are clearly separated
3. Implement:
   - `GET /api/profile`
   - `PATCH /api/profile`
   - `POST /api/support/login-help`
   - `POST /api/contact`
4. Add support/contact delivery via Resend.
5. Publish exact request/response contracts for Codex C.

Recommended handoff point from B1 to B2:

- DB client location
- env loading convention
- auth/session helper convention
- schema file layout
- how route handlers should resolve current user identity

## Environment Contract

Accounts are already set up outside the repo for:

- Clerk
- Vercel
- Neon

Do not commit real secrets. Commit placeholders only.

Suggested `.env.example` keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
DATABASE_URL=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=
```

Optional additions if needed later:

```env
RESEND_FROM_EMAIL=
APPROVAL_LINK_TTL_HOURS=24
```

## Important Constraints For Codex B

- Do not move or redesign the page structure in `src/app/**`.
- Do not remove `src/lib/auth-mock.ts` yet; replace the behavior only when the real path is ready.
- Do not edit `package.json` casually; Codex A still owns platform/runtime cleanup.
- Treat `src/routes/**`, `src/router.tsx`, and `src/routeTree.gen.ts` as legacy-only reference files.
- Build against the Next app, not the legacy Vite runtime.
- Do not “upgrade” `/community-events` into a backend dependency unless the team explicitly asks for it in this phase.
- Do not touch Codex A's current in-progress UI migration files unless the change is required for a backend contract and coordinated.

## Current Verification Status From Codex A

The active Next app currently passes:

- `npm run typecheck`
- `npm run typecheck:legacy`
- `npm run build`

This means Codex B can start from a stable App Router shell instead of waiting for more platform migration.

Recent Codex A additions not reflected in the original milestone commit:

- new profile UI component:
  - [src/components/pages/profile-page.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/components/pages/profile-page.tsx:1)
- new community events route and mock layer:
  - [src/app/community-events/page.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/app/community-events/page.tsx:1)
  - [src/components/pages/community-events-page.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/components/pages/community-events-page.tsx:1)
  - [src/lib/events-mock.ts](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/lib/events-mock.ts:1)
- contact text cleanup:
  - [src/components/sections/contact-section.tsx](C:/Users/Dell/Documents/Pagu/pagu-connection-space/src/components/sections/contact-section.tsx:1)

These provide more UI context, but they do not change the backend critical path.

## What Codex B Should Hand Back

When Codex B finishes a slice, the handoff should include:

- files changed
- env vars added
- endpoint contracts added or changed
- DB schema/migration names
- any middleware/protection assumptions
- anything Codex C must know before wiring UI

## Recommended Message To The Second Codex B Contributor

Work against the active Next app only.

Touch:

- `src/app/api/profile/**`
- `src/app/api/support/**`
- `src/app/api/contact/**`
- your validation and email-delivery helpers
- schema files only in the profile/support/contact area agreed with B1

Do not touch first:

- `middleware.ts`
- Clerk bootstrap
- membership endpoint files
- broad `src/app/**` page files
- legacy `src/routes/**`

Your goal is not to redesign pages. Your goal is to give Codex C real backend contracts for profile, support, and contact while B1 owns auth and membership.
