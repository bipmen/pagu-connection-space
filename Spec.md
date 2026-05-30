# Backend Integration Spec

## Purpose

This document explains how to integrate a backend into the current Pagu project and records the open decisions we should make together before implementation.

The project is currently a frontend-focused TanStack Router / Vite app. It has mocked behavior for passwordless authentication, registration approval, contact messages, support messages, and the profile area. The backend should replace those mocks behind a small API client layer so the UI does not need to know which database, email provider, SMS provider, or hosting platform we choose.

## Current Project Shape

- Current framework: React 19 with TanStack Router / TanStack Start conventions.
- Target framework decision: migrate to Next.js 16 with the App Router.
- Current build/deploy config: Vite with Cloudflare support through `wrangler.jsonc`.
- Target deployment decision: Vercel.
- Migration UI decision: preserve the current UI during the Next.js migration; redesign work is deferred.
- Styling: Tailwind CSS, Radix UI components, local UI primitives in `src/components/ui`.
- Validation: Zod is already used in route forms.
- Data fetching dependency: `@tanstack/react-query` is installed but not yet used for backend calls.
- Current backend placeholder: `src/lib/auth-mock.ts`.

## Current Backend Touchpoints

### Authentication

Current files:

- `src/lib/auth-mock.ts`
- `src/routes/login.tsx`
- `src/routes/register.tsx`
- `src/components/auth/verify-step.tsx`

Current behavior:

- User chooses email or phone.
- App generates a 5-digit code in the browser.
- Code is logged in development.
- Code verification happens in browser memory.
- On success, the app navigates to `/profile`.

Backend requirement:

- Move code generation, delivery, expiration, rate limits, and verification to the server.
- Create a real session after successful verification.
- Protect `/profile` so only authenticated and approved users can access it.

### Registration

Current file:

- `src/routes/register.tsx`

Current behavior:

- Collects name, email or phone, and referral email.
- Sends a mock one-time code.
- After code verification, navigates directly to `/profile`.
- UI text says the profile is subject to approval, but there is no approval state yet.

Backend requirement:

- Store registration requests.
- Verify ownership of email through Clerk.
- Store referral email.
- Track approval state: `pending`, `approved`, `rejected`, or `needs_more_info`.
- Send users to a dedicated pending approval page after registration while they wait for referral approval.
- The referred user directly approves or rejects the applicant.

### Login

Current file:

- `src/routes/login.tsx`

Current behavior:

- Passwordless login by email or phone.
- No account lookup exists yet.

Backend requirement:

- Check whether the identifier belongs to an approved user.
- Send one-time code only when appropriate.
- Avoid leaking whether a specific email or phone exists unless we intentionally choose otherwise.
- Create a session after verification.

### Profile

Current file:

- `src/routes/profile.tsx`

Current behavior:

- Static placeholder page.
- No session check.
- No user data.

Backend requirement:

- Fetch the authenticated user profile.
- Redirect unauthenticated users to `/login`.
- Show approval status or member profile data.

### Support Requests

Current files:

- `src/routes/support-login.tsx`
- `src/routes/support-thank-you.tsx`

Current behavior:

- Form validates locally.
- Mock submission logs to console.

Backend requirement:

- Store support requests or send them to an email/helpdesk provider.
- Add spam protection and rate limiting.

### Contact Messages

Current file:

- `src/components/sections/contact-section.tsx`

Current behavior:

- Form only flips local `sent` state.

Backend requirement:

- Validate and submit contact messages.
- Decide whether to store messages, email them, or both.

## Recommended Integration Strategy

### 1. Migrate To Next.js 16 First

Decision: migrate from the current TanStack/Vite setup to Next.js 16.

Reason:

- Next.js is the smoothest path for Vercel deployment.
- Clerk has first-class Next.js support and prebuilt auth UI.
- Vercel serverless functions, route handlers, preview deployments, scheduled jobs, and environment variables fit naturally with Next.js.
- The App Router gives us a clear place for layouts, protected pages, route handlers, server components, and server actions.

