# Manef UI

Frontend repo for Manef, served on `https://gg.rahmanef.com`.

Backend ownership has moved to the separate `manef-db` repo, served on
`https://dbgg.rahmanef.com`.

## Auth Setup 

This template now uses `next-auth@5` credentials auth with a simple admin
fallback:

- `AUTH_SECRET`
- `AUTH_DEVICE_SALT`
- `OPENCLAW_SHARED_SECRET`
- `OPENCLAW_ALLOWED_CLOCK_SKEW_SECONDS`
- `OPENCLAW_NONCE_TTL_SECONDS`
- `OPENCLAW_WORKFLOW_URL`

Admin bootstrap credentials and invite-email envs now live in the backend repo
`manef-db`, not in `manef-ui`.

Quick start:

1. Copy `.env.example` to `.env.local` and fill the auth + Convex values.
2. Run `npm install`.
3. Ensure `manef-db` is available if you need the backend locally.
4. Run `npm run dev`.
5. Login at `/login` with your configured admin credentials.

Extending auth:

- Replace credentials auth in `auth.ts` with OAuth/email providers as needed.
- Keep middleware route protection in `middleware.ts`.
- Keep Convex client wiring in `shared/providers/ConvexClientProvider.tsx`.

Included:

- Convex-backed data access through the separate `manef-db` repo
- Member invite emails using [Resend](https://resend.com)
- User sign-in with [NextAuth.js](https://authjs.dev)
- Website router with [Next.js](https://nextjs.org/)
- Slick UX with [shadcn/ui](https://ui.shadcn.com/)

Check out [Convex docs](https://docs.convex.dev/home), and
[Convex Ents docs](https://labs.convex.dev/convex-ents)

## Screenshots

`<img alt="Personal Account and Teams" src="https://cdn.sanity.io/images/ts10onj4/production/574eeb5fd38aa598e2068b765390e0dc8b220075-1890x742.png" width="400">`

`<img alt="Members management" src="https://cdn.sanity.io/images/ts10onj4/production/2a0334dddfdc3a52bb7ffb5c74b58edf8a7b9e03-1894x1130.png" width="400">`

`<img alt="Invites management" src="https://cdn.sanity.io/images/ts10onj4/production/ee70ea18510494e3b67eb58639fc8f11344a4a83-1512x398.png" width="330">`

`<img alt="Invite accept flow" src="https://cdn.sanity.io/images/ts10onj4/production/afbf9daf190f992af8eadfba6daaf175b7bea679-1864x1070.png" width="400">`

## Repo Split

- Frontend repo: `rahmanef63/manef-ui`
- Backend repo: `rahmanef63/manef-db`
- Frontend domain: `gg.rahmanef.com`
- Backend domain: `dbgg.rahmanef.com`
