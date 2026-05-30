# Lovable Frontend Mockup Work Blocks

This document defines the frontend mockup work to be done in Lovable while the
backend work is paused. The goal is to split the work into clear blocks that
can be detailed, assigned, and executed without mixing responsibilities.

The Lovable work is divided into 7 blocks. Blocks 1-5 are the core parallel
workstream. Blocks 6-7 are optional and should be started only if there is
capacity after the core prototype work is moving well.

Each block should use a separate branch and be merged back after review.

## Goals

- Improve the current frontend prototype in Lovable.
- Keep the work focused on mockup/product flow quality, not real backend
  integration.
- Avoid conflicts in shared files such as navigation, mock session data,
  global styles, and generated route files.
- Produce UI and UX improvements that can later be reviewed and selectively
  ported into the main product runtime.

## Block Overview

Core blocks:

- Block 1: Login, Register, Profile, Dashboard.
- Block 2: Discover and Right Here Right Now.
- Block 3: Events Functionality.
- Block 4: Merge Events Into Discover.
- Block 5: Whole-App UI Refinement.

Optional blocks:

- Block 6: Partner Login, Registration, Profile.
- Block 7: SOS Functionality.

## Work Blocks

### Block 1: Login, Register, Profile, Dashboard

Purpose:

- Review and improve the core member account journey.

Scope:

- Login route.
- Registration route.
- Profile route.
- Dashboard route.
- Mock account/session behavior needed for prototype UX.

Suggested files:

- `src/routes/login.tsx`
- `src/routes/register.tsx`
- `src/routes/profile.tsx`
- `src/routes/dashboard.tsx`
- `src/components/auth/**`
- account/profile-specific mock helpers

Questions to define:

- What should the first-time user see after registration?
- What profile fields are required before accessing member features?
- What dashboard cards or modules should appear for members?
- What states should dashboard show for pending, approved, rejected, and
  incomplete profiles?

### Block 2: Discover and Right Here Right Now

Purpose:

- Make Discover and RHRN feel like a coherent way to find people, safe spaces,
  and spontaneous connection opportunities.

Scope:

- Discover hub.
- RHRN availability.
- Nearby people.
- Request flow.
- Chat/list flow.
- Safety and visibility controls.

Suggested files:

- `src/routes/discover*`
- `src/routes/rhrn*`
- `src/components/discover/**`
- `src/components/rhrn/**`
- `src/lib/discover-mock.ts`
- `src/lib/rhrn-mock.ts`

Questions to define:

- Is Discover primarily people, places, events, or all of them?
- How should RHRN differ from general Discover?
- What safety states are needed before someone becomes available?
- What should happen when a request is accepted or declined?

### Block 3: Events Functionality

Purpose:

- Improve the standalone Events experience before merging it into Discover.

Scope:

- Public events.
- Community events.
- Event detail.
- Event creation.
- RSVP/apply flow.
- Organizer controls in the mockup.

Suggested files:

- `src/routes/events.tsx`
- `src/routes/community-events*`
- `src/lib/events-mock.ts`
- event-specific components to be created

Questions to define:

- Which event types exist in the prototype?
- Can every member create an event, or only eligible organizers?
- What is the difference between RSVP, request to join, and invite-only?
- What should an organizer be able to manage?

### Block 4: Merge Events Into Discover

Purpose:

- Make Events part of the Discover experience instead of a disconnected area.
- Events should not remain a separate top-level product area after this merge;
  they should be integrated into Discover.

Scope:

- Discover IA/navigation.
- Event cards or sections inside Discover.
- Filters that include people, safe spaces, and events.
- Cross-links between Discover and event detail pages.

Suggested files:

- Discover routes/components touched by the merge.
- Event routes/components touched by the merge.
- `src/lib/discover-mock.ts`
- `src/lib/events-mock.ts`
- shared navigation links if the merge changes top-level IA

Questions to define:

- Should Discover have tabs, filters, or sections?
- How should event search/filtering coexist with people/safe-space discovery?
- What data should be shared between Discover and Events mocks?

### Block 5: Whole-App UI Refinement

Purpose:

- Refine the UI across the whole Lovable prototype after feature blocks land.

Scope:

- Navigation consistency.
- Typography and spacing.
- Empty states.
- Loading/success/error states.
- Mobile layouts.
- Reusable UI patterns.
- Copy consistency.

Suggested files:

- Feature pages after Blocks 1-4 land.
- `src/components/header.tsx`
- `src/styles.css`
- shared UI components only when a global pattern is needed

Questions to define:

- What visual style should be treated as the source of truth?
- Which pages feel off-brand or inconsistent today?
- What shared components need cleanup?
- What mobile breakpoints need special review?