Migration direction:

- Use the Next.js 16 App Router.
- Move `src/routes/*` pages into `src/app/*/page.tsx`.
- Move the root shell from `src/routes/__root.tsx` into `src/app/layout.tsx`.
- Replace TanStack Router navigation with Next.js `Link` and `next/navigation`.
- Replace Vite config with Next.js config.
- Remove Cloudflare deployment config once Vercel deployment is confirmed.
- Keep existing UI components, styling, assets, and most page JSX where possible.
- Preserve the current visual design during the migration; future UI changes should happen after framework/backend parity.

### 2. Add an API Client Layer

Create a frontend boundary such as:

- `src/lib/api/client.ts`
- `src/lib/api/membership.ts`
- `src/lib/api/profile.ts`
- `src/lib/api/support.ts`
- `src/lib/api/contact.ts`

The route components should call these modules instead of calling `fetch` directly. This keeps backend details out of the UI.

Example frontend shape:

```ts
await membershipApi.createRegistrationRequest({ clerkUserId, referralEmail });
await profileApi.getCurrentUser();
await contactApi.submitMessage({ name, email, message });
```

### 3. Replace `auth-mock.ts` With Clerk

Use Clerk prebuilt login/register UI instead of custom browser-generated verification codes:

- Clerk owns sign-in, sign-up, verification, and session state.
- Pagu owns registration approval, profile data, events, support requests, and contact messages.
- `src/lib/auth-mock.ts` should be removed once Clerk is integrated.
- The current `/login` and `/register` routes should either render Clerk components or redirect to Clerk-hosted auth pages.

### 4. Use React Query for Server State

Use `@tanstack/react-query` for:

- Current user.
- Profile data.
- Approval status.
- Mutations for login, registration, support, and contact submissions.

This gives the app loading, retry, cache invalidation, and error states in a consistent way.

### 5. Choose the Backend Hosting Model

Decision: use Vercel as the primary hosting and backend runtime.

The current repo has Cloudflare config in `wrangler.jsonc`, but the preferred stack is now Vercel, Clerk, Neon, Drizzle, Resend, PostHog, and later Stripe. That makes Vercel the better fit for this project direction.

Cloudflare is still a strong platform, especially for edge-native workloads, Workers, D1, KV, Durable Objects, Queues, and bandwidth-sensitive apps. For Pagu, the near-term backend is mostly product data, auth, approval workflows, support/contact messages, email, analytics, and eventually events or payments. Those needs fit more naturally with Vercel plus managed services.

Action:

- Treat `wrangler.jsonc` as legacy deployment config if we commit to Vercel.
- Add Vercel deployment config when we start migration/deployment work.
- Avoid mixing Vercel Functions and Cloudflare Workers unless a specific need appears.

## Proposed API Surface

These endpoints are a starting point for Pagu-owned product data. Clerk owns core authentication endpoints, so we should not build custom login code generation or verification endpoints unless Clerk cannot support a required flow.

### Auth

Clerk handles:

- Sign up.
- Sign in.
- Verification.
- Session cookies.
- Sign out.
- Current authenticated user identity.

Pagu should store its own app-level user/member record linked by `clerkUserId`.

### Membership

`POST /api/membership/registration-request`

Creates or updates the Pagu-specific registration request after Clerk sign-up and triggers an approval request to the referred user.

Request body:

```json
{
  "clerkUserId": "user_123",
  "name": "Bianca",
  "referralEmail": "member@example.com"
}
```

Response:

```json
{
  "ok": true,
  "approvalStatus": "pending"
}
```

`GET /api/membership/me`

Returns the current Clerk-authenticated user's Pagu membership status.

`POST /api/membership/registration-request/:id/approve`

Allows the referred approved user to approve the applicant.

