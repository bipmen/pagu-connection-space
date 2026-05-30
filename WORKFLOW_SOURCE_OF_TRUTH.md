# Workflow Source Of Truth

This project is currently in a transition period with two parallel realities:

1. the old `Lovable -> Vite/TanStack` UI generation path
2. the new `Next.js -> Vercel -> Clerk -> Neon` product runtime path

If this is not handled explicitly, Git merges will keep mixing UI changes with old runtime behavior and slow down the migration.

## Primary Rule

The source of truth for **runtime architecture** is:

- `Next.js App Router`
- `src/app/**`
- `next.config.ts`
- `tsconfig.json`
- the `npm run dev` / `npm run build` path

The source of truth for **generated UI ideas** may still be:

- Lovable
- legacy `Vite/TanStack` output
- `src/routes/**` and related legacy files

But those legacy outputs are **not** the runtime source of truth anymore.

## What This Means In Practice

### Next App Is The Real App

Anything related to:

- routing
- auth flow
- backend integration
- API routes
- protected pages
- deployment behavior
- build behavior

should be implemented for the `Next.js` app, not the old legacy app.

Codex B and Codex C should target:

- `src/app/**`
- future `src/app/api/**`
- Clerk
- Neon
- Vercel
- Resend

Not:

- `src/routes/**`
- `src/router.tsx`
- `src/routeTree.gen.ts`
- `vite.config.ts`
- `wrangler.jsonc`

### Lovable Is A UI Source, Not The Runtime

If Lovable or a colleague creates UI changes in the legacy app, those changes should be treated as:

- design reference
- JSX/layout/styling source
- component inspiration

Those changes should be **ported into the Next app**, not merged wholesale as runtime truth.

## Allowed Merge Direction

Safe pattern:

1. Lovable updates land in a legacy/UI-source branch.
2. Team reviews the UI changes.
3. Only the useful UI pieces are ported into:
   - `src/app/**`
   - `src/components/pages/**`
   - `src/components/sections/**`
   - `src/components/ui/**`
   - shared shell/components used by the Next app

Unsafe pattern:

1. Lovable updates legacy routes and runtime wiring.
2. Those changes get merged wholesale into the Next migration branch.
3. Old routing/runtime assumptions get reintroduced.

## Files That Should Usually Not Be Blind-Merged From Lovable Output

These files are high-risk because they pull legacy runtime behavior back into the repo:

- `src/routes/**`
- `src/router.tsx`
- `src/routeTree.gen.ts`
- `src/routes/__root.tsx`
- `vite.config.ts`
- `wrangler.jsonc`
- legacy auth/session mock wiring unless explicitly reviewed

## Branch Guidance

Recommended mental model:

- `codex/platform-next-migration`
  Runtime/platform source of truth

- `codex/backend-auth-data`
  Backend/auth/data implementation against the Next app

- `codex/frontend-api-integration`
  Frontend wiring against the Next app and Codex B contracts

- optional Lovable/UI-source branch
  UI-generation/reference branch only

## Team Rule

Before merging a Lovable-driven branch into a Next-driven branch, ask:

1. Is this a UI/layout/style improvement?
2. Or is this old runtime behavior, old routing, or old app structure?

If it is UI:

- port it intentionally

If it is runtime:

- do not accept it automatically
- reimplement it in the Next architecture if still needed

## Why This Rule Exists

The project target stack is:

- `Next.js`
- `Vercel`
- `Clerk`
- `Neon`
- `Drizzle`
- `Resend`

Lovable output is still useful, but it is currently aligned more closely with the old app structure.

So the correct long-term workflow is:

- UI ideas can come from Lovable
- product runtime must converge on Next

## Short Version

Use Lovable for UI.

Use Next for the real app.

Port UI changes forward.

Do not let old runtime behavior merge back in by accident.