### Block 6: Partner Login, Registration, Profile (Optional)

Purpose:

- Add a partner-facing account flow separate from the member-facing flow if the
  core member account and dashboard work has enough capacity.
- Partner flows should be distinct from member flows.

Scope:

- Partner registration.
- Partner login.
- Partner profile.
- Partner dashboard or partner-specific status area if needed.

Suggested files:

- partner-related routes/components to be created
- partner-specific mock helpers if needed
- shared auth/profile components only if reuse is clean

Questions to define:

- Who counts as a partner?
- What information must partners provide?
- Do partners require approval?
- What can partners do after login?

### Block 7: SOS Functionality (Optional)

Purpose:

- Prototype an SOS flow for urgent help/safety signaling inside the product if
  the Discover/RHRN work has enough capacity.
- SOS is for members who are in a dangerous situation and need help. The
  intended direction is to connect the member automatically with the nearest
  police station. Detailed requirements should be defined later if this
  optional block is executed.

Scope:

- SOS entry point.
- SOS request screen.
- Confirmation/cancel states.
- Recipient or escalation model in the mockup.
- Safety copy and clear user feedback.

Suggested files:

- SOS routes/components/mock helpers to be created
- Discover/RHRN entry points if SOS appears there
- shared navigation only if SOS needs a global entry point

Questions to define:

- Is SOS only for approved members?
- Does SOS share location, profile info, or a message?
- What should happen after SOS is triggered?
- How should the nearest police station be identified in the mockup?
- What confirmation, cancellation, and false-alarm states are needed?

## Shared Hot Zones

Coordinate before editing:

- `src/components/header.tsx`
- `src/routes/__root.tsx`
- `src/routeTree.gen.ts`
- `src/styles.css`
- `src/lib/session-mock.ts`
- any shared dashboard route or component

Rules:

- Do not edit `src/routeTree.gen.ts` by hand.
- Keep mock `localStorage` keys namespaced by feature.
- Do not rewrite shared navigation without notifying the other groups.
- Keep UI polish changes small until feature work has landed.
- Use feature-specific components and mock helpers where possible.

## Suggested Parallel Sequence

Phase 1: Define flows

- Define flows for Blocks 1-3 first.
- Define the merge approach for Block 4 after Blocks 2 and 3 have clear
  concepts.
- Define the UI review checklist for Block 5 after the target screens are
  known.
- Define optional flows for Blocks 6-7 only if they are in scope.

Phase 2: Build feature mockups

- Blocks 1, 2, and 3 can be built in parallel if they stay inside their
  suggested files.
- Block 6 can run in parallel with Block 1 only if it creates partner-specific
  routes/components and avoids rewriting shared auth/profile components.
- Block 7 can run in parallel with Block 2 only if it creates SOS-specific
  routes/components and avoids changing Discover/RHRN entry points until the
  integration point is agreed.
- Shared navigation changes are coordinated.

Phase 3: Merge concepts

- Merge Events into Discover after Blocks 2 and 3 have stable mock concepts.
- Update dashboard surfaces for new feature states after the relevant blocks
  land.

Phase 4: UI refinement

- Run the app-wide UI pass after the feature blocks land.
- Review all pages for consistency and mobile behavior.

## Parallel Work Assessment

Can run in parallel with low conflict risk:

- Block 1 and Block 3, because account/dashboard work and event work mostly use
  different routes and mocks.
- Block 1 and Block 2, if dashboard changes do not directly rewrite Discover or
  RHRN data.
- Block 2 and Block 3, if each keeps its own mock helpers and does not start the
  Discover/Event merge early.

Should wait or coordinate closely:

- Block 4 should start after Blocks 2 and 3 have stable mock concepts, because
  it intentionally touches both Discover and Events.
- Block 5 should happen after the main feature blocks land, because whole-app UI
  refinement may touch shared styles, navigation, and components.
- Block 6 should coordinate with Block 1 because both may touch auth, profile,
  session mocks, and dashboard surfaces.
- Block 7 should coordinate with Block 2 because SOS may need entry points from
  Discover, RHRN, or global navigation.

Branch rule:

- Use one branch per block.
- Merge Blocks 1-3 first when possible.
- Merge Block 4 after Blocks 2 and 3.
- Merge Block 5 last.
- Merge optional Blocks 6-7 only after their scope is explicitly confirmed.

## Decisions From Natalia

- Events will be integrated into Discover and should not remain a separate
  top-level product area after the merge.
- Partner flows are different from member flows.
- SOS is an optional safety feature for members in dangerous situations. The
  intended direction is automatic connection with the nearest police station.
  Remaining SOS requirements will be defined later if the block is executed.
- Each block should use a separate branch and merge back later.