Response:

```json
{
  "ok": true,
  "approvalStatus": "approved"
}
```

`POST /api/membership/registration-request/:id/reject`

Allows the referred approved user to reject the applicant.

Response:

```json
{
  "ok": true,
  "approvalStatus": "rejected"
}
```

### Profile

`GET /api/profile`

Returns authenticated profile data.

`PATCH /api/profile`

Updates editable profile fields.

### Support

`POST /api/support/login-help`

Creates a support request for login or registration problems.

### Contact

`POST /api/contact`

Submits a general contact message.

## Data Model Draft

### User

- `id`
- `clerkUserId`
- `name`
- `email`
- `phone`
- `approvalStatus`
- `createdAt`
- `updatedAt`

### RegistrationRequest

- `id`
- `clerkUserId`
- `name`
- `email`
- `referralEmail`
- `referredUserId`
- `approvalStatus`
- `approvedAt`
- `rejectedAt`
- `createdAt`
- `updatedAt`

### SupportRequest

- `id`
- `name`
- `email`
- `message`
- `status`
- `createdAt`

### ContactMessage

- `id`
- `name`
- `email`
- `message`
- `createdAt`

## Security Requirements

- Never generate or verify one-time codes in the browser.
- Let Clerk own authentication verification, session security, and auth rate-limit defaults wherever possible.
- Enforce rate limits by identifier and IP address for Pagu-owned endpoints such as support/contact forms.
- Use HTTPS only.
- Use secure, HTTP-only cookies through Clerk-managed sessions.
- Validate every request on the server with schemas that match the frontend Zod rules.
- Add spam protection for support and contact forms.
- Decide how to handle GDPR/privacy requirements because this community handles sensitive membership context.

## Frontend Implementation Steps

1. Create a Next.js 16 App Router project structure.
2. Move existing shared UI, assets, hooks, and styles into the Next.js structure.
3. Convert TanStack routes to Next.js App Router pages.
4. Replace TanStack Router navigation with Next.js navigation.
5. Install and configure Clerk.
6. Replace custom login/register verification logic with Clerk prebuilt UI, configured for email-only MVP auth.
7. Create typed API helper modules under `src/lib/api`.
8. Add session/current-user loading through Clerk and React Query where useful.
9. Add route protection for `/profile`.
10. Add backend submission for support requests.
11. Add backend submission for contact messages.
12. Add user-facing pending approval page after registration.
13. Remove `src/lib/auth-mock.ts` once Clerk auth is live.
14. Remove obsolete TanStack/Vite/Cloudflare config after the Next.js app builds and deploys.

## Backend Implementation Steps

1. Configure Vercel deployment.
2. Configure Next.js 16 route handlers for Pagu-owned backend endpoints.
3. Configure Clerk.
4. Configure Neon Postgres.
5. Add Drizzle schema and migrations.
6. Implement membership/profile endpoints.
7. Implement support/contact endpoints.
8. Configure Resend for transactional emails.
9. Send referred-user approval request emails through Resend.
10. Add server-side validation, rate limits, logging, and monitoring.
11. Add admin fallback workflow for unresolved or disputed approvals.

## Decision Questions

We should answer these before building the real backend.

### Backend Platform

Decision: Vercel.

Framework decision: migrate to Next.js 16 with the App Router.

Reason:

- Official Vercel support for Next.js is the best-supported deployment path.
- Next.js 16 is the current target framework version for this project.
- App Router works well with Clerk, route handlers, server-side data fetching, and Vercel deployment.

### Database

1. Do we need a relational database for users, approvals, events, and messages?
2. Decision: use Neon Postgres.
3. Who needs direct admin access to user and registration data?

### Authentication

Decision: Clerk prebuilt login/register UI.

Remaining auth questions:

1. Decision: email-only is fine for the MVP.
2. Should unapproved users be allowed to sign in and see a pending approval screen?
3. Should we allow social login, or keep auth email-based for the first version?

