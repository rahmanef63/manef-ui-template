# Manef DB Repo Split

Date: March 10, 2026
Status: active split

## Goal

Move Convex schema, functions, and generated API/types out of `manef-ui` into
the separate `manef-db` repo while keeping the UI able to consume typed Convex
references.

## Repo and Domain Layout

- Frontend repo: `rahmanef63/manef-ui`
- Frontend domain: `https://gg.rahmanef.com`
- Backend repo: `rahmanef63/manef-db`
- Backend domain: `https://dbgg.rahmanef.com`

## Current transition

- `manef-db` is now the backend source of truth and already has its own git repo.
- `manef-db` exports:
  - `@manef/db/api`
  - `@manef/db/dataModel`
  - `@manef/db/permissions`
- `manef-ui` now imports generated Convex API/types from `@manef/db` instead of
  `@/convex/_generated/*`.
- `manef-ui` no longer starts local Convex in its default `npm run dev`.
- `manef-ui` runtime defaults now point to `dbgg.rahmanef.com`.

## Why this shape

The docs and current codebase showed two important facts:

1. `manef-ui` was not only using `shared/convex/*` function references.
2. Several UI routes imported `@/convex/_generated/api` directly.

That means a repo split needs an exported backend package, not only a copied
`convex/` folder.

## Remaining work

1. Verify `manef-ui` typecheck/build after removing legacy files that still point to deleted local Convex code.
2. Decide whether `@manef/db` stays as local `file:../manef-db` dependency or
   moves to git/package-registry distribution.
3. Finalize Dokploy deploy and TLS for `dbgg.rahmanef.com` so `CONVEX_SERVER_URL`
   is not needed outside local/dev fallback.

## Recommended final state

- `manef-db` becomes the only owner of:
  - `convex/`
  - Convex env/deploy config
  - codegen outputs
- `manef-ui` keeps only:
  - UI code
  - typed function refs in `shared/convex` if desired
  - runtime Convex URL config
  - optional server-side override env `CONVEX_SERVER_URL` for local/dev only

For a true remote split beyond side-by-side local repos, replace
`file:../manef-db` with either:
- a private npm package, or
- a git dependency pinned to a commit/tag.
