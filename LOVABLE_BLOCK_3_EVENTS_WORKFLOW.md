# Lovable Block 3: Events Functionality Workflow

This document defines the workflow for implementing Block 3 from
[LOVABLE_WORK_BLOCKS.md](LOVABLE_WORK_BLOCKS.md).

Working branch:

```text
codex/lovable-events-functionality
```

Block reference:

```text
Block 3: Events Functionality
```

Block 3 goal:

- Improve the standalone Events experience before Block 4 merges Events into
  Discover.

Reference product direction:

- Use the French Vibes app as inspiration for a community-centered event
  experience: curated local happenings, social discovery, lightweight joining,
  and a feeling of active community.

## Product Direction

Events should be separated into two clear experiences:

1. Community Events.
2. Local Events.

Community Events:

- Events created by Pagu members.
- This should keep most of the existing Community Events page behavior.
- Members can create events from this page.
- The create-event button already exists and should remain a primary action.
- These events are community-led and can include RSVP, request-to-join, or
  invite-only flows depending on the event type.

Local Events:

- Curated events organized by local partners and selected by us.
- Includes Pagu events and selected local partner events.
- Highlighted or featured events should stand out.
- Other relevant local events can also be shown below or after highlighted
  events.
- The page should feel curated, not just user-generated.

Out of scope for Block 3:

- Merging Events into Discover. That belongs to Block 4.
- Real backend integration.
- Real partner authentication or partner profiles. That belongs to optional
  Block 6 if executed.
- Whole-app visual polish beyond event-related screens. That belongs to Block 5.

## Suggested Routes And IA

The exact route naming can follow the existing project structure, but the
prototype should clearly separate:

```text
/events
```

For Local Events:

- Curated local and partner events.
- Highlighted Pagu and partner events.
- Public-facing event discovery.

```text
/community-events
```

For Community Events:

- Member-created events.
- Existing community events list.
- Create event action.
- Event detail and application/RSVP behavior.

If a tabbed Events page is easier in Lovable, it can still be acceptable as
long as the UX clearly separates Local Events from Community Events.

## Subtasks

### 1. Audit Current Events Prototype

Review the current events-related routes and mock data:

- `src/routes/events.tsx`
- `src/routes/community-events.index.tsx`
- `src/routes/community-events.$id.tsx`
- `src/routes/community-events.new.tsx`
- `src/lib/events-mock.ts`

Check:

- Which screens already exist.
- Which buttons and CTAs already work.
- Which event types already exist.
- Which states are missing or unclear.
- Whether the existing Community Events page can stay mostly intact.

Deliverable:

- A short list of what can be reused and what needs to change.

### 2. Define Event Categories And Event Sources

Separate event source/type clearly in the mock data:

- Community-created events.
- Pagu-curated events.
- Partner-organized local events.
- Other selected local events.

Recommended event source labels:

```text
community
pagu
partner
local_curated
```

Recommended UI labels:

- Community Event.
- Pagu Pick.
- Partner Event.
- Local Highlight.

Deliverable:

- Event cards and detail views make the source obvious.

### 3. Improve Community Events Page

Keep the existing page concept and strengthen it.

Requirements:

- Keep the create-event button.
- Make it clear that members can create events.
- Preserve list/filter behavior where it already works.
- Improve cards with event title, date, city, category, host, capacity, and
  participation status.
- Keep or improve event types:
  - public RSVP
  - request to join
  - invite only
- Add useful empty states.

Deliverable:

- Community Events page feels like a member-led event board.

### 4. Improve Community Event Detail

Requirements:

- Show event description, category, date, time, city, location, host, and
  capacity.
- Show the participation model clearly.
- Show user-specific state:
  - can join
  - request pending
  - approved
  - rejected
  - full
  - invite only
- Keep CTA language clear:
  - Join event
  - Request to join
  - Cancel request
  - Invite only

Deliverable:

- A member can understand what the event is and what action is available.

### 5. Improve Create Community Event Flow

Requirements:

