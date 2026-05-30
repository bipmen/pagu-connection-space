# Team Backend Integration Tasks

This file defines the working boundary for the first backend integration phase so three parallel Codex sessions can work without clashing.

Scope for this phase:

- Migrate the app from TanStack Router / Vite / Cloudflare-oriented setup to Next.js 16 App Router.
- Introduce the backend stack foundations: Vercel, Clerk, Neon Postgres, Drizzle, Resend.
- Replace mock auth and mock form submissions with real integration boundaries.
- Preserve the current UI as much as possible.
- Implement the referral approval workflow as an email-link flow with a 24-hour approval window.

Out of scope for this phase:

- Major redesign work.
- Payments / Stripe.
- Social login.
- SMS / phone-based auth.
- Full admin dashboard.
- Advanced analytics beyond basic future-ready hooks.

## Team Split

Use three branches and keep ownership strict.

### Codex A: Platform Migration

Suggested branch: `codex/platform-next-migration`

Owns:

- `package.json`
- `package-lock.json`
- `next.config.*`
- `tsconfig.json`
- `src/app/**`
- migration of route files from TanStack Router to Next App Router
- layout migration from `src/routes/__root.tsx` to `src/app/layout.tsx`
- global styles move into Next app layout flow
- removal of Vite / TanStack Router / Cloudflare-specific runtime config after parity

Primary deliverable:

- The app runs in Next.js 16 with the current UI preserved and page routes working.

Must not own:

- database schema
- API route business logic
- Clerk business rules
- form submission backend logic

### Codex B: Backend, Auth, and Data

Suggested branch: `codex/backend-auth-data`

Owns:

- Clerk integration
- Neon Postgres connection
- Drizzle schema and migrations
- `src/app/api/**`
- server-side validation schemas
- membership, profile, support, and contact route handlers
- Resend integration
- rate limiting / spam protection / logging scaffolding
- environment variable contract

Primary deliverable:

- Stable backend contracts and data model for frontend use.

Must not own:

- route migration
- page styling
- broad page structure changes unrelated to backend integration

Recommended internal split if two people share Codex B:

#### Codex B1: Auth, Membership, and Backend Foundations

Suggested branch: `codex/backend-auth-membership`

Owns:

- `.env.example`
- Clerk setup
- `middleware.ts`
- Neon / Drizzle base setup
- membership schema and migrations
- auth and membership endpoints
- approval email flow
- registration expiry logic
- shared backend foundation files such as DB client, env loader, and schema barrel files

Primary deliverable:

- real auth/session/membership backbone that other backend and frontend work can build on

Must not own:

- contact/support endpoint internals
- profile page UI
- broad frontend state wiring

#### Codex B2: Profile, Support, Contact, and Delivery

Suggested branch: `codex/backend-profile-support-contact`

Owns:

- profile route handlers
- support route handlers
- contact route handlers
- support/contact persistence if stored in phase 1
- support/contact email delivery
- server-side validation for profile/support/contact
- backend response shapes for profile/support/contact flows

Primary deliverable:

- real non-auth backend flows for profile, support, and contact using the shared B1 backend foundation

Must not own:

- Clerk bootstrap
- middleware strategy
- membership approval logic
- framework migration files

Coordination rule:

- B1 publishes the base backend structure first.
- B2 builds on top of that structure instead of inventing parallel infrastructure.
- If shared DB/schema bootstrap files need changes after B1 lands them, coordinate rather than editing blindly.

### Codex C: Frontend Integration

Suggested branch: `codex/frontend-api-integration`

Owns:

- `src/lib/api/**`
- React Query setup for server state
- wiring login/register/profile/pending/support/contact pages to real backend contracts
- loading, error, and success states around real API calls
- removal of mock client-side submission behavior once real endpoints are ready

Primary deliverable:

- Existing UI connected to live backend/auth state without redesign.

Must not own:

- framework migration config
- DB schema
- route handler internals

## File Ownership Rules

Single-owner files during this phase:

- `package.json` and `package-lock.json`: Codex A
- `src/app/layout.tsx`: Codex A
- `middleware.ts`: Codex B
- `.env.example`: Codex B
- `src/lib/api/**`: Codex C
- DB schema and migrations: Codex B

If another stream needs a change in one of these files, request it through the owner instead of editing directly.

## Merge Order

Recommended order:

1. Codex A lands the Next.js migration skeleton first.
2. Codex B lands backend contracts, env contract, schema, and API handlers in parallel or immediately after the shell is stable.
3. Codex C lands client wiring after A has created stable page locations and B has defined stable API shapes.

Rule:

- Codex C should not invent endpoint shapes independently.
- Codex B should publish the request/response contract before C wires pages to it.

## Immediate Implementation Tasks

### Codex A

1. Create a Next.js 16 App Router structure.
2. Move current pages into `src/app/**/page.tsx`.
3. Port the root shell to `src/app/layout.tsx`.
4. Port global styles into the Next app.
5. Replace TanStack navigation with Next `Link` / `next/navigation`.
6. Keep the current UI intact.
7. Remove or quarantine obsolete Vite/Cloudflare routing config after Next parity is verified.

### Codex B

1. Add Clerk setup for email-only auth.
2. Add Neon Postgres connection config.
3. Add Drizzle schema for:
   - `User`
   - `RegistrationRequest`
   - `SupportRequest`
   - `ContactMessage`
4. Add migrations.
5. Add route handlers for:
   - `POST /api/membership/registration-request`
   - `GET /api/membership/me`
   - `POST /api/membership/registration-request/:id/approve`
   - `POST /api/membership/registration-request/:id/reject`
   - `GET /api/profile`
   - `PATCH /api/profile`
   - `POST /api/support/login-help`
   - `POST /api/contact`