### Registration and Approval

1. What exact information should a new member provide during registration?
2. Is referral email mandatory?
3. Decision: after registration, users go to a dedicated pending approval page.
4. What should happen if the referral email does not belong to an existing approved member?
5. Decision: the referred user approves or rejects the applicant directly.
6. How should the referred user receive and open the approval request: email link, in-app notification, or both?
7. Do approval links expire?
8. Do we need an admin dashboard for fallback cases, or can admins handle exceptions directly in Neon/Clerk dashboards for the first version?

### Email and SMS

1. Decision: use Resend for email.
2. Decision: no SMS for MVP.
3. What sender name, sender email, and message tone should Pagu use?

### Privacy and Safety

1. What user data is considered sensitive for this community?
2. How long should we retain registration requests, contact messages, and support messages?
3. Do we need explicit consent checkboxes for privacy policy or community guidelines?
4. Should admins be able to delete user data on request?

### Product Scope

1. What should members be able to do after reaching `/profile`?
2. Will events eventually come from the backend?
3. Do members need RSVP, payment, chat, or newsletter features?
4. Should contact/support messages create internal tasks, send emails, or both?

## My Current Recommendation

Start with email-only passwordless auth, registration requests, approval status, and contact/support submissions. Keep phone/SMS as a second phase unless it is essential for launch, because SMS adds provider setup, cost, phone number formatting, fraud protection, and extra privacy considerations.

Based on the current preferred stack, the strongest backend direction is:

- Vercel for hosting, serverless API endpoints, preview deployments, and scheduled jobs.
- Clerk for authentication, sessions, user identity, and protected routes.
- Neon Postgres for application data.
- Drizzle for schema, migrations, and typed database queries.
- Resend for transactional email.
- PostHog for analytics and feature flags.
- Stripe only when payments, memberships, donations, or ticket sales enter scope.
- HTTP-only cookie sessions.

This stack keeps risky areas managed by specialists while still leaving the product data model under our control in Postgres.

Important note: the current project includes Cloudflare config in `wrangler.jsonc`. If we choose Vercel, we should treat Cloudflare deployment as deprecated and adjust the project for Vercel deployment before implementing backend endpoints.

MVP decisions:

- Preserve the current UI while migrating to Next.js 16.
- Email-only login is acceptable for launch.
- Phone/SMS login is out of scope for the MVP.
- Use Clerk prebuilt login/register UI.
- Send newly registered users to a dedicated pending approval page.
- Let the referred user directly approve or reject the applicant.
- Use Neon Postgres as the database.
- Use Resend as the email provider.
- Use Vercel as the hosting provider.

## Decisions Made

### Backend Platform

Decision: use Vercel as the primary hosting and backend runtime.

Reason:

- Fast deployment and preview URLs.
- Good fit for managed serverless API endpoints.
- Strong ecosystem for founder-friendly AI-assisted development.
- Easier operational path than managing lower-level infrastructure.

### Vercel vs Cloudflare

Decision: Vercel is better for this project direction.

That does not mean Vercel is universally better than Cloudflare. It means Vercel fits Pagu's current priorities better:

- We want the fastest path to a real product.
- We want managed auth through Clerk instead of custom auth code.
- We want Neon Postgres and Drizzle as the core data layer.
- We want Resend, PostHog, and later Stripe to integrate cleanly with a React/TypeScript product stack.
- We want preview deployments and a simple contributor workflow.
- We want to spend less time learning platform-specific infrastructure.

Cloudflare would be a strong choice if our priorities were:

- Very low-latency edge workloads.
- High traffic with bandwidth/egress sensitivity.
- A backend built around Workers, D1, KV, Durable Objects, and Queues.
- More control over edge runtime behavior.
- Comfort with Cloudflare-specific platform patterns.

For Pagu, Next.js 16 on Vercel + Clerk + Neon + Drizzle + Resend is the recommended backend path.

