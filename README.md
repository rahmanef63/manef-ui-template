# SaaS Starter: Convex + TypeScript + Next.js + NextAuth + Tailwind + shadcn/ui

## Auth Setup (No Clerk Required)

This template now uses `next-auth@5` credentials auth with a simple admin
fallback:

- `AUTH_SECRET`
- `AUTH_ADMIN_EMAIL`
- `AUTH_ADMIN_PASSWORD`

Quick start:

1. Copy `.env.example` to `.env.local` and fill the auth + Convex values.
2. Run `npm install`.
3. Run `npm run dev`.
4. Login at `/login` with your configured admin credentials.

Extending auth:

- Replace credentials auth in `auth.ts` with OAuth/email providers as needed.
- Keep middleware route protection in `middleware.ts`.
- Keep Convex token wiring in `shared/providers/ConvexClientProvider.tsx` and
  `shared/auth/getAuthToken.ts`.

Build your SaaS website in no time! Included:

- Realtime database for implementing your product with
  [Convex](https://convex.dev)
  - Team/organization management
  - Configurable roles and permissions
- Member invite emails using [Resend](https://resend.com)
- User sign-in with [NextAuth.js](https://authjs.dev)
- Website router with [Next.js](https://nextjs.org/)
- Slick UX with [shadcn/ui](https://ui.shadcn.com/)

Check out [Convex docs](https://docs.convex.dev/home), and
[Convex Ents docs](https://labs.convex.dev/convex-ents)

## Screenshots

<img alt="Personal Account and Teams" src="https://cdn.sanity.io/images/ts10onj4/production/574eeb5fd38aa598e2068b765390e0dc8b220075-1890x742.png" width="400">

<img alt="Members management" src="https://cdn.sanity.io/images/ts10onj4/production/2a0334dddfdc3a52bb7ffb5c74b58edf8a7b9e03-1894x1130.png" width="400">

<img alt="Invites management" src="https://cdn.sanity.io/images/ts10onj4/production/ee70ea18510494e3b67eb58639fc8f11344a4a83-1512x398.png" width="330">

<img alt="Invite accept flow" src="https://cdn.sanity.io/images/ts10onj4/production/afbf9daf190f992af8eadfba6daaf175b7bea679-1864x1070.png" width="400">

## Architecture Notes (SSOT + Menu Overrides)

- Feature manifests live in `features/<feature>/config.ts` as the single source of truth.
- The sidebar menu is built from manifests in `shared/config`, then merged with
  overrides stored per team in Convex (`convex/menu.ts` + `convex/admin/menu.ts`).
- PWA scaffolding is enabled via `app/manifest.ts` and `public/sw.js` (replace icons in `public/icons`).

## Setting up

```
npm create convex@latest -- -t xixixao/saas-starter
```

Then:

1. Run `npm run dev`.
2. Run `npx convex run init:init` to initialize permissions and roles in Convex.
