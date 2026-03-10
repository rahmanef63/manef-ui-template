# Dokploy Cutover For gg.rahmanef.com

Date: March 9, 2026
Target app: `manef-ui`
Target public domain: `gg.rahmanef.com`
Related backend domain: `dbgg.rahmanef.com`

## Goal

Run the `manef-ui` frontend on `gg.rahmanef.com` and point it to the separated
`manef-db` backend on `dbgg.rahmanef.com`.

## What Is Already In Code

Required runtime vars are documented in:
- `.env.example`
- `README.md`

Critical vars for production:
- `HOSTED_URL=https://gg.rahmanef.com`
- `NEXTAUTH_URL=https://gg.rahmanef.com`
- `NEXT_PUBLIC_CONVEX_URL=https://dbgg.rahmanef.com`
- `CONVEX_SERVER_URL=` (leave blank in normal production)
- `OPENCLAW_ALLOWED_CLOCK_SKEW_SECONDS=300`
- `OPENCLAW_NONCE_TTL_SECONDS=300`
- `AUTH_SECRET=<strong random secret>`
- `OPENCLAW_WORKFLOW_URL=<workflow url if used>`
- `OPENCLAW_SHARED_SECRET=<shared secret if used>`

## Dokploy Cutover Steps

1. Create or update the Dokploy application for this repo.
2. Set build/runtime to use the repo `Dockerfile`.
3. Set the production environment variables listed above.
4. Attach `gg.rahmanef.com` to the `manef-ui` deployment.
5. Confirm the backend `dbgg.rahmanef.com` route is already active from the `manef-db` deployment.
6. Redeploy and confirm TLS is active.
7. If `dbgg.rahmanef.com` TLS is still not valid, stop here and fix backend TLS first
   instead of keeping a long-term production override.
8. Verify:
   - `https://gg.rahmanef.com/login`
   - `https://gg.rahmanef.com/api/auth/device/pending`
   - frontend requests resolve to `https://dbgg.rahmanef.com`

## Important Note

This repo does not contain Dokploy domain binding config or VPS reverse-proxy config.
Frontend and backend domain attachment still must be done in Dokploy or on the VPS proxy layer.

## Smoke Checks After Cutover

1. Login on `gg.rahmanef.com` with admin credential.
2. Trigger a pending device flow from a second browser/device.
3. Confirm event reaches `ai.rahmanef.com`.
4. Approve from OpenClaw or local `/dashboard/security`.
5. Retry login from pending device.
6. Test:
   - `POST /api/auth/device/approve`
   - `POST /api/auth/device/revoke`
   - `POST /api/auth/session/revoke`
   - `POST /api/auth/session/revoke-all`

## Expected HTTP Semantics

Action endpoints now return:
- `200` for `ok`
- `200` for `already_done`
- `404` for `not_found`
- `403` for `forbidden`