### Framework

Decision: migrate to Next.js 16.

Reason:

- Best alignment with Vercel deployment.
- First-class Clerk integration.
- App Router gives clean file-based routing, layouts, route handlers, server components, and server actions.
- Easier future integration with Vercel platform features.

Migration notes:

- Current TanStack routes should become App Router pages.
- Current root shell should become `src/app/layout.tsx`.
- Current global styles should move to `src/app/globals.css` or remain imported from the app layout.
- Current route metadata should become Next.js `metadata` exports.
- Current Vite/TanStack/Cloudflare dependencies should be removed after parity is reached.
- Preserve the current UI during migration; redesign is a later project phase.

### Auth Provider

Decision: use Clerk with prebuilt login/register UI.

Reason:

- Authentication is high-risk to build from scratch.
- Clerk handles sessions, sign-in, sign-up, verification flows, and protected routes.
- Reduces the need for custom one-time-code infrastructure.
- Prebuilt UI gets secure auth working faster and avoids rebuilding standard auth flows too early.

Implementation direction:

- Replace the current custom `/login` and `/register` verification logic with Clerk's prebuilt auth components or hosted auth flow.
- Configure Clerk for email-only MVP authentication.
- Keep Pagu's visual identity around the auth pages where possible.
- Remove browser-generated verification codes from `src/lib/auth-mock.ts`.
- Use Clerk session state to protect `/profile`.
- Keep Pagu-specific approval status in Neon Postgres, linked to the Clerk user ID.

### Database

Decision: use Neon Postgres with Drizzle.

Reason:

- Postgres is a good fit for users, approval status, referrals, events, messages, and later payments.
- Drizzle keeps schema and queries readable in TypeScript.
- Neon avoids local database setup for early development.

### Email

Decision: use Resend.

Reason:

- Good fit for transactional emails.
- Strong React/TypeScript developer experience.
- Useful for support/contact notifications and later approval emails.

### Analytics

Likely decision: use PostHog after the core backend is working.

Reason:

- Helpful for understanding where users drop off during registration/login.
- Feature flags can help us test product changes later.

### Payments

Decision: defer Stripe until there is a concrete payment use case.

Reason:

- Stripe is the right choice when payments are needed.
- It should not be part of the first backend implementation unless launch requires paid events, donations, subscriptions, or memberships.

## Next Questions To Answer First

1. What should happen if the referral email does not belong to an existing approved member?
2. Should referred users approve through a secure email link, an in-app approval page, or both?
3. Should approval links expire, for example after 7 or 14 days?
4. Should unapproved users be allowed to sign in and only see the pending approval page?
5. Do you need payments at launch, or should Stripe wait until events, donations, subscriptions, or memberships are defined?

## Improvements

These are future product or architecture decisions that should not block the initial migration/backend implementation.

1. What should happen if the referral email does not belong to an existing approved member?

## Tool Choice: Lovable vs Base44

Recommendation: do not use Lovable or Base44 as the primary implementation tool for the backend migration.

Reason:

- The chosen stack is custom-owned: Next.js 16, Vercel, Clerk, Neon Postgres, Drizzle, Resend, and PostHog.
- Lovable is strongest for React apps with Supabase-backed workflows and GitHub/Vercel handoff.
- Base44 is strongest for fast no-code/full-stack apps using its managed backend, entities, auth, hosting, and integrations.
- Our plan intentionally avoids Supabase and avoids a proprietary app-builder backend.
- The pending approval workflow requires careful ownership of auth state, membership state, referral approval, email links, and database records.

Lovable can help with UI prototyping and may be useful if we keep a separate prototype branch. It can connect to GitHub and supports Vercel-oriented handoff, but its native backend story is Supabase/Lovable Cloud, not Neon + Drizzle + Clerk.

