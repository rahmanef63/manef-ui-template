# Codebase Review (January 25, 2026)

## Current structure (top-level)
- app/: Next.js App Router pages, layouts, and route components
- components/: shared UI, layout, typography, helpers
- features/: feature manifests and config
- shared/: shared types, config, and Convex function references
- hooks/: reusable hooks
- docs/: documentation (best-practice + rule)

Note: backend Convex ownership has moved to the separate repo `manef-db`. Any
remaining `convex/` files in this repo should be treated as legacy cleanup work,
not as the active backend source of truth.

## Pros (current structure)
- Clear split between frontend (`manef-ui`) and backend (`manef-db`).
- Feature manifests are centralized in features/ with shared config as SSOT.
- Shared types and Convex function references live in shared/, reducing imports from backend.
- Auth and permissions are centralized (middleware + Convex checks).
- App Router + metadata + manifest are already in place.

## Cons (current structure)
- Multiple lockfiles imply mixed package manager usage.
- Backend dev script disables typecheck, weakening feedback loops.

## Best practices already applied
- Next.js App Router and metadata usage (app/layout.tsx, app/manifest.ts).
- Route protection via NextAuth proxy.ts middleware (proxy.ts).
- Data model definitions in Convex schema with explicit indexes.
- Shared function references for Convex calls (shared/convex/*).
- Form validation via zod where used (e.g., CreateTeamDialog).

## Best practices missing or incomplete
- Environment variable validation (client + server) with explicit errors.
- Single package manager and lockfile.
- Automated tests for auth/permissions and key Convex functions.
- Production PWA caching/update strategy (current sw.js is a stub).
- CI checks (typecheck + lint + tests) are not defined.

## Issues found and suggested improvements
1) Mixed lockfiles (npm + pnpm)
   - Files: package-lock.json, pnpm-lock.yaml
   - Risk: non-reproducible installs across teams/CI.
   - Fix: pick one package manager and remove the other lockfile.

2) Legacy Convex files still exist in UI repo
   - Files: `convex/*`
   - Risk: stale references break lint/typecheck and confuse ownership.
   - Fix: remove or archive the leftover files once all imports are confirmed detached.

3) TypeScript target is legacy
   - File: tsconfig.json
   - Risk: unnecessary transpilation and limited modern JS features.
   - Fix: set target to ES2017+ (align with Next 14 defaults).

4) Next.js ESLint version mismatch
   - File: package.json
   - Risk: lint rules may be out of sync with Next.js 14.
   - Fix: align eslint-config-next version with installed Next version.

5) Missing env validation
   - Files: shared/providers/ConvexClientProvider.tsx, .env.example
   - Risk: runtime crashes when env vars are missing or malformed.
   - Fix: add a typed env module and fail fast on startup.

6) UI flow suggests a plan selector but it is not wired
   - File: app/dashboard/CreateTeamDialog.tsx
   - Risk: confusing UX and incomplete form state.
   - Fix: connect plan to zod schema or remove the selector.

7) PWA service worker is a stub
   - File: public/sw.js
   - Risk: misleading PWA behavior (no offline cache).
   - Fix: implement caching strategy or remove PWA registration until ready.

## Resolved during cleanup
- Duplicate hook implementation removed (single source in hooks/).
- Lint coverage expanded (components/ui no longer ignored).
- Providers consolidated under shared/providers.
- Auth helper consolidated under shared/auth.
