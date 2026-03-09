# Dokploy Cutover For gg.rahmanef.com

Date: March 9, 2026
Target app: `openclaw-ui`
Target public domain: `gg.rahmanef.com`
Related OpenClaw domain: `ai.rahmanef.com`

## Goal

Replace the current demo app bound to `gg.rahmanef.com` with this Auth App deployment.

## What Is Already In Code

Required runtime vars are documented in:
- `.env.example`
- `README.md`

Critical vars for production:
- `HOSTED_URL=https://gg.rahmanef.com`
- `OPENCLAW_WORKFLOW_URL=https://ai.rahmanef.com/webhooks/auth/device-pending`
- `OPENCLAW_SHARED_SECRET=<same value configured on ai.rahmanef.com>`
- `OPENCLAW_ALLOWED_CLOCK_SKEW_SECONDS=300`
- `OPENCLAW_NONCE_TTL_SECONDS=300`
- `AUTH_SECRET=<strong random secret>`
- `NEXT_PUBLIC_CONVEX_URL=<prod convex url>`
- `CONVEX_DEPLOYMENT=<prod deployment>`

## Dokploy Cutover Steps

1. Create or update the Dokploy application for this repo.
2. Set build/runtime to use the repo `Dockerfile`.
3. Set the production environment variables listed above.
4. Remove `gg.rahmanef.com` from the current demo app in Dokploy.
5. Attach `gg.rahmanef.com` to the new `openclaw-ui` deployment.
6. Redeploy and confirm TLS is active.
7. Verify:
   - `https://gg.rahmanef.com/login`
   - `https://gg.rahmanef.com/api/auth/device/pending`
   - signed callback path from `ai.rahmanef.com`

## Important Note

This repo does not contain Dokploy domain binding config or VPS reverse-proxy config.
That means detaching `gg.rahmanef.com` from the old demo app cannot be done from source code alone.
It must be performed in Dokploy or on the VPS proxy layer where the current domain mapping exists.

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
