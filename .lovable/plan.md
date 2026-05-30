Draft a `TEAM_WORKFLOW.md` at the project root to help B., Natalia, and Gaurav work in parallel without merge conflicts.

Scope
- One markdown file with collaboration rules specific to this Pagu repo.

Content sections
1. Code ownership map — who owns which routes / lib files / components.
2. Hot-zone rules — how to coordinate changes to shared files (header.tsx, session-mock.ts, styles.css, routeTree.gen.ts).
3. Naming conventions — branch/topic naming, mock data prefixes, file-naming patterns.
4. Integration order — the recommended sequence (Gaurav locks data contracts first, then parallel work, then one integration pass).
5. Mock-data etiquette — localStorage keys, seed flags, and how to add mock records without collisions.
6. Conflict resolution — rebase vs merge preference, who resolves header.tsx collisions.

No code changes, no new dependencies, no UI changes.

Deliverable: `TEAM_WORKFLOW.md` committed to repo root.