- Keep the existing create action available from Community Events.
- Review and improve fields:
  - title
  - description
  - category
  - date
  - time
  - city
  - location
  - maximum attendees
  - event type
  - optional application questions
- Add validation and success/error feedback in the mockup.
- After creation, route the member to the new event or back to the list with
  clear confirmation.

Deliverable:

- Members can create a credible community event in the prototype.

### 6. Build Local Events Page

Requirements:

- Separate Local Events from Community Events.
- Show curated events organized by partners and selected by Pagu.
- Highlight selected Pagu and partner events at the top.
- Show other local events below the highlighted section.
- Use richer cards for highlighted events.
- Include source labels such as Pagu Pick or Partner Event.
- Include city, date, category, venue/location, and CTA.

Possible sections:

- Featured by Pagu.
- Partner events.
- More local events.

Deliverable:

- Local Events feels curated and editorial, not user-generated.

### 7. Add Event Organizer/Partner Signals

For Local Events:

- Show partner name.
- Show venue or organizer.
- Show whether the event is selected by Pagu.

For Community Events:

- Show member host.
- Show attendee count or spots left.

Deliverable:

- Users can distinguish community hosts, Pagu picks, and local partners.

### 8. Add Social/Event Discovery Details Inspired By Vibes

Use Vibes as inspiration without copying exact UI.

Potential improvements:

- Show what is happening soon.
- Show event popularity or number of people interested.
- Show "people going" in a privacy-conscious mockup.
- Add save/favorite affordance if useful.
- Add share/invite affordance as a mock interaction.
- Make cards feel lively and community-driven.

Deliverable:

- Events feel social and active, not like a static directory.

### 9. Keep Block 4 Ready

Block 4 will merge Events into Discover, so Block 3 should prepare for that
without implementing the merge yet.

Do:

- Create reusable event card patterns if needed.
- Keep event mock helpers clean.
- Keep Local Events and Community Events concepts distinct.
- Avoid editing Discover routes unless absolutely necessary.

Do not:

- Merge Events into Discover in this branch.
- Rebuild Discover filters.
- Change Discover IA.

Deliverable:

- Block 4 can later reuse event cards/data without untangling Block 3.

### 10. QA Checklist

Check:

- Community Events list works.
- Community Events create button is visible and understandable.
- Community Event detail states are clear.
- Local Events page separates highlighted and other events.
- Partner/Pagu/community labels are visible.
- Mobile layout is readable.
- Empty states are useful.
- No hand edits to `src/routeTree.gen.ts`.
- No unnecessary changes to `src/components/header.tsx`.
- No unnecessary changes to Discover files.

## Suggested Implementation Order

1. Audit existing events routes and mocks.
2. Update event data model/mock shape for event source and highlighted status.
3. Improve Community Events list while preserving the existing flow.
4. Improve Community Event detail and join/apply states.
5. Improve Create Community Event flow.
6. Build or refine Local Events page.
7. Add Pagu/partner/community labels and highlighted sections.
8. Do a mobile and empty-state pass.
9. Verify that Block 4 can later merge the result into Discover.

## Files To Prefer

Primary files:

- `src/routes/events.tsx`
- `src/routes/community-events.index.tsx`
- `src/routes/community-events.$id.tsx`
- `src/routes/community-events.new.tsx`
- `src/lib/events-mock.ts`

Possible new files:

- `src/components/events/*`
- event-specific helper modules under `src/lib/`

Avoid unless coordinated:

- `src/components/header.tsx`
- `src/routes/discover*`
- `src/lib/discover-mock.ts`
- `src/styles.css`
- `src/routeTree.gen.ts`

## Open Questions

1. Should Local Events live at `/events` and Community Events at
   `/community-events`, or should both appear under one Events page with tabs?
2. Should Pagu events be visually separated from partner events, or should both
   appear together as highlighted Local Events?
3. Should members be able to RSVP to Local Events in the mockup, or should Local
   Events mainly link to more information?
4. Should Community Events require completed profile or mock-approved member
   state before creating an event?
5. What are the minimum event categories for the prototype?
