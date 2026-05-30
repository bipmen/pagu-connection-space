# Pagu — Team Workflow

This document keeps **B. (Bruna)**, **N. (Natalia)**, and **G. (Gaurav)** working
in parallel on the Pagu codebase without stepping on each other.

Read this before you start any session of work. Update it whenever the
ownership map or hot-zone list changes.

---

## 1. Code ownership map

Each teammate is the **primary owner** of the files below. Others can read
them anytime, but should ping the owner before editing.

### G. (Gaurav) — Landing, Auth, Profile, Dashboard, design review
- `src/routes/index.tsx` (landing)
- `src/routes/about.tsx`
- `src/routes/contact.tsx`
- `src/routes/login.tsx`
- `src/routes/register.tsx`
- `src/routes/profile.tsx`
- `src/routes/dashboard.tsx`
- `src/routes/support-login.tsx`, `src/routes/support-thank-you.tsx`
- `src/components/sections/*` (landing sections)
- `src/components/auth/*`
- `src/lib/auth-mock.ts`
- `src/lib/session-mock.ts` (shared — see Hot zones)
- `src/styles.css` (shared — see Hot zones)

### N. (Natalia) — Events (public + community)
- `src/routes/events.tsx`
- `src/routes/community-events.index.tsx`
- `src/routes/community-events.$id.tsx`
- `src/routes/community-events.new.tsx`
- `src/lib/events-mock.ts`

### B. (Bruna) — Discover, Safe Spaces, RHRN, chats
- `src/routes/discover.index.tsx`
- `src/routes/discover.apply.tsx`
- `src/routes/discover.safe-space.$id.tsx`
- `src/routes/rhrn.index.tsx`
- `src/routes/rhrn.$id.tsx`
- `src/routes/rhrn.chats.tsx`
- `src/routes/rhrn.chat.$id.tsx`
- `src/routes/rhrn.requests.tsx`
- `src/components/discover/*`
- `src/components/rhrn/*`
- `src/lib/discover-mock.ts`
- `src/lib/safe-spaces-mock.ts`
- `src/lib/rhrn-mock.ts`

---

## 2. Hot zones (shared files — coordinate first)

These files are touched by more than one feature. **Always say in chat
before editing them**, and keep changes surgical.

| File | Why it's hot | Rule |
|---|---|---|
| `src/components/header.tsx` | Nav for everyone | Only add/remove links via PR comment; never rewrite the structure |
| `src/lib/session-mock.ts` | Auth used by all features | Owner: G. Others propose changes, G. lands them |
| `src/routes/__root.tsx` | Root layout | Touch only for global providers / meta |
| `src/styles.css` | Design tokens | Add tokens, don't redefine existing ones; never remove a token without checking usages |
| `src/routes/dashboard.tsx` | Aggregates every feature's data | Each owner adds their own tile; G. owns layout |
| `src/routeTree.gen.ts` | **Auto-generated** | Never edit by hand. Let the dev server regenerate it. If it conflicts on merge, delete it and restart `bun dev` |

---

## 3. Naming conventions

- **Routes:** flat dot-separated (`rhrn.chat.$id.tsx`), not nested folders.
- **Mock data files:** `<feature>-mock.ts` in `src/lib/`.
- **Components:** grouped by feature folder under `src/components/<feature>/`.
- **Mock IDs:** prefix by feature to avoid collisions across mock stores:
  - Discover people: `p1`, `p2`… (B.)
  - Safe spaces: `s1`, `s2`… (B.)
  - Community events: `e1`, `e2`… (N.)
  - RHRN sessions: derived from user IDs (B.)
- **CSS tokens:** semantic only (`--accent-warm`, `--surface-elevated`), never
  raw color names. Match existing `oklch(...)` format.

---

## 4. Integration order

A small bit of sequencing prevents big rebases:

1. **G. locks the data contracts first** — `User`, `Session`, dashboard tile
   props. Anything other features will read from must be stable.
2. **Parallel phase** —
   - B. on Discover / RHRN / Safe Spaces
   - N. on Events
   - G. on landing, auth, profile, UI polish
3. **Integration pass** — one teammate (rotates each sprint) does a final
   sweep on `header.tsx` + `dashboard.tsx` to wire everything together and
   confirms the build is green.

---

## 5. Mock-data etiquette

All mocks today use `localStorage`. To avoid clobbering each other:

- **Namespace your keys** with the feature prefix:
  `pagu.rhrn.sessions`, `pagu.discover.applications`, `pagu.events.rsvps`, etc.
- **Seed flags** must be feature-scoped too: `pagu.rhrn.seeded`,
  `pagu.discover.seeded`. Never reuse a single global `seeded` flag.
- **Adding new mock records:** append to the existing array constants in the
  relevant `-mock.ts` file. Don't reformat the whole file (huge diff = merge
  pain). Keep IDs unique within your feature's prefix range.
- **Reading another feature's data** (e.g. Dashboard reads from all of them)
  is fine, but only through that feature's exported helpers — never reach
  into `localStorage` keys directly across feature boundaries.

---

## 6. Conflict resolution

- **Prefer rebase** over merge for personal branches — keeps history flat.
- **`routeTree.gen.ts` conflict** → delete the file, run `bun dev`, commit
  the regenerated version. Never hand-resolve.
- **`header.tsx` conflict** → whoever pushes second rebases and keeps the
  union of both link arrays. If unsure, ping G.
- **`session-mock.ts` / `styles.css` conflict** → stop, ping G., resolve
  together. These power everything else.
- **Same component edited by two people** → smaller change rebases on top
  of the larger one. If both are large, split the component before merging.

---

## TL;DR

- Stay inside your ownership zone.
- Coordinate on the 6 hot-zone files in section 2.
- Never edit `routeTree.gen.ts`.
- Prefix your mock keys and IDs.
- G. owns the integration pass.
