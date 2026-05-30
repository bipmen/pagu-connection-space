## PAGU V6 — Community Map (Discover + RHRN merge)

Merge `/discover` and `/rhrn` into a single `/community-map` experience while keeping existing detail pages working.

### New route structure

- **`/community-map`** (new, replaces `/discover` and `/rhrn` index) — unified map + filters + bottom sheet
- **`/community-map/space/$id`** — Safe Space profile (move from `/discover/safe-space/$id`)
- **`/community-map/event/$id`** — Event detail (reuse `/community-events/$id` logic, link to it)
- **`/community-map/person/$id`** — Person profile (move from `/rhrn/$id`)
- **`/community-map/apply`** — Safe Space application (move from `/discover/apply`)
- **`/community-map/chat/$id`** — Chats (move from `/rhrn/chat/$id`)
- **`/community-map/requests`** — Connection requests (move from `/rhrn/requests`)

Old routes (`/discover`, `/rhrn`) become redirects to `/community-map` to preserve existing links.

### Files to create

1. `src/lib/community-map-mock.ts` — unified mock data:
   - Cities (Cologne default, Berlin, Hamburg, Munich) with summary counts
   - Unified marker type `{ id, kind: 'event'|'space'|'person', x, y, ...payload }`
   - Re-export/wrap existing `safe-spaces-mock`, `events-mock`, `rhrn-mock` data
   - Clustering helper (group nearby people markers when zoom < threshold)
2. `src/components/community-map/CommunityMap.tsx` — extended map (zoom/pan, 3 marker types, clusters)
3. `src/components/community-map/MarkerBottomSheet.tsx` — bottom sheet with preview + "View Details" CTA
4. `src/components/community-map/CitySummaryCard.tsx`
5. `src/components/community-map/CategoryFilters.tsx` — Community / Activities / Places / People
6. `src/components/community-map/AvailableNowToggle.tsx`
7. `src/components/community-map/EmptyCityState.tsx`
8. `src/routes/community-map.index.tsx` — page composition
9. `src/routes/community-map.space.$id.tsx`, `community-map.event.$id.tsx`, `community-map.person.$id.tsx`, `community-map.apply.tsx`, `community-map.chat.$id.tsx`, `community-map.requests.tsx`
10. `src/routes/discover.index.tsx`, `src/routes/rhrn.index.tsx` — replaced with `<Navigate to="/community-map" />`

### Files to edit

- `src/components/header.tsx` — replace "Discover" + "RHRN" nav items with single "Community Map" (logged-in only, per existing auth gate)
- `src/routes/dashboard.tsx` — update tile links from `/discover` and `/rhrn` to `/community-map`
- `src/components/sections/*` and landing CTAs — update any link to `/discover` → `/community-map`
- `src/lib/safe-spaces-mock.ts` — add `certifiedSince`, `certificationStatus` (Applied → Training Scheduled → Training Completed → Certified → Renewal), `validUntil`, `category`, lat/lng-style x/y; expand list with the 8 mock venues from brief
- `src/lib/events-mock.ts` — add `hostedAtSafeSpaceId?`, `isOfficialPagu: boolean`, `attendanceCount`, `x/y`; ensure 6 events from brief
- `src/lib/rhrn-mock.ts` — already has people; add `availabilityIntentions: string[]`, `languages`, `memberSince`, `isOrganizer`, ensure 12 mock members with x/y
- Safe Space profile page — add certification flow visual (5-step progress), 12-month validity note
- Event detail — add "Hosted at Pagu Safe Space" badge when linked, official vs community badge
- New event form — add location-type radio (Safe Space / Other)

### Behavior details

- **Filters**: Community (default, shows all) / Activities / Places / People — single-select pill bar
- **Available Now toggle**: when on, force People filter, hide events/places markers
- **Bottom sheet**: opens on marker tap; shows preview card with "View Details" → routes to detail page
- **Clustering**: simple distance-based grouping for person markers when `zoom < 1.5`, expands to individuals when zoomed in
- **Connection flow** (mock): View Profile → Connect → Icebreaker picker → mock "Request sent" → request appears in `/community-map/requests` (already exists pattern)
- **Empty city**: if city has 0 of everything, render `EmptyCityState` with three CTAs (Create Event / Suggest Safe Space / Join Waitlist) — all open mock dialogs

### Out of scope

- No real map provider (mock SVG/CSS map continues from existing `map-mock.tsx`)
- No backend / no DB migration — entity shapes documented in `community-map-mock.ts` types only
- No changes to auth gating logic itself (Community Map inherits the logged-in nav slot Discover/RHRN already had)

### Database architecture (documented as TS types only, no backend)

Type definitions in `community-map-mock.ts` for: `City`, `User`, `Event`, `SafeSpace`, `SafeSpaceApplication`, `Certification`, `Review`, `Report`, `AvailabilitySession`, `ConnectionRequest`, `Chat`.

### Coordination with team (per `TEAM_WORKFLOW.md`)

This touches Bianca's areas (Discover, RHRN, Safe Spaces) + hot zones (`header.tsx`, `dashboard.tsx`). Recommend merging from a single branch in one pass to avoid header conflicts with Natalia/Gaurav. Will note this in commit guidance after implementation.