Base44 can likely create a similar app flow inside Base44 using its own auth, database, email, integrations, and backend functions. However, that would mean changing the architecture away from our chosen stack. It is less ideal if we want full control over a Next.js 16 codebase deployed on Vercel with Clerk, Neon, Drizzle, and Resend.

Best fit for this project:

1. Use Codex/local development for the actual migration and backend work.
2. Use Vercel for hosting and deployment.
3. Use Clerk, Neon, Drizzle, and Resend directly.
4. Optionally use Lovable later for visual/UI experiments only, then manually port the useful ideas.
5. Avoid Base44 for this project unless we decide to restart as a Base44-hosted no-code app.

---

## Changelog — Frontend Prototype Updates (Phase 1 + RHRN)

These changes were made on the Lovable prototype branch to validate UX flows ahead of the Next.js + Clerk + Neon migration. All state is mocked via `localStorage`; no real backend exists yet.

### Phase 1 — Community Events (Discover + Create + Apply)

New mocks:

- `src/lib/events-mock.ts` — Event entity, list/get/create/apply, attendance tracking.
- `src/lib/session-mock.ts` — Mock authenticated user with profile, attended-events, and RHRN session state in `localStorage`.

New routes:

- `src/routes/community-events.index.tsx` — Discover events.
- `src/routes/community-events.new.tsx` — Create event.
- `src/routes/community-events.$id.tsx` — Event detail + Apply flow.

Gating implemented in the prototype:

- Must be logged in (mock auth).
- Apply / Create require an authenticated approved member.
- Attendance to ≥1 event is recorded and used as the eligibility gate for RHRN.

### Fake Login (prototype only)

- `src/lib/auth-mock.ts` — Adds a one-click fake login that seeds a logged-in approved user so reviewers can access Phase 1 and RHRN without going through the verification flow. To be removed when Clerk is wired in.

### Right Here Right Now (RHRN) — foundation

Scope: spontaneous, local, FLINTA-only community connection. Not dating, not swipe, not social feed.

Access gates (all must pass):

1. Logged in.
2. Approved community member.
3. Profile completed (`city` + `bio` required).
4. Community guidelines accepted.
5. Attended ≥1 community event.

New mocks:

- `src/lib/rhrn-mock.ts` — Eligibility check, "available now" session with expiry, nearby-people discovery, connection requests, lightweight chat threads.

New components:

- `src/components/rhrn/invisible-button.tsx` — "Go invisible" / availability toggle.

New routes:

- `src/routes/rhrn.index.tsx` — Discovery + availability toggle (with countdown).
- `src/routes/rhrn.$id.tsx` — Other person's RHRN profile + send request.
- `src/routes/rhrn.requests.tsx` — Incoming/outgoing requests.
- `src/routes/rhrn.chats.tsx` — Chat list.
- `src/routes/rhrn.chat.$id.tsx` — 1:1 chat thread.

### Complete Profile gateway

- `src/routes/profile.tsx` rewritten as the real profile editor (name, city, bio, interests). Drives the RHRN eligibility check via `getEligibility` and redirects users with incomplete profiles into this route.

### Fixes

- `src/routes/rhrn.index.tsx` — Hardened hook ordering and null-guarded the mock session so the page no longer crashes before `localStorage` hydration.

### Backend implications (for the Next.js + Clerk + Neon migration)

When porting these prototype flows to the real stack, the following must move server-side:

- Event entity, attendance records, and the "attended ≥1 event" check (Neon + Drizzle).
- RHRN availability session with server-enforced expiry (no client-side countdown as source of truth).
- Connection requests and chat threads with proper authorization (only participants can read/write).
- Eligibility gate must be enforced in the API layer, not only in the UI.
- Guidelines acceptance must be persisted per-user with a version stamp.
- Remove `auth-mock.ts`, `session-mock.ts`, `events-mock.ts`, `rhrn-mock.ts` once Clerk + Neon endpoints replace them.
