# Project Rules

Purpose: keep the UI template consistent, secure, and maintainable as features grow.

## Structure boundaries
- app/ : routing, layout, pages, and route-specific UI.
- components/ : shared UI, layout, typography, and helpers.
- features/ : feature manifests and configuration only (no UI rendering).
- shared/ : shared config, types, and Convex function references.
- convex/ : backend schema, mutations, queries, and auth/permissions.

## Conventions
- Prefer feature-level boundaries: feature config in features/, shared data contracts in shared/.
- Keep UI components in components/ and avoid feature-specific logic there.
- One source of truth for menus: shared/config plus Convex overrides.
- Prefer typed Convex function references from shared/convex.
- Providers (auth, Convex, theme, etc.) live in shared/providers.
- Auth helpers live in shared/auth.
- Error handling helpers live in shared/errors.

## Type safety and validation
- Types must be imported from shared/types (no direct Convex type imports in app/components/features).
- Avoid any and ts-ignore; document any exceptions inline.
- Validate environment variables at startup (client and server).
- Validate user input with zod or Convex validators.

## Error handling
- Always handle promise rejections (no floating promises).
- Prefer shared/errors/handleFailure for UI handlers.
- Log errors in client boundaries and surface user-friendly messages.

## Auth and permissions
- Route access is protected in middleware; always re-check access in Convex.
- Never trust client-provided role or permission data.

## Frontend performance
- Use Server Components by default; opt into "use client" only when needed.
- Split heavy client components with dynamic import and suspense.
- Prefer next/image for large media assets.

## PWA
- Keep manifest metadata in app/manifest.ts.
- If PWA is required, implement caching and update flows in public/sw.js.

## Tooling
- Lint should cover the entire source tree (avoid broad ignore patterns).
- Add tests for critical logic (Convex permissions, invite flow, auth gating).
- Use one package manager and one lockfile.

## ESLint boundaries (enforced)
- app/ can import components/, shared/, shared/types/, features/, hooks/, lib/.
- components/ can import components/, shared/, shared/types/, hooks/, lib/.
- features/* can import only same feature, shared/, shared/types/, lib/.
- shared/ can import shared/, shared/types/, features/, lib/.
- shared/types can import convex/ (type re-exports only).
- shared/errors can import components/ for UI error surfaces.
