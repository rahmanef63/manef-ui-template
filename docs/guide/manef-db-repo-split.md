# Manef DB Repo Split

Date: March 10, 2026
Status: initial transition applied

## Goal

Move Convex schema, functions, and generated API/types out of `manef-ui` into
the separate `manef-db` repo while keeping the UI able to consume typed Convex
references.

## Current transition

- `manef-db/convex` now contains the copied Convex backend source.
- `manef-db` exports:
  - `@manef/db/api`
  - `@manef/db/dataModel`
  - `@manef/db/permissions`
- `manef-ui` now imports generated Convex API/types from `@manef/db` instead of
  `@/convex/_generated/*`.
- `manef-ui` no longer starts local Convex in its default `npm run dev`.

## Why this shape

The docs and current codebase showed two important facts:

1. `manef-ui` was not only using `shared/convex/*` function references.
2. Several UI routes imported `@/convex/_generated/api` directly.

That means a repo split needs an exported backend package, not only a copied
`convex/` folder.

## Remaining work

1. Run `npm install` inside `manef-db`.
2. Run `npm install` inside `manef-ui` so the local `file:../manef-db`
   dependency is linked.
3. Run `npm run dev` in `manef-db` to regenerate Convex outputs against the new
   repo.
4. Verify `manef-ui` typecheck/build against the exported package.
5. After validation, remove the old `manef-ui/convex` folder or keep it only as
   a short-lived fallback during migration.

## Recommended final state

- `manef-db` becomes the only owner of:
  - `convex/`
  - Convex env/deploy config
  - codegen outputs
- `manef-ui` keeps only:
  - UI code
  - typed function refs in `shared/convex` if desired
  - runtime Convex URL config

For a true remote split, replace `file:../manef-db` with either:
- a private npm package, or
- a git dependency pinned to a commit/tag.