6. Add Resend integration for:
   - referral approval request emails
   - referral timeout / denial emails to applicants
   - support/contact delivery emails
7. Add rate limiting and spam protection strategy for support/contact.
8. Add `middleware.ts` protection strategy for authenticated/protected routes if needed with Clerk.
9. Model and implement 24-hour approval expiry logic for registration requests.

### Codex B Parallel Execution Plan

If two people are working the Codex B scope at the same time, use this order:

1. B1 lands backend foundations:
   - `.env.example`
   - Clerk
   - DB connection
   - Drizzle scaffold
   - membership schema
   - membership endpoints
   - approval email path
2. B2 starts once B1 has published:
   - shared backend folder/file layout
   - schema placement conventions
   - request/response contract shape for `GET /api/membership/me`
   - any shared validation or auth helper conventions
3. B2 then lands:
   - `GET /api/profile`
   - `PATCH /api/profile`
   - `POST /api/support/login-help`
   - `POST /api/contact`
4. Codex C should wait for the final contract text from the owning B stream before wiring each page.

Suggested schema ownership split:

- B1:
  - `User`
  - `RegistrationRequest`
- B2:
  - `SupportRequest`
  - `ContactMessage`
- If profile data needs extra user fields, B2 should request or coordinate those additions with B1 if they live in the user/auth schema area.

### Codex C

1. Create typed API clients:
   - `src/lib/api/client.ts`
   - `src/lib/api/membership.ts`
   - `src/lib/api/profile.ts`
   - `src/lib/api/support.ts`
   - `src/lib/api/contact.ts`
2. Add React Query provider/setup where needed.
3. Replace mock login/register flow wiring with Clerk session-aware UI flow.
4. Prepare a pending approval page flow after registration.
5. Until that page exists, support the backend states cleanly without redesigning the UI.
6. Protect `/profile` in the frontend experience and handle redirects cleanly.
7. Replace support form mock submission with real API mutation.
8. Replace contact form local sent-state only behavior with real API mutation.

## Secrets and Access

Do not commit real secrets to the repository.

Use:

- local `.env.local` files for real values
- a committed `.env.example` file for placeholders only

Current repo note:

- `.gitignore` already ignores `*.local`, so `.env.local` is safe to use locally if you do not rename it.

Do not use a committed `/secrets` folder inside the repo for live credentials.

If you want a shared handoff document, commit placeholders only, for example:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
DATABASE_URL=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=
```

What we need now:

- Clerk project keys, not personal user passwords
- Neon `DATABASE_URL`
- Resend API key
- Vercel project linkage later when deployment starts

What we do not need now:

- personal Clerk user IDs
- anyone's login password
- personal Vercel password
- personal Neon password if `DATABASE_URL` is already provided

If you want shared test accounts, provide test emails only. Since the MVP direction is email-based auth, passwords are not the main path.

## Plugins vs Secrets

In this Codex session, there are no dedicated Vercel, Clerk, Neon, or Resend plugins/connectors available.

That means:

- backend/provider setup should be done through code, env files, dashboards, and CLI where needed
- secrets still need to be supplied as environment variables locally and in Vercel
- we should not wait on plugins for this phase

## Working Agreement

Before coding, each Codex should read this file and stay inside its boundary.

Rules:

- do not change another stream's owner files unless explicitly agreed
- do not reformat unrelated files
- do not change API contracts casually once Codex C starts wiring them
- do not remove mock flows until the replacement path is working
- keep PRs/task branches narrow

## Important Decisions Needed Now

Most product questions in `Spec.md` are not blockers yet.

The phase-1 decisions below are now confirmed and should be treated as fixed unless the team explicitly changes them:

1. Auth is email-only for phase 1.
2. Unapproved users may sign in, but they should only reach a pending approval experience.
3. Referral approval happens through an email link.
4. Support submissions are email-based.
5. Contact submissions are email-based.
6. If the referral is not approved within 24 hours, the registration request should no longer stay open indefinitely.

Everything else can wait until after the migration and core backend path exist.

## Confirmed Workflow Rules

These rules are now part of the contract for implementation.

### Registration + Referral Approval

1. A new applicant signs up with their own email.
2. The applicant enters the email of an existing approved member as the referral.
3. The referred member receives an approval email with an approval link.
4. The approval window lasts 24 hours from request creation.
5. If the referred member approves within 24 hours, the applicant can continue toward approved membership state.
6. If the referred member does not approve within 24 hours, the request expires and access is denied for that attempt.
7. After expiry, send an email to the applicant explaining that access was not approved and they should sign up again with a new referral link.
8. The app should also show the denied/expired status when the applicant signs in again.

### Pending Approval UI

- The backend should fully support `pending`, `approved`, `rejected`, and `expired` style states.
- The dedicated post-registration pending page is still needed, but it does not have to be designed first before backend work starts.
- Frontend work in this phase should avoid inventing the final UX before the route/page exists.

### Support and Contact Delivery

- For phase 1, support and contact submissions should be delivered by email.
- Database storage for those messages is optional for this phase and can be added later unless the team decides otherwise.

## Default Assumptions If Answers Are Delayed

These were temporary defaults. The key ones are now replaced by confirmed decisions above.

Remaining safe assumptions for now:

- no SMS in phase 1
- referral email is required
- the backend should track approval status explicitly
- the pending approval page can be implemented after backend foundations are in place

## Handoff Checklist

Each branch should include:

- short summary of changed files
- known env vars added
- contracts introduced or changed
- blockers for the next stream
- explicit note of any shared files touched
